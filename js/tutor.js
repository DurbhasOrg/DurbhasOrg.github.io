import { findTutor, groupedSlots } from './data.js';
import { isSlotBooked, saveBooking, createBookingId } from './storage.js';
import { initializeAnalytics, trackTutorViewed, trackBookingStarted, trackBookingCompleted } from './analytics.js';

const params = new URLSearchParams(window.location.search);
const tutor = findTutor(params.get('id'));
const app = document.querySelector('#tutor-app');
let selectedSlot = null;
let bookingStarted = false;

function portrait(t) { return `<div class="portrait large" role="img" aria-label="Illustrated portrait placeholder for ${t.name}" style="--portrait:${t.color}">${t.initials}</div>`; }
function tags(values, className = '') { return values.map((value) => `<span class="tag ${className}">${value}</span>`).join(''); }
function escapeHtml(value) { const holder = document.createElement('div'); holder.textContent = value; return holder.innerHTML; }
function renderSlots() {
  const areas = Object.entries(groupedSlots(tutor)).map(([date, slots]) => `<section class="date-group"><h3>${date}</h3><div class="slot-list">${slots.map((slot) => {
    const booked = isSlotBooked(tutor.id, slot.id);
    const selected = selectedSlot?.id === slot.id;
    return `<button class="slot ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}" type="button" data-slot="${slot.id}" ${booked ? 'disabled aria-label="' + slot.time + ', booked and unavailable"' : 'aria-pressed="' + selected + '"'}>${slot.time}<span class="slot-status">${booked ? 'Booked' : selected ? 'Selected' : 'Available'}</span></button>`;
  }).join('')}</div></section>`).join('');
  document.querySelector('#slot-groups').innerHTML = areas;
  document.querySelectorAll('[data-slot]').forEach((button) => button.addEventListener('click', () => selectSlot(button.dataset.slot)));
}
function selectSlot(id) { selectedSlot = tutor.slots.find((slot) => slot.id === id); renderSlots(); document.querySelector('#booking-cta').hidden = false; }
function showBooking() {
  if (!selectedSlot || isSlotBooked(tutor.id, selectedSlot.id)) { selectedSlot = null; renderSlots(); return; }
  const panel = document.querySelector('#booking-panel');
  document.querySelector('#booking-summary').innerHTML = `<p><strong>${tutor.name}</strong> · $${tutor.hourlyRate}/hour</p><p>${selectedSlot.date} at ${selectedSlot.time}</p>`;
  panel.hidden = false;
  document.querySelector('#booking-cta').hidden = true;
  document.querySelector('#booking-subject').focus();
  if (!bookingStarted) { trackBookingStarted(tutor, document.querySelector('#booking-subject').value, `${selectedSlot.date} ${selectedSlot.time}`); bookingStarted = true; }
}
function showError(field, message) { const error = document.querySelector(`#${field}-error`); const input = document.querySelector(`#${field}`); error.textContent = message; input.setAttribute('aria-invalid', 'true'); }
function clearErrors() { document.querySelectorAll('.error').forEach((node) => node.textContent = ''); document.querySelectorAll('[aria-invalid="true"]').forEach((node) => node.removeAttribute('aria-invalid')); }
function submitBooking(event) {
  event.preventDefault(); clearErrors();
  if (!selectedSlot || isSlotBooked(tutor.id, selectedSlot.id)) { document.querySelector('#slot-message').textContent = 'That time was just booked in this browser. Please choose another available time.'; return; }
  const form = event.currentTarget;
  const parentName = form.parentName.value.trim();
  const parentEmail = form.parentEmail.value.trim();
  const studentName = form.studentName.value.trim();
  const studentGrade = form.studentGrade.value;
  const subject = form.subject.value;
  let invalid = false;
  if (!parentName) { showError('parent-name', 'Please enter your name.'); invalid = true; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) { showError('parent-email', 'Enter an email address we can use to reach you.'); invalid = true; }
  if (!studentName) { showError('student-name', 'Please enter your student’s first name.'); invalid = true; }
  if (!studentGrade) { showError('student-grade', 'Choose a grade level.'); invalid = true; }
  if (!subject) { showError('booking-subject', 'Choose the subject for this session.'); invalid = true; }
  if (invalid) return;
  const booking = { id: createBookingId(), tutorId: tutor.id, slotId: selectedSlot.id, slotLabel: `${selectedSlot.date} at ${selectedSlot.time}`, subject, studentGrade, parentName, parentEmail, studentName, createdAt: new Date().toISOString() };
  const saved = saveBooking(booking);
  if (!saved.ok) { document.querySelector('#slot-message').textContent = saved.reason === 'slot_taken' ? 'That time is no longer available. Please choose another slot.' : 'We could not save this booking in this browser. Please check your browser storage and try again.'; selectedSlot = null; renderSlots(); return; }
  trackBookingCompleted(booking, tutor);
  form.closest('#booking-panel').hidden = true;
  document.querySelector('#confirmation').hidden = false;
  document.querySelector('#confirmation').innerHTML = `<h2>You’re booked!</h2><p><strong>${escapeHtml(studentName)}</strong> is set to meet <strong>${tutor.name}</strong> for <strong>${subject}</strong>, ${escapeHtml(studentGrade)}, on <strong>${selectedSlot.date} at ${selectedSlot.time}</strong>.</p><p>The session rate is $${tutor.hourlyRate}/hour. Dana has been notified of your booking.</p><p class="confirmation-id">Booking reference: ${booking.id}</p><a class="button" href="index.html#find-tutor">Browse more tutors</a>`;
  selectedSlot = null; renderSlots(); document.querySelector('#confirmation').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (!tutor) {
  app.innerHTML = `<section class="empty-state"><h1>We couldn’t find that tutor.</h1><p>Please return to the directory to choose from ABC Tutoring’s available tutors.</p><a class="button" href="index.html#find-tutor">Back to tutors</a></section>`;
} else {
  app.innerHTML = `<a class="back-link" href="index.html#find-tutor">← Back to all tutors</a><article class="detail-card"><section class="detail-summary"><div class="detail-heading">${portrait(tutor)}<div><h1>${tutor.name}</h1><p class="rate">$${tutor.hourlyRate}/hour</p></div></div><p class="bio">${tutor.bio}</p><h2>Teaches</h2><div class="tags">${tags(tutor.subjects)}</div><h2>Works with</h2><div class="tags">${tags(tutor.gradeLevels, 'grade')}</div></section><section class="availability" aria-labelledby="availability-heading"><h2 id="availability-heading">Available sessions</h2><p class="availability-intro">Choose a time that works for your family. Times marked Booked are unavailable.</p><p id="slot-message" class="error" role="alert"></p><div id="slot-groups"></div><div id="booking-cta" class="booking-cta" hidden><button class="button" type="button" id="continue-booking">Continue to booking</button></div><section id="booking-panel" class="booking-panel" hidden aria-labelledby="booking-heading"><h2 id="booking-heading">A few details to reserve your time</h2><div id="booking-summary" class="booking-summary"></div><form id="booking-form" class="booking-form" novalidate><div class="field"><label for="parent-name">Parent name</label><input id="parent-name" name="parentName" autocomplete="name" required><span id="parent-name-error" class="error" role="alert"></span></div><div class="field"><label for="parent-email">Parent email</label><input id="parent-email" name="parentEmail" type="email" autocomplete="email" required><span id="parent-email-error" class="error" role="alert"></span></div><div class="field"><label for="student-name">Student first name</label><input id="student-name" name="studentName" autocomplete="off" required><span id="student-name-error" class="error" role="alert"></span></div><div class="field"><label for="student-grade">Student grade</label><select id="student-grade" name="studentGrade" required><option value="">Choose a grade</option><option>Elementary</option><option>Middle School</option><option>High School</option></select><span id="student-grade-error" class="error" role="alert"></span></div><div class="field full"><label for="booking-subject">Subject</label><select id="booking-subject" name="subject" required><option value="">Choose a subject</option>${tutor.subjects.map((subject) => `<option value="${subject}">${subject}</option>`).join('')}</select><span id="booking-subject-error" class="error" role="alert"></span></div><p class="form-note full">This is a prototype. Your booking is saved only in this browser; no email or text is actually sent.</p><div class="full"><button class="button" type="submit">Confirm booking</button></div></form></section><section id="confirmation" class="confirmation" hidden aria-live="polite"></section></section></article>`;
  renderSlots();
  document.querySelector('#continue-booking').addEventListener('click', showBooking);
  document.querySelector('#booking-form').addEventListener('submit', submitBooking);
  trackTutorViewed(tutor);
}
initializeAnalytics();

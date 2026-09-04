import { tutors, SUBJECTS, GRADE_LEVELS } from './data.js';
import { initializeAnalytics, trackSubjectSought } from './analytics.js';

const subjectFilter = document.querySelector('#subject-filter');
const gradeFilter = document.querySelector('#grade-filter');
const tutorList = document.querySelector('#tutor-list');
const resetButton = document.querySelector('#reset-filters');

function tags(values, className = '') { return values.map((value) => `<span class="tag ${className}">${value}</span>`).join(''); }
function portrait(tutor) { return `<div class="portrait" role="img" aria-label="Illustrated portrait placeholder for ${tutor.name}" style="--portrait:${tutor.color}">${tutor.initials}</div>`; }
function renderTutors() {
  const subject = subjectFilter.value;
  const grade = gradeFilter.value;
  const matches = tutors.filter((tutor) => (!subject || tutor.subjects.includes(subject)) && (!grade || tutor.gradeLevels.includes(grade)));
  if (!matches.length) {
    tutorList.innerHTML = `<div class="empty-state"><h3>No tutors match those filters yet.</h3><p>Try a different subject or grade level to see the full team.</p><button class="button button-secondary" type="button" id="empty-reset">Show all tutors</button></div>`;
    document.querySelector('#empty-reset').addEventListener('click', resetFilters);
    return;
  }
  tutorList.innerHTML = matches.map((tutor) => `<article class="tutor-card"><div class="card-top">${portrait(tutor)}<div><h3 class="card-title">${tutor.name}</h3><p class="card-rate">$${tutor.hourlyRate}/hour</p></div></div><div class="tags" aria-label="Subjects">${tags(tutor.subjects)}</div><div class="tags" aria-label="Grade levels">${tags(tutor.gradeLevels, 'grade')}</div><a class="button button-secondary" href="tutor.html?id=${encodeURIComponent(tutor.id)}" aria-label="View ${tutor.name}'s profile">View Tutor</a></article>`).join('');
}
function resetFilters() { subjectFilter.value = ''; gradeFilter.value = ''; renderTutors(); subjectFilter.focus(); }

SUBJECTS.forEach((subject) => subjectFilter.insertAdjacentHTML('beforeend', `<option value="${subject}">${subject}</option>`));
GRADE_LEVELS.forEach((grade) => gradeFilter.insertAdjacentHTML('beforeend', `<option value="${grade}">${grade}</option>`));
subjectFilter.addEventListener('change', () => { if (subjectFilter.value) trackSubjectSought(subjectFilter.value); renderTutors(); });
gradeFilter.addEventListener('change', renderTutors);
resetButton.addEventListener('click', resetFilters);
renderTutors();
initializeAnalytics();

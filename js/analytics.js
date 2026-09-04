const POSTHOG_TOKEN = 'phc_qJSSK839opXTtbJQYZmUSbpQD8dkcT9bEQaspXP3KoMh';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const queuedEvents = [];
let ready = false;

function flush() { if (!window.posthog?.capture) return; queuedEvents.splice(0).forEach(({ event, properties }) => window.posthog.capture(event, properties)); }
function capture(event, properties) { if (ready && window.posthog?.capture) window.posthog.capture(event, properties); else queuedEvents.push({ event, properties }); }

export function initializeAnalytics() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `${POSTHOG_HOST}/static/array.js`;
  script.onload = () => {
    if (!window.posthog?.init) return;
    window.posthog.init(POSTHOG_TOKEN, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false
    });
    ready = true;
    flush();
  };
  script.onerror = () => { queuedEvents.length = 0; };
  document.head.append(script);
}

export const trackSubjectSought = (subject) => capture('subject_sought', { subject, source: 'directory_filter' });
export const trackTutorViewed = (tutor) => capture('tutor_viewed', { tutor_id: tutor.id, tutor_name: tutor.name, subjects: tutor.subjects, grade_levels: tutor.gradeLevels, hourly_rate: tutor.hourlyRate });
export const trackBookingStarted = (tutor, subject, slot) => capture('booking_started', { tutor_id: tutor.id, tutor_name: tutor.name, subject: subject || undefined, slot });
export const trackBookingCompleted = (booking, tutor) => capture('booking_completed', { booking_id: booking.id, tutor_id: tutor.id, tutor_name: tutor.name, subject: booking.subject, student_grade: booking.studentGrade, slot: booking.slotLabel, hourly_rate: tutor.hourlyRate });

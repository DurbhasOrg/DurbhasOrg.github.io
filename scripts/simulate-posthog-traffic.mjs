// Development-only dashboard seeder. It sends anonymous synthetic event data
// directly to PostHog; it does not create real browser bookings.
const POSTHOG_TOKEN = 'phc_qJSSK839opXTtbJQYZmUSbpQD8dkcT9bEQaspXP3KoMh';
const POSTHOG_HOST = 'https://us.i.posthog.com';

const tutors = [
  { id: 'maya-chen', name: 'Maya Chen', subjects: ['Math', 'Algebra', 'Geometry'], gradeLevels: ['Middle School', 'High School'], hourlyRate: 55, slot: 'Tuesday, September 8 at 5:30 PM' },
  { id: 'leo-martin', name: 'Leo Martin', subjects: ['Science', 'Biology', 'Chemistry'], gradeLevels: ['Middle School', 'High School'], hourlyRate: 60, slot: 'Wednesday, September 9 at 5:00 PM' },
  { id: 'nora-williams', name: 'Nora Williams', subjects: ['English', 'Reading'], gradeLevels: ['Elementary', 'Middle School'], hourlyRate: 50, slot: 'Thursday, September 10 at 4:00 PM' },
  { id: 'samira-patel', name: 'Samira Patel', subjects: ['Math', 'Science', 'Reading'], gradeLevels: ['Elementary', 'Middle School'], hourlyRate: 52, slot: 'Wednesday, September 9 at 3:45 PM' },
  { id: 'owen-reed', name: 'Owen Reed', subjects: ['Algebra', 'Geometry', 'Chemistry'], gradeLevels: ['High School'], hourlyRate: 65, slot: 'Thursday, September 10 at 5:15 PM' }
];

async function capture(event, properties) {
  const response = await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: POSTHOG_TOKEN, event, properties })
  });
  if (!response.ok) throw new Error(`${event} was rejected with HTTP ${response.status}`);
}

async function simulateJourney(index, outcome) {
  const tutor = tutors[index % tutors.length];
  const subject = tutor.subjects[index % tutor.subjects.length];
  const distinctId = `synthetic-abc-parent-${Date.now()}-${index + 1}`;
  const base = { distinct_id: distinctId };

  await capture('subject_sought', { ...base, subject, source: 'directory_filter' });
  await capture('tutor_viewed', { ...base, tutor_id: tutor.id, tutor_name: tutor.name, subjects: tutor.subjects, grade_levels: tutor.gradeLevels, hourly_rate: tutor.hourlyRate });
  if (outcome === 'browse') return;

  await capture('booking_started', { ...base, tutor_id: tutor.id, tutor_name: tutor.name, subject, slot: tutor.slot });
  if (outcome === 'abandon') return;

  await capture('booking_completed', {
    ...base,
    booking_id: `ABC-SYNTHETIC-${Date.now().toString(36).toUpperCase()}-${index + 1}`,
    tutor_id: tutor.id,
    tutor_name: tutor.name,
    subject,
    student_grade: tutor.gradeLevels[index % tutor.gradeLevels.length],
    slot: tutor.slot,
    hourly_rate: tutor.hourlyRate
  });
}

const requestedCount = Number.parseInt(process.argv[2] || '12', 10);
const journeyCount = Number.isInteger(requestedCount) && requestedCount > 0 ? requestedCount : 12;
const outcomes = Array.from({ length: journeyCount }, (_, index) => {
  const share = index / journeyCount;
  if (share < 1 / 3) return 'browse';
  if (share < 2 / 3) return 'abandon';
  return 'complete';
});

try {
  await Promise.all(outcomes.map((outcome, index) => simulateJourney(index, outcome)));
  const count = (outcome) => outcomes.filter((item) => item === outcome).length;
  console.log(`Sent ${journeyCount} anonymous synthetic journeys: ${count('browse')} browse-only, ${count('abandon')} booking abandons, ${count('complete')} completed bookings.`);
} catch (error) {
  console.error(`Synthetic traffic failed: ${error.message}`);
  process.exitCode = 1;
}

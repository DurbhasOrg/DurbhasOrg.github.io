# ABC Tutoring — Product Specification

## Goal and audience

ABC Tutoring needs a polished, approachable static GitHub Pages prototype for parents. Dana currently coordinates tutor matching and bookings by phone/Facebook. The primary conversion is a successfully booked tutoring session, with no backend or actual messaging.

## Technical constraints

- Static files only, suitable for `https://durbhasorg.github.io/`.
- Semantic HTML5, modern CSS, vanilla JavaScript, and browser `localStorage`.
- No framework, build requirement, backend/API, database, authentication, payments, serverless functions, ratings, reviews, or admin tooling.
- Mobile-first at about 390px, then responsive desktop layouts.
- Data is centralized in `js/data.js`; persistence is centralized in `js/storage.js`; telemetry is centralized in `js/analytics.js`.

## Experience requirements

The first screen/two must make clear that ABC Tutoring supports multiple subjects and elementary through high school grades, that parents can browse tutors, and that they can book online. The visual direction is clean, warm, friendly, trustworthy, and simple—not dark corporate SaaS, test-prep, childish, or cluttered. Use readable system fonts, comfortable 16px+ mobile type, accessible contrast/focus states, 44px touch targets, persistent form labels, and useful non-color states.

`index.html` contains a minimal header, welcoming hero with Find a Tutor CTA, subject/grade overview, and tutor directory. Directory filtering supports subject and grade immediately, has All/reset states and an empty state. Cards show portrait, name, subjects, grades, rate, and View Tutor only. Approximately five clearly fictional tutors have believable bios and scheduled sample slots; no ratings.

`tutor.html?id=<tutor-id>` is GitHub-Pages-safe and has back navigation, detailed tutor information, and availability grouped by date. Slots use clear available/selected/booked states; booked slots are disabled. A parent selects an open slot, proceeds into the booking flow, sees a compact summary, and completes a short form with parent name/email, student first name/grade, and subject. Fields are validated with inline guidance.

On success, generate a non-PII booking ID, save it to `abcTutoringBookings`, make that tutor/slot unavailable immediately and after refresh, and show a polished confirmation including tutor, subject, grade, date/time, and rate. Confirmation says “Dana has been notified of your booking.” This is explicitly a simulation. Storage handles missing, empty, malformed JSON, and duplicate slot attempts. Prototype-local storage limitations are documented.

## Required analytics

Load PostHog safely with token `phc_qJSSK839opXTtbJQYZmUSb`, host `https://us.i.posthog.com`, and `person_profiles: 'identified_only'`. The site must still work if it fails. Do not identify parents or send parent name/email/student name, raw forms, or complete booking objects.

- `subject_sought`: on a deliberate, non-All subject filter choice only. Properties: `subject`, `source: 'directory_filter'`.
- `tutor_viewed`: once a valid tutor detail page loads. Properties: `tutor_id`, `tutor_name`, `subjects`, `grade_levels`, `hourly_rate`.
- `booking_started`: once a valid available slot is chosen and booking workflow is actually entered, not on rerenders. Properties: `tutor_id`, `tutor_name`, `subject` if known, `slot`.
- `booking_completed`: only after valid form submission, successful save, and slot booking. Properties: `booking_id`, `tutor_id`, `tutor_name`, `subject`, `student_grade`, `slot`, `hourly_rate`.

The four events must answer: subjects sought (breakdown subject), tutors viewed (breakdown tutor name), and booking conversion (funnel started → completed). `docs/posthog-dashboard.md` explains the shared/public dashboard setup and logged-out link test.

## Scope exclusions

No login, accounts, payments, cancellation/rescheduling, booking history/My Booking page, real notification, live availability, complex calendar/search, or price filter. Optional Playwright traffic simulation may be used only after core functionality works and must use synthetic data.

## Acceptance criteria

The static site is customer-presentable, responsive, keyboard-accessible, usable on mobile, and runs without Node in deployment. A parent can filter tutors, open details, select an available slot, complete validation, receive confirmation, and find the booked slot disabled after refresh. Required analytics fire precisely with no PII. Documentation covers privacy/local-storage limitation, testing, and PostHog dashboard configuration.

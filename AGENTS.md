# ABC Tutoring — Standing Instructions

This repository is the Stanford Upskilling Together assessment artifact for **ABC Tutoring**. Read `PROJECT_SPEC.md` and `PROGRESS.md` before continuing work.

- Deploy as a static GitHub Pages site only: semantic HTML, CSS, and vanilla JavaScript.
- Design mobile-first; parents on phones are the primary audience.
- Use `localStorage` only for prototype booking persistence; no backend, framework, database, accounts, payments, or serverless functions.
- Keep tutor data centralized in `js/data.js`, storage in `js/storage.js`, and PostHog telemetry in `js/analytics.js`.
- Required anonymous PostHog events: `subject_sought`, `tutor_viewed`, `booking_started`, and `booking_completed`. Never send parent/student names or email, raw forms, or whole bookings to analytics. Do not identify users.
- Dana’s core need: parents can browse tutors by subject and grade, view details and availability, and book an open session without Dana coordinating the initial booking.
- Preserve privacy: booking data is local to the browser prototype and no notification is actually sent; phrase the confirmation as a simulated notification.
- Do not push automatically. Inspect existing work carefully and preserve unrelated user changes.

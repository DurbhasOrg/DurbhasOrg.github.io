# ABC Tutoring Prototype

A static, mobile-first tutoring-directory and booking prototype for the Stanford Upskilling Together assessment. It is designed to run directly on GitHub Pages with no build system or deployed backend.

Parents can filter fictional tutor profiles by subject and grade level, inspect a tutor’s available times, and complete a locally persisted prototype booking. Booked slots remain unavailable after refresh in the same browser.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. No Node.js is required to run the site.

## Important project documents

- `PROJECT_SPEC.md` — full requirements and acceptance criteria
- `PROGRESS.md` — durable implementation checkpoint
- `docs/customer-requirements.md` — customer traceability and prototype/privacy limitation
- `docs/posthog-dashboard.md` — dashboard creation and public-sharing steps
- `docs/testing.md` — manual, analytics, and optional synthetic-traffic checks

## Analytics and privacy

The site uses anonymous PostHog event capture for only four product events: `subject_sought`, `tutor_viewed`, `booking_started`, and `booking_completed`. It does not identify visitors or capture parent/student names, parent email, raw forms, or whole booking records.

Bookings are deliberately local-browser prototype data, not real appointments or messages to Dana. See `docs/customer-requirements.md` for the limitation.

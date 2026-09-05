# Testing guide

## Manual functional checks

1. Serve the repository from its root, for example `python3 -m http.server 8000`, then open `http://localhost:8000`.
2. At a narrow viewport (around 390px), verify the hero, filters, cards, detail page, slot controls, and form are comfortable without horizontal scrolling.
3. Change Subject to Math: the matching tutor list updates immediately. Reset to show all. Choose a combination with no match to verify the empty state.
4. Open a tutor from a card. Verify their bio, subjects, grade levels, rate, and grouped availability appear. An invalid `tutor.html?id=missing` shows a helpful recovery state.
5. Choose an Available time, continue, and verify required-field and email errors appear inline. Complete the form with test data.
6. Confirm the confirmation includes the selected details and the phrase “Dana has been notified of your booking.” Refresh: that slot remains disabled and labelled Booked.
7. In browser developer tools, corrupt or remove `localStorage.abcTutoringBookings`; reload to confirm the site recovers without breaking.
8. Use keyboard Tab/Enter throughout and verify visible focus, reachable controls, and disabled booked slots.

## Analytics audit

Use the browser network panel or PostHog live events with test traffic.

- Selecting a non-All subject once sends `subject_sought` with only `subject` and `source`.
- Opening a valid tutor sends `tutor_viewed` once with tutor metadata.
- Selecting an open slot and entering the booking form sends `booking_started` once.
- A successful saved booking sends `booking_completed` once.
- Inspect every payload: it must not include parent name, parent email, student name, raw form data, or a full booking object.

Core booking behavior continues if the PostHog script is blocked or fails to load.

## Optional synthetic traffic

After installing development dependencies, run:

```sh
npm install
npm run simulate -- http://localhost:8000
```

The script uses only fictional test information. It drives one directory/view visit, one booking abandonment, and one completed booking. It is a development-only aid and is not used by the deployed static site.

### Dashboard seed traffic

To populate a PostHog dashboard with a small, clearly anonymous test set, run:

```sh
npm run simulate:posthog
```

This development-only seeder sends 12 synthetic journeys directly to PostHog: four browse-only journeys, four booking starts that abandon, and four completed bookings. It does not create browser bookings or send personal information. Synthetic visitor IDs begin with `synthetic-abc-parent-`, making them easy to recognize or filter in PostHog. Pass a positive count for another batch size, for example `npm run simulate:posthog -- 20`.

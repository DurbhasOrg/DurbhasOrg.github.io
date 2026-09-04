# Customer requirements traceability

ABC Tutoring’s parent-facing website reduces Dana’s manual initial coordination: parents can browse a small tutor directory, compare subjects and grade levels, see open session times, and reserve a session.

| Dana’s need | Prototype response |
| --- | --- |
| Phones matter most | One-column mobile layouts, large controls, short forms, and no dense calendar/table. |
| Parents need tutor information | Subject/grade filters, scannable cards, and separate, reassuring tutor detail pages. |
| Parents should see available times | Grouped date/time buttons with Available, Selected, and Booked labels. |
| Initial booking should be self-serve | Selected tutor/time summary, validated booking form, local confirmation, and persistent booked state. |
| Keep it friendly and trustworthy | Warm neutral palette, deep teal actions, plain-language content, and intentionally modest claims. |
| Understand demand and conversion | Four privacy-conscious PostHog events, described in `posthog-dashboard.md`. |

## Prototype boundary and privacy

Bookings are stored only in the browser’s `localStorage` under `abcTutoringBookings`. This makes availability persist after refresh on the same device/browser, but is not a real scheduling system: it does not sync across devices, notify Dana, or securely store customer data. The confirmation’s notification wording intentionally simulates the future workflow. A production launch needs a secure backend, consent/privacy review, and real scheduling/notification integration.

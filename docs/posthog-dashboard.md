# PostHog dashboard setup

The site sends four anonymous custom events to the supplied PostHog project. Autocapture and automatic page events are disabled so reporting stays focused on these events. It never identifies a parent and intentionally excludes parent name, parent email, and student name from telemetry.

## Create the dashboard

1. In PostHog, wait until the site has received some real or synthetic test events.
2. Go to **Dashboards**, create a dashboard named **ABC Tutoring — Parent Engagement**, and choose an appropriate time range.
3. Create the three insights below, saving each and adding it to this dashboard.

### 1. Subjects Parents Are Looking For

1. Create a trends insight for event `subject_sought`.
2. Add a breakdown by event property `subject`.
3. Use a bar chart (or another categorical breakdown view) to compare demand.

### 2. Most Viewed Tutors

1. Create a trends insight for event `tutor_viewed`.
2. Add a breakdown by event property `tutor_name`.
3. Use a bar chart or table to compare tutor profile interest.

### 3. Booking Completion

1. Create a funnel insight.
2. Add `booking_started` as step one and `booking_completed` as step two.
3. Use the resulting conversion rate and drop-off to assess whether visitors are leaving after starting booking.

An optional fourth insight can trend `booking_completed` over time.

## Share for assessment review

The assessment requires a shared/public dashboard link. In the dashboard sharing controls, enable sharing, copy the public URL, and test it in a logged-out or private browser window before submitting. Review the dashboard event properties first: expected properties are tutor/subject/grade/rate/slot metadata and booking reference only—never names, email addresses, free-text form values, or whole booking records.

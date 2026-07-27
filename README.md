# Reedr Creator Desk

One HTML file. Turns a LightReel creator table into emails sent, videos posted and readers counted.

Open `index.html` in a browser. There is no build step and no server.

## The loop

Import a table, and every creator lands on **Today** with one next step and one button. Do the thing, the desk sets the next step for you. Nobody ever sits without a date.

Shortlist, Emailed, Replied, Briefed, Posted, Measured, then run again or stop. Paused and Passed are the only endings.

## Import

Paste anything: a LightReel creator table, a video CSV, a markdown table, or a copied block with no headers at all. It tries tabs, aligned spaces, commas and pipes and keeps whichever gives consistent columns, then works out each field from what is in it. Nothing is written until you press **Add them**.

A creator already on the desk is topped up, never overwritten. Your stage, notes and history survive a re-import. Videos attach to their creator by handle and do not duplicate.

## Lanes

A lane is a kind of creator plus the email and the brief that suit them: reading journal, trackers and apps, shelves and libraries, readathons and sessions, quotes and annotation, recaps and reviews. The lane comes from the niche field, and you can change it in the panel.

Every email has one bracketed line you must write yourself, and the greeting stays as `{FIRST NAME}` until you set a name. Both are deliberate. A creator can tell.

## Data

Everything lives in this browser, under `reedr-creator-desk-v1` in localStorage. Nothing leaves the machine. **Back up** writes a JSON file, **Restore** reads one. Use them before you change computers, and after a big session.

## Measuring

Each creator gets `reedr.co/?ref=<handle>`. PostHog already records the full landing URL, so traffic per creator is visible today with no change to Reedr.

Signups per creator are typed in by hand until Reedr captures `?ref=` at signup. That is one field on the users insert, and it is the difference between counting views and counting readers.

## Changing it

The `DESK_CONFIG` block at the top of `index.html` holds the sender details, the offer line, the chase and check-back intervals, the signup count that earns a repeat, and every lane with its email and brief. Nothing below that block needs editing.

Tests: `desk-test.mjs`, 49 headless checks over parsing, the pipeline, export, persistence and layout. It lives on the build machine only and is not in this repo, because its fixtures are real creator contact details and this repo is public. Run it with `node desk-test.mjs`.

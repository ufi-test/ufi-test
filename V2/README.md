# UFi Research — homepage prototype 01

A homepage design for review. It is not the completed company website.

## Preview and manual upload

Unzip the archive. Upload `index.html`, `css`, `js`, and `assets` together to the folder currently served by your test GitHub Pages site. Upload the contents of this folder, rather than nesting the folder itself. No build or installation is needed. No CNAME is included, so the test site will not inherit your company domain.

For local preview, run `python -m http.server 8000` from this folder, then open `http://localhost:8000`. Stop with Ctrl+C.

This prototype uses relative asset paths and works under the `/ufi-test/` project path. It has no framework, CDN dependencies, analytics, or automated deployment. The robots meta tag asks search engines not to index this prototype; remove it when preparing the approved production site.

## Scope and navigation

- Home, About, Services, and Contact in the header demonstrate homepage navigation using sections.
- Full service, team, participant, LinkedIn, and contact links lead to the existing public destinations.
- Project contact actions open the existing production contact page. They can send a real inquiry if a visitor completes that form. The working Web3Forms integration has not been copied, changed, or tested by submitting a message.
- Research insights contains a visibly labeled editorial concept in an expandable preview. It is not presented as a published article, client result, or researcher-authored piece.
- All existing team names and images are used as supplied. No new client claims, testimonials, metrics, or researcher roles have been invented.

## Design decisions

Navy, mauve, and rose; local Open Sans; rounded service surfaces; circular portraits; clear client-first action hierarchy. The sticky header is opaque for legibility. OS theme preference selects light/dark colors; there is no manual theme toggle.

The hero gradient intentionally reverses direction: 125 degrees in light mode and 305 degrees in dark mode. A separate dark overlay supports white hero text. Mobile navigation uses a button with an announced expanded state. Closed mobile links are hidden, including from keyboard focus; Escape closes the menu. With JavaScript unavailable, navigation links remain visible.

## Review and verification

Checks performed: JavaScript syntax; local asset references; section anchors; unique IDs; single H1; text contrast calculations for light/dark content, buttons and hover states; no external font/CDN requirements. Minimum calculated content text contrast: 7.15:1 in light mode and 10.46:1 in dark mode across the checked solid surfaces.

Responsive rules are implemented for wide, tablet and narrow layouts. Direct browser testing of this new version is pending manual upload. Mobile navigation, exact reflow, browser zoom, sticky positioning, gradient/photo contrast, dark mode rendering, screen readers and focus behavior still require browser/manual review. No full accessibility conformance claim is made.

## Assets

Company logo, photo banner and team portraits come from the supplied archives. Open Sans font files come from the supplied prototype; see `assets/fonts/OFL.txt` for the Google Fonts Open Sans license. Only the four normal weights used by the site are included.

## Next review

After uploading to the test site, share that the upload is ready. Review the homepage before extending this design to the remaining pages. The future article section should be withheld from production until there is finished editorial content.

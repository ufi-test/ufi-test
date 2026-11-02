# UFi Research — V6 homepage and Services prototype

## Upload

Upload the ZIP contents into a new V6 folder in the test GitHub Pages repository. Keep the index.html, services.html, css, js and assets paths together. No build, CNAME or automated publishing is included. Home and Services link locally; About, Contact and Playtest continue to the existing live pages.

Local preview: run `python -m http.server 8000` in this folder and open http://localhost:8000. Stop with Ctrl+C.

## What changed

- More breathing room in the logo-and-tagline hero: vertical padding increased from 32px to 44px on mobile, 36px to 52px at the first wider breakpoint, and 40px to 60px on desktop. Hero height is still content-driven. The intentional gradient direction reversal is retained.
- On desktop, introduction text and actions sit beside the heading, using the previously empty space. Mobile remains a single readable column. No new decorative image or invented research example was added.
- The closing rounded contact panel is restored after Research insights, with a stacked mobile layout and button beside the text on wider screens.
- Text links now change color and underline thickness on hover and keyboard focus. Footer links also gain this feedback. Navigation and Playtest button effects from V5 remain.
- Footer divider removed. Copyright has a separate row, using natural column layout on mobile and a full-width flex row on desktop.
- Services now explains the question each method addresses, what happens, and what the client receives. Expert analysis is explicitly distinguished from testing with users. Expanded content is original wording based on UFi's existing service scope; no competitor claims or performance promises are imported.

The process section and approved article card remain. Stars, alien imagery, team photos and Launchpad references remain absent from the homepage. The article is a clearly labeled prototype concept, not a published researcher article or client result.

## Scope and dependencies

Mobile-first static HTML/CSS with local Open Sans, local UFi imagery, minimal shared JS for the accessible dropdown navigation, and native details controls. No CDN, framework, analytics, new API or manual theme switch. Open Sans license included. Both pages contain noindex directives to remove before production release.

Contact actions reach the existing live contact page. Web3Forms remains unchanged and no test inquiries have been submitted. About, Contact and Playtest are not redesigned in this two-page prototype. Existing service-package comparisons and all FAQs have not yet been migrated.

## Review

Personal Web Design review was completed first, followed by Universal Design Principles. Fixes and affected checks were completed before delivery. See REVIEW.md. Source checks and offline visual inspection do not establish browser or full accessibility conformance. After uploading V6, provide the link or confirm it is ready for browser review.

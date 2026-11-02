# UFi Research — V7

## Upload

Upload this ZIP's contents to a new V7 folder on the test GitHub Pages site. Keep index.html, services.html, about.html, css, js and assets together. Home, Services and About now link locally. Contact and Playtest still link to the existing live pages. No CNAME, build step or automated deployment is included.

Local preview: run `python -m http.server 8000` inside this folder and open http://localhost:8000. Stop with Ctrl+C.

## Changes

- Added About using the company description, original team photographs/profile links and Launchpad description supplied with the existing website. No roles, biographies, founding dates, customer claims or credentials are invented. Accessibility is included as a value based on your stated priority. Please review the team details for any updates you want.
- Restored the homepage hero's brighter V1 gradient appearance by removing the 55% full-surface navy overlay. Gradient colors, image and intentional 125/305-degree reversal are unchanged. A local dark backing behind the small tagline supports legibility; the logo has a subtle shadow. Services/About page banners retain their separate existing text-contrast overlay.
- Services now uses the shared 1184px wrapper, matching other sections. Surveys, interviews, concept testing and diary studies are always visible, stacked on mobile and arranged in two columns on wider screens.
- Added explicit invitations for research needs not listed, without promising that every request can be fulfilled.
- “Explore our services” is an outlined secondary action beside the filled project-contact action. Both have hover and keyboard-focus feedback.
- Footer uses explicit brand, navigation and copyright layout areas. Copyright has no paragraph-width cap and occupies its own row. The footer groups stack on mobile; labels remain intact as links wrap between rows.
- The shared closing contact panel now appears on Home, Services and About. It remains absent from the existing external Contact/Playtest pages, which have not yet been rebuilt.

## Preserved choices

Mobile-first static HTML/CSS; local Open Sans with included OFL license; local company assets; system light/dark preference; opaque sticky header; foreground mobile dropdown with keyboard dismissal; native article disclosure. The approved article card and process section remain. No stars or alien imagery. Team photos and Launchpad appear on About only.

The article is a labeled editorial concept. Remove it from production until content is finished. All three prototype pages contain noindex directives to remove at final launch. Web3Forms has not been copied, changed or exercised by submitting messages.

## Review

Reviewed through Personal Web Design, then Universal Design Principles, before packaging. See REVIEW.md. Source checks and offline visual inspection are complete; actual V7 browser, responsive-device and assistive-technology review remains pending manual upload. This is not a full accessibility conformance claim.

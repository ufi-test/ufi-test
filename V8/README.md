# UFi Research — V8

Upload the contents of this ZIP into a new V8 folder on your GitHub Pages test site. Keep index.html, services.html, about.html, css, js and assets together. No automated upload or deployment is included.

For local preview, run `python -m http.server 8000` in this folder and open http://localhost:8000.

## Changes

- Services: three rounded, lightly outlined panels group the main offerings. Additional methods stay visible, with short descriptions and 2px vertical separators. Deliverables occupy a separate background band. All sections retain the shared outer width.
- About: larger circular portraits, one outlined team container, and V1-inspired portrait enlargement/LinkedIn overlay on hover and keyboard focus. Motion is disabled for reduced-motion preferences. Names and LinkedIn destinations remain visible without hovering. Actual profile destinations are retained from V7.
- Standalone calls to action use outlined secondary buttons. Profile and footer links have smaller outlined treatments. These remain semantic links, with visible keyboard focus and hover feedback.
- Hero tagline: removed the rectangular backing. Desktop text is flat. Mobile uses a small dark text shadow because the unshadowed white tagline did not meet normal-text contrast in narrow offline reference renders. The shadow's effectiveness still needs live-browser verification; this is an open accessibility issue, not a claimed pass.
- Authored CSS borders, dividers, underlines and decorative rings use at least 2px. Focus outlines remain 3px.

## Retained

Static, mobile-first HTML/CSS; local fonts/images; OS light/dark preference; sticky navigation with an overlay mobile menu; intentional theme-specific hero gradient direction; approved process section and sample article. No stars or mascot. Team and Launchpad remain on About only. Shared contact panel on all three pages.

Home/About/Services link locally. Contact and Playtest continue to the existing production pages. Web3Forms was not changed or submitted. No invented credentials, biographies or customer claims were added. The article remains explicitly labeled as a prototype concept. Remove prototype noindex directives and finish article content before production launch.

Reviewed in order through Personal Web Design and Universal Design Principles. See REVIEW.md for evidence and remaining checks.

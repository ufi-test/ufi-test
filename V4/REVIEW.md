# V4 review record

## 1. Personal Web Design examination

Checked against the skill's mobile-first, static-hosting, semantic HTML, theme, navigation, accessibility and local-dependency requirements.

- Mobile layouts are the CSS defaults; min-width rules add wider compositions. Base content has a single column and no fixed viewport hero height. Shared code and relative links support GitHub Pages subpaths.
- Both pages have one H1, logical heading structure, landmarks, a skip link, visible focus styles, and appropriate current-page navigation. The mascot is decorative. Menus and links have at least 44px target height; native details summaries have at least 44px target height.
- Local fonts, images, CSS and vanilla JS; no build, framework, CDN, analytics or new external API. The supplied font license is included.
- Solid foreground/background contrast was calculated in both palettes. Checked content text pairings meet 4.5:1. The light content muted-text minimum is 7.15:1; the dark equivalent is 10.46:1.
- Issue found and fixed: white hero text could reach only 4.42:1 under the conservative brightest-stop/white-photo calculation with the former 48% overlay. Increasing the navy overlay to 55% yields about 5.4:1 for white text under that calculation. This bound assumes the supplied gradient colors and photo are combined as declared; final browser rendering still needs inspection.
- Issue found and fixed: mascot width/height attributes did not match its intrinsic 1467x1072 dimensions. Corrected them and moved it above the contact text on narrow screens to reduce crowding.
- Kept progressive enhancement and the foreground menu. Closed links use hidden rather than clipping. Escape, outside click, link selection, focus leaving the header and breakpoint changes are covered by code checks.

Not verified: actual browser keyboard operation, reflow/zoom, menu layout stability, native details behavior in target browsers, screen readers, and device light/dark rendering. Offline renders do not establish those results.

## 2. Universal Design Principles examination

Applied after the first review, using the skill's index, relevant abridged book passages and applied web playbook. The decisions below are design interpretations, not measured usability outcomes.

- Hierarchy (OEBPS/part0112.xhtml): one clear homepage sequence from identity to service proposition to research article. The introduction is larger than the Insights section heading. One filled contact action is differentiated from the quiet Services link. The article is the only substantial homepage card.
- Signal-to-Noise Ratio (OEBPS/part0214.xhtml): removed stars and repeated homepage pitches. A further review found that the Services page's repeated “useful when” sentences largely restated the descriptions. Removed those sentences.
- Wayfinding (OEBPS/part0249.xhtml): Home and Services form a working local two-page path and have current-page indicators. Other navigation continues to the existing live pages; the README identifies this prototype boundary. Changed “Other research methods” to “Surveys, interviews & other methods” to make the expandable section's contents more predictable.
- Retained the requested article card design. Kept the mascot to one secondary Services location so it adds brand personality without creating another homepage focal point.
- Simplified shared footer layout to flexbox for more predictable wrapping in both narrow compositions and offline inspection.

## Final verification

Checked local links/assets and section references on both pages, unique IDs, single-H1 structure and heading levels, matching CSS/JS menu breakpoints, removal of rejected homepage content, and primary action count. Checked JavaScript syntax and simulated the menu's open/close, Escape/focus return, outside-click, link, focus-out and breakpoint states.

Inspected eight offline reference layouts: Home and Services at 390px and 1280px in light and dark palettes. These are approximate HTML-to-PDF renders with the closed-menu state simulated. They are not browser screenshots, cannot test JS, and do not prove exact responsive behavior. After the footer layout fix, rerendered and reinspected the affected layouts.

No browser or full accessibility pass is claimed. Final browser QA follows your manual upload.

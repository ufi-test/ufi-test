# V5 review record

## Evidence

Inspected the uploaded V4 homepage in the browser and the user-supplied screenshot of the desired V3 process section. Inspected the supplied portfolio HTML/CSS and an offline visual reference. Portfolio hover behavior was assessed from the CSS, not observed in an interactive browser: desktop links underline; mobile links highlight their background; linked feature cards strengthen their border and move upward by 2px; keyboard focus outlines them; reduced-motion preferences disable that movement.

## 1. Personal Web Design examination

- Retained single-column mobile base styles with min-width wider layouts. Process steps stack on mobile and become three columns at 56rem. No fixed hero height, external fonts, CDNs, frameworks or new JS.
- Reviewed semantic markup, heading hierarchy, local paths, relative Home/Services routes, native expandable article control, overlay navigation and keyboard-focus selectors. Menu JS is unchanged from V4's checked behavior.
- New process text uses existing palette tokens. New hover/focus text is white on #3b3248, calculated at 12.10:1. Rose pill border against that surface is approximately 8.99:1. Process muted text is 7.15:1 in light mode and 10.46:1 in dark mode on the selected surfaces.
- Playtest hover/focus retains border width and padding, preventing a style-induced size change. Plain desktop links retain underline feedback; mobile links highlight their full target area. Keyboard focus remains visibly outlined. Transitions are restricted to the no-preference reduced-motion query.
- Removed the alien from markup, styling and assets. Retained the existing conservative hero overlay and intentional 125/305-degree gradient reversal.
- After applying the portfolio-inspired navigation refinement, repeated affected markup/path, mobile-first, focus and reduced-motion source checks.

Not verified: actual V5 hover rendering, browser layout stability, exact mobile/zoom reflow, device themes or screen readers. The hosted V4 inspection does not verify V5.

## 2. Universal Design Principles examination

Applied after the Personal Web Design review; these are design interpretations grounded in the skill's abridged source passages, not measured user outcomes.

- Hierarchy (OEBPS/part0112.xhtml): the restored process heading remains subordinate to the main service introduction. The process adds useful explanation between the introduction and insights; it does not add another primary action.
- Signal-to-Noise Ratio (OEBPS/part0214.xhtml): restored the requested substance without restoring the service-card grid, team imagery, stars or repeated homepage contact panel. Steps use simple rules and text within one surface instead of competing cards.
- Consistency (OEBPS/part0048.xhtml): links retain link-like feedback while the button-shaped Playtest control has background/border feedback in both hover and focus states. The approved article remains an expandable concept. Its entire surface is not styled as a navigational card because it has no article-page destination yet.
- Portfolio inspiration is limited to interaction cues; UFi's identity, typography and content structure remain coherent.

## Validation and scope

Checked balanced markup, one H1 per page, heading order, unique IDs, file/anchor references, removal of the alien, theme definitions and CSS/JS breakpoint consistency. JavaScript syntax passes. The article card markup is unchanged from V4.

Offline layout references were inspected at 390px and 1280px in light/dark themes for both pages. These approximate HTML-to-PDF renders simulate collapsed mobile menus and details; they cannot verify real browser interaction. No full WCAG pass or direct V5 mobile/browser pass is claimed. Both pages remain prototypes pending user review.


## Additional reference: PlaytestCloud

Reviewed https://www.playtestcloud.com/ using web retrieval and browser screenshots. The takeaway was to describe research through concrete outputs and examples. Adapted the Services closing explanation to say what clients receive, using the report, recordings, transcripts, user quotes and design recommendations already described on the supplied UFi Services page. The conditional wording “depending on the study” is retained. No competitor claims, metrics, features, assets or wording were copied. No new homepage section was added.

Personal Web Design re-examination of this text edit: heading level, text length, conditional service scope, unchanged theme tokens, and static-page structure checked. Universal Design Principles re-examination followed: the literal “What you receive” heading improves information scent and the output description adds useful substance rather than another promotional pitch. These are applied design judgments; browser/user testing remains pending upload.

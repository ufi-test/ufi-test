# V7 review record

## Sources

Compared V1 and V6 in the live browser. Their hero gradient colors and direction were identical; V6 additionally applied a 55% navy overlay over the entire hero. Used the original supplied company/team content for About and the already agreed UFi design system for the new page. LinkedIn profile destinations are retained from the original website; no separate profile verification or new credentials are claimed.

## 1. Personal Web Design examination

- Three static pages with shared local assets and minimal navigation JS. Checked local page routes, assets, anchors, unique IDs, one H1 per page, logical heading progression and correct current-page indicators.
- Mobile is the CSS base. Min-width rules add wider columns and team layouts. Services has no separate narrower wrapper. Additional research methods are semantic, always-visible content rather than a disclosure.
- Navigation behavior remains unchanged from the checked earlier implementation: hidden mobile links leave the tab order; Escape closes and returns focus; outside click, link selection and focus leaving the header dismiss the panel. Foreground positioning avoids inline expansion. V7 browser behavior still requires testing after upload.
- The new outlined link is still an anchor, styled as a secondary button. Its palette, hover and focus pairings were calculated in both themes and meet normal-text contrast thresholds. Keyboard focus remains outlined. Mobile actions stack with generous targets.
- Full-hero dark overlay removed to match V1. The small white tagline sits on local rgba(20,18,34,.82) backing; the conservative white-underlay calculation yields approximately 10.69:1. This calculation does not establish full visual accessibility of the hero. Logo legibility and browser-composited imagery still need inspection. Services/About banner overlays are unchanged.
- Footer layout uses explicit areas, and copyright overrides the global paragraph width limit that constrained it before. The copyright row is independent of the navigation. Footer links wrap between links rather than splitting a short label internally.
- Team photographs have explicit square cropping, adjacent visible names and always-visible LinkedIn labels. Empty image alternatives avoid repeating names already present within the named link. Profile hover and focus add a border; no information is hover-only and no scaling animation is used.
- No new CDN, framework, form integration, tracking, JS dependency or unlicensed font. Contact links retain the existing live form; no submissions made. Reduced-motion handling retained.

## 2. Universal Design Principles examination

Applied after the first review, grounded in the skill's abridged passages. These are design judgments, not measured usability findings.

- Alignment (OEBPS/part0017.xhtml): Services shares the same outer edges as the banner, footer and closing panel. Readable line lengths are controlled within the layout instead of narrowing its entire wrapper.
- Progressive Disclosure (OEBPS/part0178.xhtml): short core offerings are no longer hidden. The longer prototype article concept remains expandable because it is optional detail rather than a service a client needs to discover.
- Consistency (OEBPS/part0048.xhtml): Home/Services/About share navigation, footer and closing-panel appearance. Filled and outlined actions have distinct emphasis but matching target dimensions. About uses the established typography and palette.
- Readability (OEBPS/part0188.xhtml): About explains purpose, values, team and Launchpad using supplied facts, without placeholder history or lengthy invented biographies. The custom-research invitation explicitly says the service list is not exhaustive while avoiding a blanket capability promise.
- Hierarchy (OEBPS/part0112.xhtml): the home hero still has only branding and tagline. Team details are on About, not reintroduced into the homepage. About separates the company introduction, values, people and development model with headings and space; the article and process remain unchanged on Home.
- The visual review prompted an adjustment to footer label wrapping; affected layouts were rechecked afterward.

## Visual references and limits

Inspected 12 offline reference layouts: Home, Services and About at 390px and 1280px in light/dark palettes. Simulated the enhanced closed mobile menu and collapsed prototype article for these HTML-to-PDF renders. Additional Services methods remained visible. Corrected an obsolete rendering-only rule that initially hid definition lists, then inspected the corrected references. These are not browser screenshots and do not test JS.

Final code checks include balanced markup, page routes, six portrait assets, original profile URLs, shared closing-panel presence, unchanged article/process markup, removed narrower Services override, no disclosure around additional methods, and no team/Launchpad content on Home. JS syntax passes. Offline visual inspection does not replace real browser, keyboard, screen-reader, zoom/reflow or device-theme testing. No full WCAG pass is claimed.

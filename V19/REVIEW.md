# V19 review record

## 1. Personal Web Design examination

Limited the implementation to decorative texture sizing. All three pseudo-element backgrounds use a 900px-wide image in the mobile base rules, switching to 1800px at the same 56rem breakpoint used for desktop navigation. Above 112.5rem, image width fills the region. Height remains automatic, preserving the image proportions. Hero alignment is center/center; interior headers are center/top and footer center/bottom. No repeating, new image, gradient change, opacity change, animation or content change was introduced.

Generated 24 offline home/Playtest references at 320px, 390px, 895px, 896px, 1280px and 1920px in both themes. Inspected narrow/wide hero/header/footer references and the adjacent 895px/896px breakpoint references. The artwork changes size at the navigation breakpoint as requested, rather than continuously shrinking with the viewport. Narrow footer text remains visible over the unchanged low-opacity decoration. Existing background text colors and focus/link styles are retained.

Checked one H1 per page, unique IDs, local routes/assets and authored CSS line minimums. Full source comparison confirmed only CSS changed before documentation updates. All markup, scripts, form behavior and assets remain unchanged from V18. No form submission was made.

## 2. Universal Design Principles examination

Applied after the web-design examination, using the bundled abridged passages and previously read web playbook.

Consistency (OEBPS/part0048.xhtml): hero, interior headers and footer now share the same two size tiers and horizontal centering. Their different vertical alignment preserves the agreed compositions.

Signal-to-Noise Ratio (OEBPS/part0214.xhtml): the mobile tier balances the large desktop motifs against the limited space around headings and footer links. Existing 15% opacity keeps decoration secondary. These are visual judgments rather than measured usability findings.

The scale changes discretely at the navigation breakpoint; this is intentional, not a smooth resize effect. No further implementation change was required by the second examination.

## Limits

References are WeasyPrint offline approximations, not browser screenshots. Native controls, navigation and flex layout may differ from browser rendering. The managed browser preview remains unavailable. Actual browser behavior, zoom/reflow, assistive technology and end-to-end email delivery remain unverified; no full accessibility-conformance claim is made.

# V9 review record

## Inputs and scope

Inspected both supplied PNGs visually and checked their dimensions/alpha channels. Applied those files without editing their pixels. The shared texture is reused by both interior title banners and the footer. The homepage uses the unique texture. Reused the LinkedIn icon from the user-supplied Gemini SVG sprite as a local SVG with attribution; no icon font or CDN was introduced.

## 1. Personal Web Design examination

- Checked mobile-first source structure, semantic headings and landmarks, unique IDs, balanced markup, local assets/anchors and GitHub Pages subpath-safe links. JavaScript syntax passes. Existing menu JS and team photographs are byte-for-byte unchanged.
- Background layers use 90% alpha color stops rather than section opacity, so foreground text and links remain opaque. The navbar remains opaque. The old banner photograph and the separate 55% interior-banner veil were removed; banners now use one dark 90% wash. The footer uses its own 90% wash over the same shared texture.
- The source artwork is already translucent: hero alpha peaks around 46%, shared artwork around 37%. Under a 90% wash their strongest marks contribute approximately 4.6% and 3.7%, respectively. Very subtle pattern visibility is expected.
- Initial narrow hero samples fell below normal-text contrast expectations. Fixed by centering a minimum 1200px-wide gradient crop on smaller layouts while independently cover-cropping the texture. Colors, 90% alpha and the theme-specific 125°/305° direction are preserved. Removed the old mobile shadow after this adjustment.
- Sampled unshadowed white tagline backgrounds in offline references at 320, 390, 640, 768, 960, 1280 and 1920 CSS px in both themes. The lowest sampled ratio was approximately 5.07:1. This is an offline background sampling result, not a complete browser contrast audit or full accessibility conformance claim. Browser text metrics/compositing, unsampled sizes and zoom still need verification.
- Inspected twelve offline layout references: Home, About and Services at 390px and 1280px, in both themes. Simulated closed enhanced mobile navigation and collapsed article content. The renderer treats narrow layouts as touch for the portrait destination cue; desktop references use hidden overlays. These are HTML-to-PDF references, not browser screenshots, and do not validate JS or exact browser Flexbox/sticky behavior.
- Team links retain accessible names identifying person and destination. Decorative icons/photos have empty alternatives within those named links. Only the name remains below each photograph. Hover and focus reveal the large LinkedIn icon; touch gets a persistent smaller icon. Focus outlines remain 3px. No nested link or second profile control was added.
- Services outcomes remain visible, and the expert-analysis qualification is retained. Additional methods are not collapsed. The general deliverables section and duplicate Services contact panel are removed in favor of one final custom-research invitation.
- Footer links use text with no border or default underline, retaining 44px minimum authored target height and visible keyboard focus. Fixed a leftover selector during visual review that initially prevented the new plain-link styling from applying; rerendered and rechecked affected layouts afterward.
- Minimum 2px authored CSS borders/dividers/underlines retained. Reduced-motion animation conditions and existing overlay-menu behavior retained. No forms, tracking or runtime dependencies were introduced.

## 2. Universal Design Principles examination

Applied after the first review and its fixes, using the skill's abridged passages. These are design interpretations, not measured task-performance findings.

- Consistency (OEBPS/part0048.xhtml): one shared texture connects interior banners and footer, while the unique hero remains distinct. Primary/secondary content actions retain their established treatments. Repeated team buttons were removed to match the agreed portrait interaction.
- Uniform Connectedness (OEBPS/part0235.xhtml): service outlines and alternating surfaces connect each service's question, description and outcome. The team remains within one outlined group, without adding individual card frames.
- Chunking (OEBPS/part0032.xhtml): each service is concise, additional methods stay grouped and visible, and the custom-research invitation is a separate final section.
- Hierarchy (OEBPS/part0112.xhtml): the single final Services action replaces competing contact invitations. Footer links have lower emphasis than content buttons. Profile destinations are communicated on images without repeated button-shaped labels.
- Signal-to-Noise Ratio (OEBPS/part0214.xhtml): textures stay faint, descriptions are shorter, redundant deliverables/contact copy is removed, and default footer underlines and pills are absent. Existing homepage content remains unchanged.

Rechecked the affected layouts and source after fixing the footer selector and finalizing the centered gradient crop. No additional design change was needed in the second review.

## Remaining checks

V9 has not yet been uploaded or tested in the live browser. Real pointer/touch interaction, keyboard use, screen-reader output, actual theme rendering, 200–400% zoom/reflow and exact responsive behavior remain unverified. Offline visual and contrast sampling do not establish full WCAG conformance. Menu behavior is unchanged, but earlier-version checks do not substitute for a V9 browser check.

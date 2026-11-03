# UFi Research — V9

Upload this ZIP's contents into a new V9 folder on your test GitHub Pages site. Keep index.html, about.html, services.html, css, js and assets together. No build or automated deployment is required.

For local preview, run `python -m http.server 8000` inside the folder and open http://localhost:8000.

## This revision

- Applied the supplied unique homepage texture and shared interior-banner/footer texture. The original PNGs are included unchanged under short local filenames. Their actual dimensions are 2048×819 and 2048×614 despite the supplied filenames. No upscaling was necessary.
- Gradient color stops use 90% alpha. Interior banners and the footer use their own dark 90% color washes for text legibility. Content opacity stays at 100%. Navigation remains separate and opaque. No old photographic banner remains.
- The homepage preserves the intentional 125° light / 305° dark gradient reversal. Below 1200px, its gradient uses a centered 1200px-wide crop to keep the area behind the tagline more consistent. The image continues to use cover cropping independently. Tagline text is flat, without a backing rectangle or text shadow.
- Team: names beneath photographs, LinkedIn icon overlay on hover and keyboard focus, no buttons underneath. Touch/coarse-pointer devices receive a small persistent icon on the photograph. Each portrait/name remains one labeled profile link. Reduced-motion preferences suppress enlargement/fade animation.
- Footer: plain text links with color feedback and keyboard-focus outlines, without button borders or permanent underlines. Company identity and copyright retain their own layout areas.
- Services: subtly alternating outlined panels, more space between services, shorter copy and distinct outcome labels. Additional methods remain visible. A single contrasting “Don’t see what you need?” contact section replaces the general deliverables section and repeated closing invitation. The expert-analysis caveat remains.

The texture artwork is already partially transparent. A 90% wash above it leaves a particularly faint pattern. This is intentional in this revision; adjust the wash rather than the opacity of the entire section if more visible artwork is wanted.

## Preserved

Static mobile-first pages, local Open Sans/fonts and assets, OS light/dark themes, sticky navigation and foreground mobile menu, 2px minimum authored lines, 3px focus outlines, approved homepage process and prototype article. Team/Launchpad remain on About only. Home and About retain their existing closing contact panels.

Contact and Playtest still link to existing production pages. Web3Forms and production files were not changed; no inquiries were submitted. The sample article is unfinished and labeled as a prototype concept. Finish or remove it, and remove prototype noindex directives, before production launch.

Reviewed through Personal Web Design first, then Universal Design Principles. Source checks and offline light/dark layout inspection are complete; actual browser and assistive-technology validation still require manual upload. See REVIEW.md.

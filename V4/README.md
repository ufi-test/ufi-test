# UFi Research — V4 homepage and Services prototype

## Open and upload

This package contains index.html and services.html, shared CSS/JS, local fonts and local images. No installation or build step is required. Upload the contents into your test site's V2 folder, or use another folder to retain the earlier version for comparison. Home and Services link to each other with relative URLs and work under GitHub Pages project paths. No CNAME or automated deployment is included.

For local preview, run `python -m http.server 8000` inside this directory and open http://localhost:8000. Stop with Ctrl+C.

About, Contact and Playtest still link to their existing live pages. Contact actions lead to the existing working contact form; no Web3Forms settings have been changed and no messages have been submitted. The Services page is a design prototype, not a complete migration of every existing FAQ or service-package detail.

## Design changes

The homepage has a logo-and-tagline hero, one brief business introduction with a primary contact action and quieter Services link, and the article card from the earlier prototype. The stars, service cards, process section, About block, large closing contact panel, team photos and Launchpad references are absent from the homepage.

Services uses simple editorial rows, an expandable list of additional methods, a short explanation of the research output, and one contact action. The supplied mascot appears once on Services, away from the hero and homepage reading path. On small screens it sits above the contact text; on wider screens it sits beside it. It is decorative and has empty alternative text.

Shared choices: mobile-first CSS with min-width breakpoints; an opaque sticky header; an overlay mobile menu; system light/dark themes; deliberate hero gradient reversal (125 degrees light, 305 degrees dark); local Open Sans; native details controls; no manual theme toggle, animation, framework or CDN. The navigation remains usable without JS. With JS, collapsed mobile links leave the tab order; Escape closes and returns focus; outside click, following a link or tabbing out dismisses the panel.

The article remains explicitly labeled as a prototype editorial concept. No named researcher or client result is invented. Remove it from production until finished content is available. Both pages contain noindex directives to remove before a final production release.

## Review sequence

See REVIEW.md for the separate Personal Web Design review followed by the Universal Design Principles review and the fixes each produced. This is a source and offline-layout review, not a claim that this version has been browser tested or is fully WCAG conformant.

## Assets

Company logo and banner come from the supplied website archives. The mascot is the image you supplied in this conversation. Open Sans font files and their OFL license are in assets/fonts. No imagery from the slide template is embedded.

## Next review

Upload the package and review both Home and Services. Actual browser reflow, the overlay menu's layout stability, keyboard interaction, device/theme rendering and screen readers remain to be verified. This prototype does not authorize an automatic move to full-site implementation.

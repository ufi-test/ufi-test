# UFi Research — homepage revision 03

## Upload

Unzip and upload the contents to the V2 directory of your test GitHub Pages repository. Replace index.html, css/style.css and js/main.js and include assets/images/star.svg. The ZIP is a complete homepage package, with relative asset URLs and no build step or custom-domain CNAME. No deployment is automated.

Local preview: run `python -m http.server 8000` in this folder and open http://localhost:8000. Stop with Ctrl+C.

## Changes in this revision

- The hero contains the logo and tagline only. The service introduction and project contact link sit in the first content section.
- Two small gold SVG stars frame the desktop hero. One smaller star appears on mobile. They are decorative, static, hidden from assistive technology, and cannot intercept clicks.
- Team photos and Launchpad references are removed from the homepage. A brief About introduction links to the existing About page. Unused portrait assets are omitted.
- On mobile, the menu opens as a panel over the page below the sticky header. Opening it does not change the page layout. Escape, outside click, selecting a link, or moving keyboard focus outside the header dismisses it. Escape returns focus to the menu button. Outside-click dismissal returns focus only if it would otherwise remain in the hidden menu; it does not interrupt focus on a newly selected page control.
- Without JavaScript, navigation remains visible in normal flow so all destinations remain accessible.

## Retained decisions and scope

Mobile-first base styles; larger layouts use min-width queries. Intentional gradient reversal: 125 degrees in light mode, 305 degrees in dark mode. OS theme selection, local Open Sans, no CDN/framework dependencies, one H1, skip link, and visible keyboard focus. Separate About, Services, Contact, and Playtest links currently open the existing live pages, which are not redesigned in this homepage package. Contact links reach the existing live contact form; its Web3Forms setup is unchanged.

The Research insights block remains a clearly labeled article concept, not a published article. Keep it out of the final public site until editorial content is ready. The prototype has a noindex meta tag to remove for the final production release.

## Verification

JavaScript syntax, simulated navigation behavior, local paths, section IDs and anchors, removed content, theme definitions, and ZIP integrity checked. Existing flat-color text pairings are unchanged from the previous checked palette. New stars carry no information. Direct browser verification of this revision, actual mobile reflow, theme rendering, focus behavior with assistive technology, and image/gradient contrast remain pending manual upload. No full WCAG conformance claim is made.

## Assets

Logo and banner from the supplied archives. Local Open Sans weights and OFL license included under assets/fonts. Stars are newly authored SVG geometry inspired by the presentation's decorative stars. No slide placeholder portraits, astronauts or other template imagery are included.

# Article builder — V32

Open index.html here, or /article-builder/ on the hosted V33 website. No installation, account, backend, or GitHub credentials are needed. The editor is public if uploaded to a public website; its URL is not access control.

## Getting started

Choose Use a template or Start blank. A blank article begins with title/introduction fields and no additional content. The template is the existing playtest article; replace its text and remove the sections you do not need. If a browser draft exists, Continue your article is available. Starting another article or opening a different draft asks before replacing existing work. More → New article returns to the start screen without clearing the current draft.

## Writing

Point between sections to reveal a + insertion strip. It opens a small chooser, and the chosen content is inserted at that exact point. There is one shared insertion point in each gap, including before the first section. Add content remains visible at the end; an empty article has Add your first section. Keyboard focus reveals the same controls. Touch-capable devices keep insertion buttons visible.

Inside highlight boxes, the same insertion workflow offers Heading, Text, and List. Boxes cannot contain other boxes. The old Labeled entries control has been removed. Old label/description pairs import as ordinary headings and text, without discarding their content.

- Heading is a compact single-line field. Main headings are automatic; Use as a subheading is available under Options when needed. Box heading levels follow their context automatically.
- Text grows with its contents. Bold, Italic, and Link show visual formatting instead of markup. A blank line separates paragraphs. Basic formatting uses a deliberately small vocabulary. Pasted/dropped text is inserted as plain text; use the formatting buttons afterward. Insert images through the Image type.
- List has Bullets / Numbers and one item per line.
- Highlight box has an optional label and title, then its content. Heading levels and layout do not require controls.
- Image has an image chooser, thumbnail, description, and optional caption. Only select This image is only decoration if it adds no information; that disables the description field and exports an empty alternative. Screenshots/diagrams needed to understand the article need a description.
- Quote has quotation text and optional attribution.
- Link buttons has Button text / Web address pairs and Add another link. Inline links within text use the Link formatting button instead.

Move up and Move down are visible beside the top-level drag handle, followed by the section type. Options at the right contains Make a copy and Delete. Inside boxes, the arrows use the same position without a drag handle. Link-button rows also have visible movement controls. Labels wrap on narrow layouts; unavailable directions stay disabled. Top-level sections can still be dragged. Undo/Redo recover recent changes. Use as opening text is an occasional text style under Options, rather than a checkbox on every text section.

Preview uses the website's navbar/footer, typography, themes, and accessibility settings. Desktop fills the available preview width; Mobile caps it at 375px or the available width. Preview links do not navigate. Preview in the toolbar helps reach it on small screens. Editing remains in the left pane; direct editing of the preview is intentionally deferred.

## Saving and publishing

Save draft downloads a portable JSON file containing text, formatting, layout and images. Keep it for backup or send it to the person publishing the website. Open saved draft is available at startup and under More. Browser autosave is local, can be denied/cleared, and is shared by editor tabs. Use one tab at a time and keep downloaded backups. File-URL storage is browser-dependent; use GitHub Pages or a local HTTP server for consistent storage.

The filename is automatic and is fixed after the first article export. Reopening the exported draft preserves the URL even if you change the title. A new article gets a new identity; the author never needs to enter a filename.

Choose Finish article when ready. It checks required details/content and takes you to the first issue. After correction, choose Finish again. The completion panel offers Download article ZIP and Save editable draft. Close or Return to editing preserves your work and publishes nothing.

For upload, download the article ZIP from that panel, extract it, and merge its article HTML plus assets/ into the same website folder as index.html. Preserve existing shared files. Use V32 or later. Add the included homepage-link snippet manually. Keep editable-draft/ locally; avoid uploading private/unpublished drafts into a public repository. ZIP instructions explain the steps. The builder never publishes anything itself.

## Compatibility and limits

V1/V2 drafts import into V3 with valid existing filenames retained. Each schema has its own autosave slot: V30 writes current-v3 and may read/migrate current-v2 or current without overwriting them. V3 drafts require V29 or later. Undo history is session-local and bounded. The article cap is 200 sections including box contents; link groups have up to 30 links. Raster images are limited to 5 MB each and 20 MB total. SVG uploads and arbitrary authored HTML are excluded. A small allowlist sanitizes all visual formatting before saving/export.

Native browser, keyboard, screen-reader, touch/zoom, selection/formatting, file download/import and iframe checks still need verification. Review notes document the completed model/export/offline checks and preview-service limitation.


## V30 visual refinements

Box label/title are complete paired fields, each with its label above the input. Insertion strips show + Add content here with a stronger hover/focus response, including inside boxes. The final strip stays visibly labeled + Add content; no duplicate button follows it. Type accents are small colored edges/tinted headers, supported by text labels. Increased contrast keeps them neutral. Help Close is in its header; Escape and backdrop dismissal remain available.


## V31 visual refinements

Action icons use one local outline set alongside text labels. Icons never replace the action's visible name. Routine editor entry focuses a writing field, not the scroll region; that region remains keyboard-scrollable with a subtle focus cue. The extra guide line/indent inside highlight boxes is removed, retaining the real child sections and outer box boundary. All prior file/schema/export behavior is preserved.


## V32 visual refinements

The movement group has its own neutral surface/border, separate from the larger, bolder block title. Delete actions use red label/icon styling and a subtle red hover/focus surface; text labels still convey the action. Writing fields use a quieter focus border/inset edge, while errors and non-writing controls keep stronger focus cues. Increased contrast has checked variants and forced colors use system colors. No draft/schema/workflow changes are required.

## V33 archive filenames

Finish downloads a shorter article ZIP name (at most 41 characters for generated identities): a short title fragment, compact UTC date/time, identity suffix and .zip. The name stays stable after export and reopening. Older published names use a deterministic hash suffix when no timestamp exists. Article pages, image paths and editable-draft filenames are unchanged, so existing published links remain compatible.

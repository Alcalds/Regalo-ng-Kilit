# RnK V1.11 — Responsive + Readability Audit

## Scope
Full audit of `index.html`, `about.html`, `our-work.html`, `places-stories.html`, and `get-involved.html`, with priority on the Places & Stories overlap shown in the client screenshot.

## Root causes found

### Critical — Places & Stories field-note overlap
The V1.10 interior Field Notes cards reuse `.field-note-copy`, a class that already had a homepage rule setting `position:absolute`. The new V1.10 card styles did not reset that property. As a result, the copy blocks were removed from normal flow and could stack over the hero/adjacent content.

**Correction:** the Places & Stories Field Notes section now has a dedicated `.field-notes-detail` scope. Within that scope, `.field-note-copy` is explicitly reset to normal document flow (`position: static`) and the cards are self-contained flex columns.

### Critical — Field Notes contrast
The existing homepage `.field-notes-section` rule assigned a light background. Places & Stories reused the same class while also using white/dark-section typography. This produced white text on a nearly white background.

**Correction:** the detailed Field Notes section now explicitly restores the intended dark background and readable light text using the dedicated scope.

## Responsive corrections
- Added min-width / wrapping safeguards to story grids and copy blocks.
- Added an intermediate desktop header treatment to protect nav/CTA spacing at 901–1160px.
- Field Notes moves to a single-column reading layout below 980px.
- Mobile Field Notes media converts to one lead image plus two supporting images without fixed-height overflow.
- Interior sections use resilient vertical padding and `overflow-x: clip` safeguards.

## Typography/readability corrections
- Increased navigation and CTA text modestly.
- Raised section labels / metadata from the previous 10–12px-equivalent range to a more readable 13–14px-equivalent range.
- Raised principal body/supporting copy to approximately 17–19px desktop and about 16–17px mobile.
- Increased captions, footer text, scholar metadata, and supporting links while retaining hierarchy.
- Large editorial headings were intentionally not globally enlarged.

## Accessibility / technical checks
- Focus-visible styling retained.
- Reduced-motion handling retained and smooth scrolling disabled under reduced motion.
- Existing alt text retained.
- Current HTML has no duplicate IDs in the five main pages.
- Current local links/assets were checked for missing references.
- Current CSS parses without stylesheet syntax errors.
- `js/main.js` passes JavaScript syntax validation.

## Wix Studio path
The corrections rely on normal flow, responsive grids/stacks, container sizing, breakpoints, responsive type, and ordinary image containers. No additional JavaScript was introduced for layout fixes, keeping the design practical to reproduce in Wix Studio.

## Responsive validation matrix
A structural browser-layout audit was run across all five pages at the requested viewport widths: **1920, 1600, 1440, 1366, 1280, 1024, 900, 768, 430, 390, and 375px**.

Checks included viewport overflow, main-section collision, Places & Stories Field Notes containment, and normal-flow positioning. The final build passed **55/55 page/viewport combinations** with no horizontal document overflow or adjacent-section overlap detected. The homepage's intentionally oversized cinematic hero frames were treated as designed bleed elements because they remain clipped by the hero and do not create document overflow.

Representative computed type checks after the correction pass:
- desktop reading copy: approximately 19px;
- mobile reading copy: approximately 16.6px;
- desktop labels/metadata: approximately 14.2px;
- mobile labels/metadata: approximately 13.1px;
- captions/footer support text: approximately 15–16px depending on viewport.

# RnK Get Involved Participation Journey — V1.14

## Purpose
V1.14 strengthens the visitor journey after selecting **Get Involved**. The page now moves from a short introduction into a clear decision flow instead of presenting a hero followed by a generic contact form.

## Visitor flow
**Get Involved → Choose a Path → Understand the Pathway → See RnK in Action → Start a Conversation**

## Changes
- Shortened the Get Involved hero so the participation choices appear sooner.
- Added an **Explore ways to get involved** anchor CTA.
- Reworked the four participation routes into a modern asymmetric editorial grid.
- Added four pathway explanations before the inquiry form.
- Added **RnK in Action** using existing verified activities: CAFA community partnership, RnK-SGP BERAE training, and breastfeeding/nutrition advocacy with LATCH.
- Kept the inquiry form and automatic category selection.
- Path cards now set the inquiry category and move to the appropriate explanation instead of jumping immediately to the form.
- **Start a conversation** buttons move to the form while preserving the selected category.
- Updated cache-busted production assets to `styles-v1-14.css?v=1.14` and `main-v1-14.js?v=1.14`.

## Wix Studio implementation path
This page is intentionally composed from ordinary Wix-compatible patterns:
- Hero section with image, overlay, heading, paragraph, and anchor button.
- 12-column/2-column responsive card grid using containers/stacks.
- Four information rows using responsive grid/stack layouts.
- Three image story cards linked to existing pages/anchors.
- Native Wix Form replacing the static prototype's mailto behavior.
- Buttons/anchors can preset the Wix Form interest field using native form settings or lightweight Velo only if needed.

No React, Tailwind, Bootstrap, GSAP, or dependency-heavy front-end framework is required.

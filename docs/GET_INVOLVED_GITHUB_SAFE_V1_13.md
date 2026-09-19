# V1.13 — Get Involved + GitHub-Safe Form

## Purpose
This pass upgrades Get Involved from a list of mail links into a participation hub and reduces stale-asset problems during GitHub Pages deployment.

## Get Involved pathways
The page now presents four clear routes before the inquiry form:
1. Partner with RnK
2. Education & Training
3. BERAE & Conservation
4. Share Skills & Support Communities

Choosing a route preselects the matching inquiry category and scrolls the visitor to the contact form. No donation pathway was added because no approved RnK donation/payment workflow has been supplied.

## Contact form
The VS Code/GitHub prototype does not store visitor data. After client-side validation it opens the visitor's email application with the inquiry prepared for regalongkilit@gmail.com.

For Wix Studio, replace this prototype behavior with a native Wix Form and Wix automation while retaining the same visible fields and layout.

## GitHub Pages cache protection
All HTML pages now reference versioned static asset filenames:
- `css/styles-v1-13.css?v=1.13`
- `js/main-v1-13.js?v=1.13`

The versioned filenames are included in the project so GitHub Pages and browsers do not reuse the previous V1.12 stylesheet or script after deployment.

## Wix Studio mapping
- Participation hub: responsive grid / stacked containers + buttons
- Contact layout: two-column grid that stacks on tablet/mobile
- Form: native Wix Form fields
- Route choice behavior: button anchor to form and preselected form category, implemented with Wix form logic/Velo only if needed

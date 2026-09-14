# Kingfisher Park — Client Revision V3

## Living Light autoplay added

The Hero now automatically demonstrates its full daylight-to-night story:

**Daylight → Golden Hour → After Dark → Daylight**

### Timing
- Each stage holds for approximately 6.8 seconds.
- The transition between stages takes approximately 1.9 seconds.
- The background scenes, Lightline slider, active stage, supporting context, tide note, and firefly intensity stay synchronized.

### Visitor interaction
Autoplay pauses when a visitor:
- drags the Lightline slider;
- uses the slider from the keyboard;
- clicks a Daylight / Golden Hour / After Dark stage;
- focuses an interactive element inside the Hero.

After manual interaction, autoplay waits approximately 12 seconds before resuming.

### Performance and accessibility
- Autoplay stops while the Hero is outside the viewport.
- Autoplay stops while the browser tab is hidden.
- `prefers-reduced-motion: reduce` disables autoplay and animated firefly movement.
- Manual controls remain available at all times.

## Wix Studio compatibility

This behavior was intentionally implemented with only browser-native JavaScript and CSS:
- `requestAnimationFrame`
- `setTimeout`
- `IntersectionObserver`
- `matchMedia`
- standard DOM events and CSS custom properties

No React, GSAP, external animation library, canvas framework, or third-party slider library is required.

For Wix Studio, the same interaction can be recreated with the existing hybrid plan:
- native Wix Studio elements for Header, text, CTA, and surrounding layout;
- a Wix Custom Element for the Living Light scene/slider/firefly interaction;
- Velo only where Wix page-to-element communication is needed.

The autoplay logic is therefore a prototype of behavior that is feasible to carry into Wix Studio rather than a VS Code-only effect.

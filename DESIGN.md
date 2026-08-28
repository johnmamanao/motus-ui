---
name: 'Motus'
description: 'A monochrome component studio where form responds visibly to state.'
colors:
  black: '#000000'
  panel: '#0a0a0a'
  panel-raised: '#111111'
  line: '#262626'
  white: '#ffffff'
  text: '#ededed'
  muted: '#a1a1a1'
  preview: '#f2f3f5'
  fallback-preview: '#f3f3f5'
  key-face: '#101011'
  key-base: '#c7c7cc'
  control-dark: '#111114'
  control-light: '#f5f5f7'
  control-muted: '#6e6e73'
  focus-blue: '#0a84ff'
  copy-success-surface: '#eaf7ee'
  copy-success-text: '#175f35'
  copy-error-surface: '#fff0ef'
  copy-error-text: '#9c2f28'
typography:
  display:
    fontFamily: 'Bricolage Grotesque Variable, sans-serif'
    fontSize: 'clamp(3.625rem, 6.5vw, 6.5rem)'
    fontWeight: 700
    lineHeight: 0.91
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Bricolage Grotesque Variable, sans-serif'
    fontSize: 'clamp(2.625rem, 5vw, 4.75rem)'
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  body:
    fontFamily: 'Archivo Variable, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'IBM Plex Mono, monospace'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: '0.1em'
rounded:
  sm: '8px'
  md: '10px'
  key: '12px'
  lg: '14px'
  action: '18px'
  pill: '999px'
spacing:
  xs: '8px'
  sm: '12px'
  md: '20px'
  lg: '32px'
  xl: '64px'
components:
  button-primary:
    backgroundColor: '{colors.white}'
    textColor: '{colors.black}'
    rounded: '{rounded.md}'
    padding: '0 18px'
    height: '48px'
  button-neutral:
    backgroundColor: '{colors.white}'
    textColor: '{colors.black}'
    rounded: '{rounded.sm}'
    padding: '11px 13px'
  button-click-key:
    backgroundColor: '{colors.key-face}'
    textColor: '{colors.white}'
    rounded: '{rounded.key}'
    padding: '0 20px'
    height: '56px'
    width: '190px'
  button-click-key-base:
    backgroundColor: '{colors.key-base}'
    rounded: '{rounded.key}'
    height: '56px'
    width: '190px'
  button-resume-download:
    backgroundColor: '{colors.control-dark}'
    textColor: '{colors.white}'
    rounded: '16px'
    padding: '6px 16px 6px 6px'
    height: '64px'
    width: '244px'
  button-resume-download-started:
    backgroundColor: '#113523'
    textColor: '#e1f7e8'
    rounded: '16px'
    height: '64px'
    width: '244px'
  button-resume-download-error:
    backgroundColor: '#431f1d'
    textColor: '#ffe8e6'
    rounded: '16px'
    height: '64px'
    width: '244px'
  button-copy-link:
    backgroundColor: '{colors.control-light}'
    textColor: '#1d1d1f'
    rounded: '16px'
    padding: '6px 6px 6px 20px'
    height: '56px'
    width: '202px'
  button-copy-link-success:
    backgroundColor: '{colors.copy-success-surface}'
    textColor: '{colors.copy-success-text}'
    rounded: '16px'
    height: '56px'
    width: '202px'
  button-copy-link-error:
    backgroundColor: '{colors.copy-error-surface}'
    textColor: '{colors.copy-error-text}'
    rounded: '16px'
    height: '56px'
    width: '202px'
  panel:
    backgroundColor: '{colors.panel}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '20px'
  search-field:
    backgroundColor: '{colors.panel}'
    textColor: '{colors.text}'
    rounded: '12px'
    padding: '0 16px'
    height: '58px'
---

# Design System: Motus

## Overview

**Creative North Star: "The Monochrome Studio"**

Motus pairs the calm authority of an opaque technical shell with the material surprise of an interactive component studio. Black, white, and gray documentation surfaces provide dependable structure; live components introduce motion, feedback, elasticity, and drag where those effects demonstrate real behavior.

The shell should feel product-led rather than gallery-like. Visitors first understand the promise, see a practical CTA and install command, and manipulate a real component. The experience then moves from guided examples directly into a dominant full-canvas workspace where the live artifact and source take precedence over surrounding documentation.

**Key Characteristics:**

- Opaque, high-contrast black documentation surfaces
- White action cues and gray structural details in the shell
- Intentionally chromatic live previews, visual effects, and source syntax
- Oversized, compressed display type balanced by compact technical labels
- A canvas-first detail studio with floating controls
- Restrained GSAP reveals and purposeful component physics
- Lightweight Lottie vector motion for the Motus identity and short confirmation feedback

## Colors

The shell palette is strictly monochrome. Hierarchy outside the live artifact comes from black-to-white luminance, opacity, texture, and adjacency rather than hue. Component previews and Prism source syntax are intentionally chromatic.

### Primary

- **White Signal:** The primary action, selected-state, focus, and install-prompt color. It creates decisive contrast against the black shell.

### Secondary

- **Focus Blue:** A contained functional accent for the button family's focus rings. It does not enter the documentation shell.

### Neutral

- **Absolute Black:** The page canvas and deepest shell surface.
- **Studio Panel:** The standard control, command, and studio surface.
- **Raised Black:** Active controls, component headers, and raised navigation states.
- **Structural Line:** Quiet borders and dividers that define hierarchy without bright outlines.
- **White:** Primary controls and inverted editorial sections.
- **Preview Gray:** The light studio-canvas base that separates demonstrations from the shell.
- **Fallback Preview Gray:** The neutral full-bleed loading surface used while a lazy visual-effect preview resolves.
- **Interface Text:** Primary light text on black.
- **Muted Text:** Supporting copy, labels, and metadata.
- **Key Face:** Click Key's near-black moving face.
- **Key Base:** Click Key's exposed gray base and source of visible travel.
- **Control Dark:** Resume Download's graphite control body and Copy Link's trailing utility tile.
- **Control Light:** Copy Link's idle surface.
- **Control Muted:** Supporting state copy inside compact controls.
- **Copy Success:** A pale green surface with dark green text for confirmed clipboard work.
- **Copy Error:** A pale red surface with dark red text for a retryable clipboard failure.

**The Material Boundary Rule.** The documentation shell is opaque. Glass, translucency, blur, and refraction belong inside the live component demonstrations.

**The Contained Chroma Rule.** Navigation, directory surfaces, metadata, floating studio chrome, and focus states remain black, white, and gray. Saturated color is reserved for live component previews, effect canvases, and syntax tokens inside the source panel.

## Typography

**Display Font:** Bricolage Grotesque Variable (with sans-serif fallback)  
**Headline Font:** Bricolage Grotesque Variable (with sans-serif fallback)  
**Body/UI Font:** Archivo Variable (with sans-serif fallback)  
**Code/Data Font:** IBM Plex Mono (with monospace fallback)

**Character:** Archivo keeps navigation, controls, and explanations exact and readable. Bricolage Grotesque gives major editorial statements a compact, authored silhouette, while IBM Plex Mono separates code, commands, counts, and metadata from prose.

### Hierarchy

- **Hero display:** Bricolage Grotesque Variable, heavy and tightly tracked, used only for the opening product promise.
- **Section headline:** Bricolage Grotesque Variable, tightly tracked with compact leading, used for section and studio titles.
- **Body:** Archivo Variable at comfortable reading sizes and approximately 1.5–1.65 line height; keep explanatory lines near 60–70 characters where layout permits.
- **Label:** IBM Plex Mono for commands, source, viewport data, counts, and compact uppercase metadata. Do not use it for paragraphs.

**The Two-Voice Rule.** Archivo explains and operates; Bricolage announces. IBM Plex Mono is functional notation, not a third editorial voice.

## Layout

The product has two connected forms: landing page (`/`) and the full-canvas component workspace (`/components` and `/components/:id`). The landing page uses a split first viewport so the promise, CTA, branded CLI command, and Text Motion demo are visible together on desktop. Subsequent sections alternate between full-width editorial contrast and contained preview structures.

The workspace is one inset, rounded, full-viewport canvas. A dark grouped component rail overlays the left edge and collapses through a top-left control. Fullscreen, reset, and source controls live in a compact floating group at the upper right. Source opens as a dark split drawer on the left while the active preview remains visible on the right. There is no category directory or metadata page between the landing page and the workspace.

The preview responds to the real workspace width instead of simulating separate device frames. On screens below 900px, the component rail is closed by default and the source drawer uses the full canvas width. Preview controls remain icon-forward with accessible labels, and component content stays centered with reduced edge padding.

Use fluid outer gutters and generous section spacing. Dense controls may use the smaller rhythm, but primary reading and demonstration surfaces need visible separation.

Lazy component switches preserve the material already under the visitor's eye. Inline control fallbacks are transparent; full-bleed effect fallbacks fill the canvas with Fallback Preview Gray. Route changes are scheduled through React `startTransition`, allowing the current canvas to remain painted until the next component can commit.

**The No-Black-Flash Rule.** Never expose the black shell as an intermediate component-switch frame. Use a transparent inline fallback or the neutral full-bleed fallback that matches the destination surface.

## Elevation & Depth

The shell is flat by default and derives depth from monochrome tonal layering, structural borders, and surface adjacency. Shadows are reserved for the mobile navigation menu and studio controls that genuinely float over the canvas. Live components may use chromatic glow, blur, refraction, and shadow as part of their demonstrated material behavior.

**The Structural Depth Rule.** Prefer a change from Absolute Black to Studio Panel or Raised Black plus a quiet line before adding a shadow.

Motion uses restrained GSAP reveal sequences and short state transitions. Component physics may be elastic or viscous when that behavior communicates the gesture. Within the button family, Press Button uses brief linear-feeling travel, Resume Download moves a document into a file tray before a real download begins, and Copy Link uses a one-shot confirmation after actual clipboard work. Lottie is reserved for the Motus identity and state-specific feedback; it does not replace component behavior. `prefers-reduced-motion` suppresses CSS animation and transition duration, and Lottie playback respects the same preference; controls and content remain understandable without animated feedback.

## Shapes

Shell surfaces use gently rounded rectangles with thin neutral borders. The workspace uses a broad 24px inset frame; its floating controls use compact 11px–15px corners, and the component rail uses a 20px enclosure. Pill shapes are limited to compact tags and unmistakably capsule-like controls. The Motus mark uses a compact moving-frame signature.

Component demonstrations may use fuller, softer, more refractive silhouettes than the shell. Keep their containment clear so expressive material does not leak into the documentation chrome.

## Components

### Header

The header is a compact black navigation surface containing only the Motus brand, Components, GitHub, and a labeled mobile menu. Do not add an announcement or release bar, and do not duplicate the page's primary CTA in the header.

### Buttons

- **Primary:** White fill with black text, medium corners, and a compact 48px height.
- **Neutral:** White fill with black text for copy and studio actions.
- **Ghost:** Transparent or panel-toned with quiet borders; hover moves one tonal step upward.
- **Focus:** Press Button, Resume Download, and Copy Link use a visible 2px Focus Blue ring with a 4px offset. Native button focus, activation, and disabled semantics remain intact.
- **Press Button:** A 190px project action built from separate face and base layers. Pressing translates the face 6px down and right to meet the exposed base, using a direct 75ms transition. Pointer down and keyboard Enter/Space create the down state; pointer up, cancel, leave, or the matching keyup always release it. Short down and up sounds are generated locally from Web Audio oscillators rather than loaded audio assets, and the real optional action fires from the native click.
- **Resume Download:** A standalone 244px graphite, Macintosh-style portfolio control with an authored 52px document bay, an explicit “Download résumé” action, and visible file metadata. Its four states are idle, preparing, download started, and error/retry; none changes the 64px silhouette. On activation, the 740ms Lottie document transfer finishes before the supplied callback or native `href` download begins. It exposes `aria-busy`, a polite live region, native keyboard activation, optional `href`, `filename`, `fileLabel`, and `onDownload` inputs, AA-contrast state colors, and an immediate static reduced-motion path.
- **Copy Link:** A stable 202px project-sharing utility with a dedicated trailing icon tile. The label moves through explicit copying, copied, and retry states without changing the control's silhouette. After real clipboard work succeeds, stacked-page geometry resolves into a one-shot Lottie check and the surface shifts to confirmation green. Duplicate activation is rejected while copying or confirmed, failures remain retryable, and the reset timer is cleared on unmount. It uses `aria-busy`, a polite live region, native keyboard activation, and distinct success and error color pairs.

**The Three Response Grammars Rule.** Keep the family deliberately varied: Press Button communicates physical travel and acoustic release, Resume Download communicates file transfer through a document-to-tray motion, and Copy Link communicates utility progress through label and glyph resolution. Do not normalize them into one silhouette or motion pattern.

**The Self-Contained Control Rule.** Press Button, Resume Download, and Copy Link own only their control surface, state, and generated feedback. They do not paint a showcase card, scene, or page background. The shared preview host stays transparent, centers the control, and contributes only responsive height and breathing room.

**The Honest Async Rule.** Copy Link's callback or Clipboard API result determines success or error; do not replace it with a cosmetic timer. A timer may return the confirmed success state to idle, but it never decides the outcome.

**The Honest Download Rule.** Resume Download reports that a download started, not that it completed. Its 740ms transfer is a deliberate pre-action sequence: the callback or native anchor runs only after the document reaches the tray, while reduced-motion users bypass the wait. The animation never decides success.

### Search and Filters

The search field is a labeled, full-width panel input with a visible search icon and keyboard hint. Category filters show both category names and counts. On small screens, filters remain horizontally scrollable rather than collapsing into an unlabeled control.

### Directory Rows

Rows prioritize component name and portfolio use case, then description and category. Responsive layouts progressively remove secondary description and tag content but retain identity, use case, and navigation affordance. The empty state names the problem and offers a Clear Filters action.

### Preview Stage

The guided stage combines use-case tabs, a themed browser bar, a working preview, and a concise caption. The live component is always the visual center; the surrounding controls stay opaque and neutral.

### Liquid Glass Primitive

`LiquidGlassCard` is reserved for component demonstrations. It composes a background-dependent blur, dark tint, optical rim, inner highlight, pointer-tracked specular light, and optional GSAP elastic drag. Keep content on the top layer, use a detailed image or chromatic tonal field behind the surface so the blur is visible, and maintain a dark active state when glass sits over unpredictable imagery. The primitive remains Tailwind-first and includes its dynamic pointer light inline rather than depending on a separate component stylesheet.

Text Motion is one transparent line of animated typography with nineteen selectable variants: Lift, Hinge, Drift, Ripple, Stretch, Cascade, Magnet, Arc, Roll, Echo, Shutter, Orbit, Weight, Sweep, Scatter, Pulse, Drop, Fan, and Ticker. Ticker adapts the vertical digit-reel idea into an original glyph wheel that works with letters and numbers. A single compact control at the top opens the animation picker, keeping the component canvas free of persistent menus, backgrounds, and decorative graphics.

### Visual Effects

Silk Background uses broad pearl and silver folds that bend toward the pointer while preserving a calm text-safe field. Halftone Background uses a responsive dark-violet dot field over a peach, gold, and mint gradient. Light Background uses soft cyan, pink, and violet light with quiet wave lines and centered text-safe composition. All three render Canvas 2D scenes with the GSAP ticker, respect reduced motion, and fill the preview canvas edge to edge.

### Component Studio

The detail route is a dominant canvas rather than a stack of documentation panels. A monochrome floating toolbar contains Preview/Source tabs, Desktop/Tablet/Mobile controls, Reset in Preview or Copy in Source, and Fullscreen. The browser-native fullscreen action expands the studio itself. Desktop previews target the full 1440px canvas; Tablet targets 768px and Mobile targets 390px. Desktop and Tablet preserve their exact widths and scroll locally when needed; screens below 600px initially select Mobile.

Preview backgrounds and components are intentionally chromatic. The Source panel uses colored Prism tokens on a deep blue-black field with persistent line numbers. Install labels follow `npx @motus-ui/cli@latest add <component-slug>`, and source headers use the same public slug as `<component-slug>.tsx`, even when the application's internal route ID differs.

### Component Compass

The left rail is the workspace's component switcher. Group entries by their practical category, keep the active item visually distinct and marked with `aria-current`, and let each item update the route without leaving the canvas. The rail may switch between grouped and flat views. It collapses on narrow screens, closes with Escape, and keeps its own scroll region so the preview never moves.

## Do's and Don'ts

### Do:

- **Do** make a live, working component the proof of every component claim.
- **Do** keep navigation, tabs, device controls, reset, fullscreen, and copy actions explicitly labeled.
- **Do** keep the shell opaque and monochrome while allowing purposeful color inside previews and source syntax.
- **Do** preserve usable pointer, touch, keyboard, responsive, and reduced-motion behavior.
- **Do** show source that corresponds to the component currently being previewed.

### Don't:

- **Don't** apply glassmorphism to the shell, navigation, directory, or general documentation panels.
- **Don't** turn the directory into an undifferentiated grid of identical cards.
- **Don't** let preview or syntax colors leak into the header, component rail, floating controls, or workspace chrome.
- **Don't** use cute illustration language or excessive pills as generic decoration.
- **Don't** add ambient motion that competes with a component's physical gesture.
- **Don't** hide essential evaluation or copying behind an account, backend, or paid service.

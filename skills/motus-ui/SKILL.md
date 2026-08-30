---
name: motus-ui
description: >-
  Install, integrate, and use Motus UI, the React component library for animated
  text, tactile actions, portfolio interfaces, and interactive visual effects.
  Use when adding Motus UI to a React, Vite, or Next.js project; selecting a text
  motion variant; wiring copy or download actions; or troubleshooting Motus styles,
  browser APIs, motion, and client-component boundaries.
---

# Motus UI

Motus UI is an ESM React component library for expressive portfolio interfaces. It ships compiled CSS and TypeScript declarations and supports React 18.2 and React 19.

Use the public package API. Do not copy implementation files into a consumer project unless the user explicitly asks to fork or modify a component.

## Install

```bash
npm install motus-ui
```

Import the compiled stylesheet once in the application entry file or root client layout:

```tsx
import 'motus-ui/styles.css';
```

The consumer does not need Tailwind CSS. Motus uses Tailwind at package build time and publishes the generated stylesheet.

## Quick start

```tsx
import { CopyLinkButton, TextMotion } from 'motus-ui';
import 'motus-ui/styles.css';

export default function App() {
  return (
    <main>
      <TextMotion text="Selected work" variant="ripple" />
      <CopyLinkButton value="https://example.com/project" />
    </main>
  );
}
```

In a Next.js App Router project, render Motus components from a client component:

```tsx
'use client';

import { TextMotion } from 'motus-ui';

export function AnimatedHeading() {
  return <TextMotion text="Selected work" variant="lift" />;
}
```

## Public API

### `TextMotion`

| Prop            | Type                | Default           | Guidance                      |
| --------------- | ------------------- | ----------------- | ----------------------------- |
| `text`          | `string`            | `'SELECTED WORK'` | Primary one-line text         |
| `alternateText` | `string`            | `'CREATIVE CODE'` | Second value used by `ticker` |
| `variant`       | `TextMotionVariant` | `'lift'`          | Animation style               |

Variants: `lift`, `hinge`, `drift`, `ripple`, `stretch`, `cascade`, `magnet`, `arc`, `roll`, `echo`, `shutter`, `orbit`, `weight`, `sweep`, `scatter`, `pulse`, `drop`, `fan`, `imprint`, `slipstream`, `relay`, `foldline`, `baseline`, `depthline`, and `ticker`.

Choose a variant based on the requested character:

- Use `lift`, `drift`, or `cascade` for restrained editorial entrances.
- Use `ripple`, `arc`, `orbit`, or `fan` for more expressive display text.
- Use `shutter`, `sweep`, or `roll` for directional transitions.
- Use `stretch` or `weight` when the typography itself should transform.
- Use `imprint` for a tactile press, `slipstream` for directional speed, or `relay` for sequential emphasis.
- Use `foldline`, `baseline`, or `depthline` for editorial structure and spatial staging.
- Use `ticker` only when transitioning between `text` and `alternateText`.

Keep the text to one line. Let the surrounding layout provide responsive sizing and enough horizontal space.

### `CopyLinkButton`

| Prop       | Type                                       | Default                      | Guidance                                                               |
| ---------- | ------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `value`    | `string`                                   | `'https://example.com/work'` | Clipboard value                                                        |
| `onCopy`   | `(value: string) => void \| Promise<void>` | Browser clipboard            | Use for analytics, custom clipboard logic, or non-browser environments |
| `disabled` | `boolean`                                  | `false`                      | Disable the action                                                     |

Prefer the built-in clipboard behavior for ordinary HTTPS pages. Provide `onCopy` when the application already owns the copy workflow.

### `ResumeDownloadButton`

| Prop         | Type                          | Default          | Guidance                                                      |
| ------------ | ----------------------------- | ---------------- | ------------------------------------------------------------- |
| `href`       | `string`                      | `'/resume.pdf'`  | File URL                                                      |
| `filename`   | `string`                      | `'resume.pdf'`   | Downloaded filename                                           |
| `fileLabel`  | `string`                      | `'PDF · résumé'` | Visible supporting label                                      |
| `onDownload` | `() => void \| Promise<void>` | Native download  | Use for generated files, authenticated requests, or analytics |
| `disabled`   | `boolean`                     | `false`          | Disable the action                                            |

The native download starts after the transfer animation. Do not add a second artificial delay.

### `ClickKey`

| Prop       | Type                          | Default     | Guidance                       |
| ---------- | ----------------------------- | ----------- | ------------------------------ |
| `onAction` | `() => void \| Promise<void>` | `undefined` | Run the project-opening action |
| `disabled` | `boolean`                     | `false`     | Disable action and sound       |

`ClickKey` has a fixed "Open project" label, a split-flap scanning state, and a short activation cue. Use it for that intent; do not present it as a generic text button.

### `AtlasReveal`

| Prop              | Type                                | Default     | Guidance                                           |
| ----------------- | ----------------------------------- | ----------- | -------------------------------------------------- |
| `country`         | `AtlasCountryId`                    | `undefined` | Controlled country                                 |
| `defaultCountry`  | `AtlasCountryId`                    | `'japan'`   | Initial country for an uncontrolled map            |
| `onCountryChange` | `(country: AtlasCountryId) => void` | `undefined` | Synchronize a selection with application state     |
| `showSelector`    | `boolean`                           | `true`      | Hide only when the application supplies its own UI |
| `className`       | `string`                            | `''`        | Extend the outer card layout                       |

Country IDs: `japan`, `philippines`, `italy`, `iceland`, `chile`, `india`, `australia`, and `brazil`.

Use `AtlasReveal` for a location story, travel feature, regional profile, or editorial map. It renders its bundled SVG geometry without a map provider or network request. Keep the built-in selector unless another accessible control updates the controlled `country` prop.

### `SocialRelay`

| Prop        | Type                         | Default            | Guidance                                   |
| ----------- | ---------------------------- | ------------------ | ------------------------------------------ |
| `items`     | `readonly SocialRelayItem[]` | Motus destinations | Supply no more than four destination links |
| `className` | `string`                     | `''`               | Extend the outer navigation layout         |

Each item requires `id`, `label`, and `href`. Use `meta` for a short destination type, `accent` for a CSS hex color, `icon` for a React node, and `target` when a link should stay in the current tab. Preserve recognizable link labels and do not replace the visible focus treatment.

### `LiquidGlassCard`

`LiquidGlassCard` accepts `children`, `className`, `draggable`, `borderRadius`, `blurIntensity`, `glowIntensity`, and `shadowIntensity`. Use it over visible imagery or color so the refraction and blur have something to affect.

### Preset portfolio pieces

`PortfolioNav`, `ExpandableTab`, `AtlasReveal`, `SocialRelay`, `ProjectCard`, `ProjectList`, `SkillsList`, `ContactCard`, `TechStack`, and `RouteLens` are complete interactive presets with no required props. `ExpandableTab` renders a responsive accordion gallery with expanding tab panels. `AtlasReveal` and `SocialRelay` expose configuration props. The other presets keep their current content built in. Use them directly only when that preset matches the requested result; do not promise content props that the package does not expose.

### Background effects

`SilkBackground`, `HalftoneBackground`, and `LightBackground` are interactive canvas effects. Mount them inside a container with an explicit width and height, then position foreground content in a higher layer.

```tsx
import { SilkBackground } from 'motus-ui';

export function HeroBackdrop() {
  return (
    <section style={{ position: 'relative', minHeight: 480 }}>
      <SilkBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>Hero content</div>
    </section>
  );
}
```

## Agent implementation checklist

1. Confirm the project uses React 18.2 or React 19.
2. Install `motus-ui` if it is missing.
3. Import `motus-ui/styles.css` exactly once near the application root.
4. Render hook-based Motus components within a client boundary when the framework distinguishes server and client components.
5. Select the smallest public component that satisfies the request.
6. Pass real URLs, filenames, labels, and callbacks instead of leaving demo defaults in production work.
7. Preserve keyboard focus, disabled states, and reduced-motion behavior.
8. Verify the result at desktop and mobile widths and exercise the actual copy, download, or audio interaction.

## Troubleshooting

**The component renders without its design**

- Confirm `import 'motus-ui/styles.css';` runs once.
- Do not add Motus to the consumer's Tailwind content scan as a substitute for the stylesheet.
- Check whether a later global reset overrides button, canvas, or typography styles.

**A Next.js build reports a hook or browser boundary error**

- Move the Motus usage into a file with `'use client';` and render that component from the server layout or page.

**Copying fails**

- Clipboard access normally requires HTTPS or localhost and a user gesture.
- Pass `onCopy` when the environment does not expose `navigator.clipboard`.

**The download does not start immediately**

- This is intentional: the transfer animation completes first.
- Verify `href` points to a reachable file, or pass `onDownload` for a custom flow.

**Click sound does not play**

- Browsers can block audio until a user gesture initializes audio playback.
- Do not trigger `ClickKey` programmatically and expect sound before interaction.

**A background is invisible or collapsed**

- Give its parent a measurable height and width.
- Check that foreground layers are not covering it with an opaque background.

**Animation is reduced or absent**

- Check the operating system and browser `prefers-reduced-motion` setting before treating this as a defect.

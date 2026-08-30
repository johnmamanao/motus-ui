# Motus UI

[![npm version](https://img.shields.io/npm/v/motus-ui?label=npm&color=cb3837)](https://www.npmjs.com/package/motus-ui)
[![website](https://img.shields.io/badge/website-live-111111)](https://motus-ui.johnmamanao.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-67b718)](./LICENSE)

Motion-focused React components for portfolios and creative interfaces. Motus includes animated text, tactile actions, navigation, project displays, and ambient visual effects.

Built with React, TypeScript, Tailwind CSS, GSAP, Motion, and Lottie. The published package is ESM-only and includes TypeScript declarations.

Explore every component in the [live Motus UI showcase](https://motus-ui.johnmamanao.com).

## Install

```bash
npm install motus-ui
```

Import the stylesheet once in your application entry file:

```tsx
import 'motus-ui/styles.css';
```

Motus supports React 18.2 and React 19.

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

## AI skill

Install the Motus UI skill so a compatible coding agent can select components, wire their APIs, and troubleshoot integration details:

```bash
npx skills add https://github.com/johnmamanao/motus-ui --skill motus-ui
```

## Usage

### Text motion

Animate one line of text with any of the included motion styles.

```tsx
import { TextMotion } from 'motus-ui';

export function Heading() {
  return <TextMotion text="Creative direction" variant="cascade" />;
}
```

Available variants:

`lift`, `hinge`, `drift`, `ripple`, `stretch`, `cascade`, `magnet`, `arc`, `roll`, `echo`, `shutter`, `orbit`, `weight`, `sweep`, `scatter`, `pulse`, `drop`, `fan`, `imprint`, `slipstream`, `relay`, `foldline`, `baseline`, `depthline`, and `ticker`.

The `ticker` variant transitions between `text` and `alternateText`:

```tsx
<TextMotion text="Selected work" alternateText="Creative code" variant="ticker" />
```

### Copy link

Use the browser clipboard automatically or provide your own copy handler.

```tsx
import { CopyLinkButton } from 'motus-ui';

<CopyLinkButton value="https://example.com/project" onCopy={(value) => navigator.clipboard.writeText(value)} />;
```

### Resume download

The download begins after the transfer animation completes. Pass `onDownload` when the file comes from an API or another custom source.

```tsx
import { ResumeDownloadButton } from 'motus-ui';

<ResumeDownloadButton href="/resume.pdf" filename="jane-doe-resume.pdf" fileLabel="PDF · 184 KB" />;
```

### Press button

`ClickKey` is a split-flap project control with an indexed information panel, scanning activation state, and short audio cue.

```tsx
import { ClickKey } from 'motus-ui';

<ClickKey onAction={() => console.log('Open project')} />;
```

Audio starts only after user interaction and may follow the browser's autoplay policy.

### Atlas reveal

Animate a curated country silhouette with a capital label, coordinate readout, and compass rose. Use `country` for a controlled selector or `defaultCountry` for local state.

```tsx
import { AtlasReveal } from 'motus-ui';

<AtlasReveal defaultCountry="philippines" />;
```

Included countries: Japan, Philippines, Italy, Iceland, Chile, India, Australia, and Brazil. The geometry is preprocessed from [Natural Earth public-domain data](https://www.naturalearthdata.com/about/terms-of-use/), so the component makes no runtime map request.

### Social relay

Render a compact cluster of four circular glass links. The defaults connect to the Motus repository, npm package, showcase, and issue tracker; pass `items` to replace them.

```tsx
import { SocialRelay } from 'motus-ui';

<SocialRelay />;
```

### Portfolio components

Use the larger pieces directly when you need a complete portfolio interaction.

```tsx
import { PortfolioNav, ProjectCard, ProjectList, SkillsList } from 'motus-ui';

export function Portfolio() {
  return (
    <>
      <PortfolioNav />
      <ProjectCard />
      <ProjectList />
      <SkillsList />
    </>
  );
}
```

Additional pieces include `ExpandableTab`, `AtlasReveal`, `ContactCard`, `TechStack`, `LiquidGlassCard`, and `RouteLens`. `ExpandableTab` presents an accessible accordion gallery where the selected tab expands into focus.

### Background effects

```tsx
import { HalftoneBackground, LightBackground, SilkBackground } from 'motus-ui';
```

Place an effect inside a positioned container and layer your content above it.

## API

### `TextMotion`

| Prop            | Type                | Default           | Description                   |
| --------------- | ------------------- | ----------------- | ----------------------------- |
| `text`          | `string`            | `'SELECTED WORK'` | Primary text to display       |
| `alternateText` | `string`            | `'CREATIVE CODE'` | Second value used by `ticker` |
| `variant`       | `TextMotionVariant` | `'lift'`          | Motion style                  |

### `CopyLinkButton`

| Prop       | Type                                       | Default                      | Description                   |
| ---------- | ------------------------------------------ | ---------------------------- | ----------------------------- |
| `value`    | `string`                                   | `'https://example.com/work'` | Value copied to the clipboard |
| `onCopy`   | `(value: string) => void \| Promise<void>` | Browser clipboard            | Custom copy handler           |
| `disabled` | `boolean`                                  | `false`                      | Disables the action           |

### `ResumeDownloadButton`

| Prop         | Type                          | Default          | Description             |
| ------------ | ----------------------------- | ---------------- | ----------------------- |
| `href`       | `string`                      | `'/resume.pdf'`  | File URL                |
| `filename`   | `string`                      | `'resume.pdf'`   | Downloaded filename     |
| `fileLabel`  | `string`                      | `'PDF · résumé'` | Supporting label        |
| `onDownload` | `() => void \| Promise<void>` | Native download  | Custom download handler |
| `disabled`   | `boolean`                     | `false`          | Disables the action     |

### `ClickKey`

| Prop       | Type                          | Default     | Description                     |
| ---------- | ----------------------------- | ----------- | ------------------------------- |
| `onAction` | `() => void \| Promise<void>` | `undefined` | Runs when the button is clicked |
| `disabled` | `boolean`                     | `false`     | Disables the action and sound   |

### `AtlasReveal`

| Prop              | Type                                | Default     | Description                                  |
| ----------------- | ----------------------------------- | ----------- | -------------------------------------------- |
| `country`         | `AtlasCountryId`                    | `undefined` | Controlled country                           |
| `defaultCountry`  | `AtlasCountryId`                    | `'japan'`   | Initial country when uncontrolled            |
| `onCountryChange` | `(country: AtlasCountryId) => void` | `undefined` | Runs after a country is selected             |
| `showSelector`    | `boolean`                           | `true`      | Shows the built-in accessible country picker |
| `className`       | `string`                            | `''`        | Adds classes to the outer map card           |

### `SocialRelay`

| Prop        | Type                         | Default            | Description                               |
| ----------- | ---------------------------- | ------------------ | ----------------------------------------- |
| `items`     | `readonly SocialRelayItem[]` | Motus destinations | Up to four customizable destination links |
| `className` | `string`                     | `''`               | Adds classes to the outer navigation      |

Each item accepts `id`, `label`, `href`, and optional `meta`, `accent`, `icon`, and `target` values.

## Accessibility

Motus components provide keyboard focus states and disabled states where applicable. Motion-based components respect `prefers-reduced-motion`; clipboard, download, and audio behavior still depends on browser permissions.

## Contributing

Development setup and verification commands are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © John Charles Frederick Mamanao. See [LICENSE](./LICENSE).

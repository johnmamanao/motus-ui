# Motus UI

[![npm version](https://img.shields.io/npm/v/motus-ui?label=npm&color=cb3837)](https://www.npmjs.com/package/motus-ui)
[![website](https://img.shields.io/badge/website-live-111111)](https://motus-ui.johnmamanao.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-67b718)](./LICENSE)

React components for portfolio websites. Motus includes animated text, buttons, navigation, project displays, and canvas backgrounds.

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

### Text animations

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

### Download button

The download begins after the transfer animation completes. Pass `onDownload` when the file comes from an API or another custom source.

```tsx
import { DownloadButton } from 'motus-ui';

<DownloadButton href="/resume.pdf" filename="jane-doe-resume.pdf" fileLabel="PDF · 184 KB" />;
```

### Project button

`ProjectButton` opens a project with a split-flap transition and a short audio cue.

```tsx
import { ProjectButton } from 'motus-ui';

<ProjectButton onAction={() => console.log('Open project')} />;
```

Audio starts only after user interaction and may follow the browser's autoplay policy.

### Country map

Animate a curated country silhouette with a capital label, coordinate readout, and compass rose. Use `country` for a controlled selector or `defaultCountry` for local state.

```tsx
import { CountryMap } from 'motus-ui';

<CountryMap defaultCountry="philippines" />;
```

Included countries: Japan, Philippines, Italy, Iceland, Chile, India, Australia, and Brazil. The geometry is preprocessed from [Natural Earth public-domain data](https://www.naturalearthdata.com/about/terms-of-use/), so the component makes no runtime map request.

### Social links

Render a compact cluster of four circular glass links. The defaults connect to the Motus repository, npm package, showcase, and issue tracker; pass `items` to replace them.

```tsx
import { SocialLinks } from 'motus-ui';

<SocialLinks />;
```

### Portfolio components

Use the larger pieces directly when you need a complete portfolio interaction.

```tsx
import { NavigationBar, ProjectDetails, ProjectList, SkillsList } from 'motus-ui';

export function Portfolio() {
  return (
    <>
      <NavigationBar />
      <ProjectDetails />
      <ProjectList />
      <SkillsList />
    </>
  );
}
```

Additional pieces include `ExpandableTabs`, `CountryMap`, `ContactPanel`, and `TechStack`. The earlier export names remain available as compatibility aliases.

### Background effects

```tsx
import { FlowBackground, HalftoneBackground, LightTrails } from 'motus-ui';
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

### `DownloadButton`

| Prop         | Type                          | Default          | Description             |
| ------------ | ----------------------------- | ---------------- | ----------------------- |
| `href`       | `string`                      | `'/resume.pdf'`  | File URL                |
| `filename`   | `string`                      | `'resume.pdf'`   | Downloaded filename     |
| `fileLabel`  | `string`                      | `'PDF · résumé'` | Supporting label        |
| `onDownload` | `() => void \| Promise<void>` | Native download  | Custom download handler |
| `disabled`   | `boolean`                     | `false`          | Disables the action     |

### `ProjectButton`

| Prop       | Type                          | Default     | Description                     |
| ---------- | ----------------------------- | ----------- | ------------------------------- |
| `onAction` | `() => void \| Promise<void>` | `undefined` | Runs when the button is clicked |
| `disabled` | `boolean`                     | `false`     | Disables the action and sound   |

### `CountryMap`

| Prop              | Type                                | Default     | Description                                  |
| ----------------- | ----------------------------------- | ----------- | -------------------------------------------- |
| `country`         | `AtlasCountryId`                    | `undefined` | Controlled country                           |
| `defaultCountry`  | `AtlasCountryId`                    | `'japan'`   | Initial country when uncontrolled            |
| `onCountryChange` | `(country: AtlasCountryId) => void` | `undefined` | Runs after a country is selected             |
| `showSelector`    | `boolean`                           | `true`      | Shows the built-in accessible country picker |
| `className`       | `string`                            | `''`        | Adds classes to the outer map card           |

### `SocialLinks`

| Prop        | Type                        | Default            | Description                               |
| ----------- | --------------------------- | ------------------ | ----------------------------------------- |
| `items`     | `readonly SocialLinkItem[]` | Motus destinations | Up to four customizable destination links |
| `className` | `string`                    | `''`               | Adds classes to the outer navigation      |

Each item accepts `id`, `label`, `href`, and optional `meta`, `accent`, `icon`, and `target` values.

## Accessibility

Motus components provide keyboard focus states and disabled states where applicable. Motion-based components respect `prefers-reduced-motion`; clipboard, download, and audio behavior still depends on browser permissions.

## Contributing

Development setup and verification commands are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © John Charles Frederick Mamanao. See [LICENSE](./LICENSE).

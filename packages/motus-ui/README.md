# Motus UI

[![npm version](https://img.shields.io/npm/v/motus-ui?label=npm&color=cb3837)](https://www.npmjs.com/package/motus-ui)
[![website](https://img.shields.io/badge/website-live-111111)](https://motus-ui.johnmamanao.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-67b718)](https://github.com/johnmamanao/motus-ui/blob/main/LICENSE)

React components for portfolio websites. Motus includes animated text, buttons, navigation, project displays, and canvas backgrounds.

Built with React, TypeScript, Tailwind CSS, GSAP, Motion, and Lottie. The package is ESM-only and includes TypeScript declarations.

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

```tsx
import { TextMotion } from 'motus-ui';

<TextMotion text="Creative direction" variant="cascade" />;
```

Available variants:

`lift`, `hinge`, `drift`, `ripple`, `stretch`, `cascade`, `magnet`, `arc`, `roll`, `echo`, `shutter`, `orbit`, `weight`, `sweep`, `scatter`, `pulse`, `drop`, `fan`, `imprint`, `slipstream`, `relay`, `foldline`, `baseline`, `depthline`, and `ticker`.

The `ticker` variant transitions between two values:

```tsx
<TextMotion text="Selected work" alternateText="Creative code" variant="ticker" />
```

### Copy link

```tsx
import { CopyLinkButton } from 'motus-ui';

<CopyLinkButton value="https://example.com/project" />;
```

Pass `onCopy` to replace the built-in browser clipboard behavior.

### Download button

The download begins after the transfer animation completes.

```tsx
import { DownloadButton } from 'motus-ui';

<DownloadButton href="/resume.pdf" filename="jane-doe-resume.pdf" fileLabel="PDF · 184 KB" />;
```

Pass `onDownload` when the file comes from an API or another custom source.

### Project button

```tsx
import { ProjectButton } from 'motus-ui';

<ProjectButton onAction={() => console.log('Open project')} />;
```

`ProjectButton` uses a split-flap transition and a short audio cue to confirm activation. Audio begins only after user interaction.

### Country map

```tsx
import { CountryMap } from 'motus-ui';

<CountryMap defaultCountry="philippines" />;
```

`CountryMap` includes Japan, Philippines, Italy, Iceland, Chile, India, Australia, and Brazil. It accepts controlled and uncontrolled country selection, labels each capital, and respects reduced-motion preferences. Its bundled geometry is preprocessed from [Natural Earth public-domain data](https://www.naturalearthdata.com/about/terms-of-use/); no map service or runtime request is required.

### Social links

```tsx
import { SocialLinks } from 'motus-ui';

<SocialLinks />;
```

`SocialLinks` renders GitHub as a primary circular action with Facebook, Instagram, and X in a compact side rail. It includes accessible labels, focus feedback, and reduced-motion behavior. Pass `items` to use your own profile URLs.

### Portfolio components

```tsx
import {
  ContactPanel,
  CountryMap,
  ExpandableTabs,
  NavigationBar,
  ProjectDetails,
  ProjectList,
  SkillsList,
  TechStack,
} from 'motus-ui';
```

These pieces can be rendered directly without required props. The earlier export names remain available as compatibility aliases.

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

| Prop        | Type                        | Default         | Description                               |
| ----------- | --------------------------- | --------------- | ----------------------------------------- |
| `items`     | `readonly SocialLinkItem[]` | Social profiles | Up to four customizable destination links |
| `className` | `string`                    | `''`            | Adds classes to the outer navigation      |

`SocialLinkItem` requires `id`, `label`, and `href`, and accepts optional `meta`, `accent`, `icon`, and `target` fields.

## Accessibility

Motus provides keyboard focus and disabled states where applicable. Motion-based components respect `prefers-reduced-motion`; clipboard, download, and audio behavior still depends on browser permissions.

## Links

- [Source and component showcase](https://github.com/johnmamanao/motus-ui)
- [Report an issue](https://github.com/johnmamanao/motus-ui/issues)
- [Contributing guide](https://github.com/johnmamanao/motus-ui/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/johnmamanao/motus-ui/blob/main/CHANGELOG.md)

## License

MIT © John Charles Frederick Mamanao. See the [license](https://github.com/johnmamanao/motus-ui/blob/main/LICENSE).

# Motus UI

[![npm version](https://img.shields.io/npm/v/motus-ui?label=npm&color=cb3837)](https://www.npmjs.com/package/motus-ui)
[![license: MIT](https://img.shields.io/badge/license-MIT-67b718)](./LICENSE)

Motion-focused React components for portfolios and creative interfaces. Motus includes animated text, tactile actions, navigation, project displays, and ambient visual effects.

Built with React, TypeScript, Tailwind CSS, GSAP, Motion, and Lottie. The published package is ESM-only and includes TypeScript declarations.

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

`lift`, `hinge`, `drift`, `ripple`, `stretch`, `cascade`, `magnet`, `arc`, `roll`, `echo`, `shutter`, `orbit`, `weight`, `sweep`, `scatter`, `pulse`, `drop`, `fan`, and `ticker`.

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

`ClickKey` provides a tactile press-and-release interaction with sound.

```tsx
import { ClickKey } from 'motus-ui';

<ClickKey onAction={() => console.log('Open project')} />;
```

Audio starts only after user interaction and may follow the browser's autoplay policy.

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

Additional pieces include `ExpandableTab`, `ContactCard`, `TechStack`, `LiquidGlassCard`, and `RouteLens`.

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

## Accessibility

Motus components provide keyboard focus states and disabled states where applicable. Motion-based components respect `prefers-reduced-motion`; clipboard, download, and audio behavior still depends on browser permissions.

## Development

```bash
git clone https://github.com/johnmamanao/motus-ui.git
cd motus-ui
npm install
npm run dev
```

The local showcase runs at [http://localhost:4174](http://localhost:4174).

Before opening a pull request, run:

```bash
npm run check
npm run format:check
npm run build
npm run verify:package
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Release

See [DEPLOY.md](./DEPLOY.md) for the npm publishing checklist.

## License

MIT © John Charles Frederick Mamanao. See [LICENSE](./LICENSE).

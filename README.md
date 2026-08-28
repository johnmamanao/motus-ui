# Motus UI

Motus is an open-source React component library for expressive portfolio interfaces. The repository contains the published library and the live component showcase in one npm workspace.

## Install

```bash
npm install motus-ui
```

Import the library stylesheet once near the root of your application:

```tsx
import 'motus-ui/styles.css';
```

Then import the components you need:

```tsx
import { TextMotion } from 'motus-ui';

export function Hero() {
  return <TextMotion text="Selected work" variant="lift" />;
}
```

Motus supports React 18.2 and React 19 and includes an ESM build with TypeScript declarations.

## Components

- Text Motion
- Portfolio Nav
- Expandable Tabs
- Press Button
- Resume Download
- Copy Link
- Project Card
- Project List
- Skills List
- Contact Card
- Tech Stack
- Silk Background
- Halftone Background
- Light Background

## Repository structure

```text
apps/
└── site/              Vite showcase and component workbench
packages/
└── motus-ui/          Published React library
    ├── src/           Public component source
    └── dist/          Generated package output
scripts/
└── verify-package.mjs Clean-install package smoke test
```

The showcase imports the package source directly, so its live previews and the published implementations stay aligned.

## Development

```bash
npm install
npm run dev
```

The site runs at [http://localhost:4174](http://localhost:4174).

## Verification

```bash
npm run check
npm run format:check
npm run build
npm run verify:package
```

`verify:package` packs Motus, installs the tarball in a temporary consumer project, and verifies its runtime exports and stylesheet.

## Publishing

Publishing is performed from `packages/motus-ui` through the workspace command:

```bash
npm login
npm publish --workspace motus-ui
```

See [Deployment](DEPLOY.md) for the complete release checklist.

## Documentation

- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Deployment](DEPLOY.md)
- [MIT License](LICENSE)

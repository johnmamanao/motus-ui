# Contributing to Motus UI

Thanks for helping improve Motus. Contributions should keep components useful, accessible, responsive, and safe to install from npm.

## Development setup

```bash
git clone https://github.com/johnmamanao/motus-ui.git
cd motus-ui
npm install
npm run dev
```

The local showcase runs at [http://localhost:4174](http://localhost:4174).

## Workspace structure

```text
apps/site/                Showcase and component workbench
packages/motus-ui/src/    Published component source
scripts/                  Release verification
```

Add reusable components to `packages/motus-ui/src` and export their public API from `packages/motus-ui/src/index.ts`. The showcase should import from `motus-ui` rather than maintaining a duplicate implementation.

## Pull requests

1. Create a focused branch from `main`.
2. Preserve keyboard access, reduced-motion behavior, and responsive layouts.
3. Export public prop types when adding or changing component APIs.
4. Update the README and changelog when behavior or installation changes.
5. Run all verification commands.
6. Describe what changed, why it changed, and how it was tested.

## Verification

```bash
npm run check
npm run format:check
npm run build
npm run verify:package
```

For interface changes, also test desktop, tablet, mobile portrait, mobile landscape, keyboard navigation, and `prefers-reduced-motion: reduce`.

## Component expectations

- The preview must use the same source exported by the npm package.
- Motion should communicate state or interaction.
- Controls need visible focus states and accessible labels.
- Components must not require an account, backend, or remote animation asset.
- Public components must be documented and tree-shakeable.

# Contributing to Motus UI

Thanks for helping improve Motus. Contributions should keep components useful, accessible, responsive, and easy to copy into a portfolio project.

## Report a problem

Open a GitHub issue and include:

- The component and route involved
- Browser and viewport size
- Steps to reproduce the behavior
- Expected and actual results
- A screenshot or short recording when the problem is visual

## Development setup

```bash
git clone https://github.com/johnmamanao/motus-ui.git
cd motus-ui
npm install
npm run dev
```

The local site runs at [http://localhost:4174](http://localhost:4174).

## Pull requests

1. Create a branch from `main` using `feat/`, `fix/`, `docs/`, or `chore/`.
2. Keep each pull request focused on one change.
3. Preserve keyboard access, reduced-motion behavior, and responsive layouts.
4. Update source examples and documentation when a public component API changes.
5. Run the verification commands below.
6. Open a pull request describing what changed, why it changed, and how it was tested.

## Verification

```bash
npm run format:check
npm run build
```

For interface changes, also verify:

- 1440px desktop
- 768px tablet
- 375 × 667 mobile portrait
- A short mobile landscape viewport
- Keyboard navigation
- `prefers-reduced-motion: reduce`

## Project structure

```text
src/
├── buttons/       Button components
├── effects/       Canvas-based backgrounds
├── motion/        Text Motion and its variants
├── App.tsx        Site routes and component workspace
├── PortfolioPieces.tsx
├── ExpandableTab.tsx
└── styles.css
```

## Design expectations

- A component must make sense without decorative demo content.
- The preview must match the source shown to the user.
- Motion must communicate state or interaction, not merely add activity.
- Controls need visible focus states and accessible labels.
- Avoid hidden dependencies, remote animation assets, and backend requirements.

## Commit messages

Use a short conventional prefix when practical:

```text
feat: add a component
fix: correct mobile overflow
docs: clarify component usage
chore: update tooling
```

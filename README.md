# Motus UI

Motus is an open-source React component library for portfolio interfaces. It focuses on expressive motion, clear interaction feedback, and components that can be previewed, tested, and copied without an account or backend.

## What is included

- Full-size interactive component previews
- Responsive desktop, tablet, and mobile layouts
- Source and usage panels for every component
- Copyable install commands and downloadable source files
- Keyboard navigation, visible focus states, and reduced-motion support
- GSAP, Motion, Lottie, Canvas, and native browser interactions

## Components

| Category | Component | Purpose |
| --- | --- | --- |
| Motion | Text Motion | One-line animated text with nineteen selectable variants |
| Navigation | Portfolio Nav | Compact portfolio navigation with an animated active route |
| Navigation | Expandable Tabs | Application tabs that expand to reveal their selected panel |
| Buttons | Press Button | Tactile primary action with optional click sound |
| Buttons | Resume Download | Animated résumé download that waits for its motion to finish |
| Buttons | Copy Link | Clipboard action with animated confirmation |
| Projects | Project Card | Featured project surface that opens to show details |
| Projects | Project List | Project directory with a responsive visual preview |
| Content | Skills List | Focus-sensitive list for capabilities and skills |
| Contact | Contact Card | Availability and direct-contact actions |
| Code | Tech Stack | Compact technical stack summary for project pages |
| Backgrounds | Silk Background | Pointer-responsive animated fabric light |
| Backgrounds | Halftone Background | Interactive halftone field for sections and hero areas |
| Backgrounds | Light Background | Soft ambient background for text-led layouts |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:4174](http://localhost:4174).

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Routes

- `/` — landing page and featured component showcase
- `/components` — component workspace with the library menu open
- `/components/:id` — direct link to a component preview
- `?view=source` — opens the component source panel
- `?view=usage` — opens the usage guide

## Using a component

Open a component, test its interaction, and choose either **Source code** or **How to use**. The workspace exposes the implementation, import example, and component-specific install command.

```text
npx @motus-ui/cli@latest add text-motion
```

The live preview and source panel use the same implementation, so the behavior shown in the workspace matches the code being copied.

## Technology

- React 19 and TypeScript
- Vite
- Tailwind CSS
- GSAP
- Motion
- Lottie React
- Prism React Renderer
- Lucide React
- Canvas 2D for interactive backgrounds

## Accessibility

Motus includes semantic navigation, labeled controls, keyboard-operable menus, visible focus states, touch-friendly targets, and reduced-motion behavior through `prefers-reduced-motion`.

## Project structure

```text
src/
├── buttons/       Button components
├── effects/       Canvas-based background components
├── motion/        Text motion component and variants
├── App.tsx        Landing page and component workspace
├── PortfolioPieces.tsx
├── ExpandableTab.tsx
└── styles.css
```

All component state runs locally in the browser. Motus does not require a database, account, paid service, or external API.

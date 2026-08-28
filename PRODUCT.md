# Product

## Register

brand

## Product

Motus is an open-source showcase and copy-ready library of fourteen React interactions for portfolios:

- Glass Sidebar
- Portfolio Nav
- Expandable Tabs
- Press Button
- Resume Download
- Copy Link
- Project Card
- Skills List
- Project List
- Contact Card
- Tech Stack
- Silk Background
- Halftone Background
- Light Background

## Users

Frontend developers and design-minded builders evaluating reusable React interactions. They arrive while building a product or browsing for inspiration and need to understand a component's purpose, behavior, and implementation within seconds.

## Product Purpose

Motus makes advanced portfolio interactions easy to discover, evaluate, and copy. Success means a visitor can understand the library, test a working component, switch between components without leaving the preview, and copy the source without creating an account or sending data to a server.

## Core Journey

1. Understand the product promise and see a working component on the landing page (`/`).
2. Open the full-canvas component workspace directly from `/components`; there is no intermediate directory page.
3. Use the collapsible category rail to switch among all fourteen components while the preview stays in place.
4. Reset or fullscreen the live preview, open Source as a split drawer, and copy or download the real component source.
5. Copy the branded per-component install command from the rail without leaving the workspace.

## Brand Personality

Art-directed, precise, tactile, and calm. Motus should feel like an independent developer product with strong visual authorship while keeping every interaction legible, practical, and trustworthy.

## Anti-references

Avoid generic component-documentation dashboards, purple-blue SaaS gradients, identical card grids, decorative glassmorphism, cute illustrations, excessive pills, and interfaces that sacrifice usability for spectacle. Do not clone Atomix UI's specific imagery, branding, or composition.

Glass is a material demonstrated by the components, not the default styling of the documentation shell.

## Design Principles

**Make the component the proof.** A working component, practical CTA, and install command belong in the first viewport. Compact and full-size previews must perform the action their labels promise.

**One physical idea, one clear gesture.** Each component should connect its material response to a recognizable interface job: navigation, project browsing, content switching, contact, developer UI, or visual atmosphere.

**Let motion explain the interface.** Elasticity, resistance, settling, and refraction should communicate focus, selection, drag, and intent. The component must remain understandable when motion is reduced.

**Keep the shell monochrome.** Black, white, and neutral grays organize the opaque product shell. Chroma belongs inside live component previews, visual-effect canvases, and source syntax, where it helps visitors understand material behavior and code structure.

**Copy the real thing.** The source view must correspond to the component in the preview, label the file with its public component slug, and expose the branded `npx @motus-ui/cli@latest add <component-slug>` command without hiding essential setup behind an account or service.

**Keep the scope honest.** Fourteen complete, responsive components are more credible than a large unfinished catalogue.

**Protect the zero-backend promise.** All interaction state stays in the browser and disappears on refresh. Motus requires no account, database, paid service, or external API.

## Accessibility & Inclusion

Target WCAG AA. Preserve visible labels and focus indicators, semantic navigation and status regions, keyboard-operable controls, large touch targets, sufficient contrast, and `prefers-reduced-motion` behavior. Preview controls retain explicit accessible names at every breakpoint. The grouped component rail uses semantic navigation, marks the active component with `aria-current`, closes with Escape, and collapses by default on narrow screens.

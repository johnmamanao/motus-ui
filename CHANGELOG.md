# Changelog

All notable changes to Motus UI are documented here.

The project follows [Semantic Versioning](https://semver.org/).

## 0.1.5 - 2026-08-30

### Added

- Added `AtlasReveal`, an animated artistic country map with eight selectable countries, capital labels, coordinates, and a compass rose.
- Added locally bundled, build-time-processed Natural Earth country geometry with no runtime map dependency.
- Added six original Text Motion variants: `imprint`, `slipstream`, `relay`, `foldline`, `baseline`, and `depthline`.
- Added `SocialRelay`, an original circular glass navigation cluster with configurable links, icons, accents, and accessible focus feedback.

### Changed

- Redesigned Social Links as an asymmetric GitHub anchor with a Facebook, Instagram, and X side rail, and removed decorative status dots.
- Replaced fictional product language with direct component names and action-based descriptions across the website.
- Added plain-name exports such as `ProjectButton`, `CountryMap`, `SocialLinks`, `NavigationBar`, and `ProjectDetails` while preserving the earlier names as compatibility aliases.
- Added shared Motus color, radius, duration, and easing tokens plus an automated consistency check.

### Fixed

- Corrected the Project Details layout at small mobile widths and kept its open state fully readable.
- Restored touch scrolling and component selection in the mobile Browse menu.

## 0.1.4 - 2026-08-30

### Changed

- Rebuilt `ExpandableTab` as an original accessible accordion gallery with expanding tab panels.
- Redesigned `ClickKey` as a split-flap project control with focused visual and audio feedback.
- Replaced the component showcase shell with a full-height studio and responsive inspector.
- Simplified the landing-page calls to action and refined the header and footer hierarchy.

### Fixed

- Removed residual third-party naming and high-risk derivative implementation patterns from current source.

## 0.1.3 - 2026-08-30

### Changed

- Corrected the canonical package and showcase URL to `motus-ui.johnmamanao.com`.

## 0.1.2 - 2026-08-30

### Changed

- Switched the package homepage and README showcase links to the canonical `motion-ui.johnmamanao.com` domain.

## 0.1.1 - 2026-08-30

### Changed

- Added the live Motus UI showcase to the package metadata and npm README.

## 0.1.0 - 2026-08-28

### Added

- Initial public Motus UI repository.
- Fourteen interactive React components across motion, navigation, buttons, projects, content, contact, code, and backgrounds.
- Full-screen component workspace with grouped navigation.
- Source-code and usage panels with copy and download actions.
- Nineteen selectable Text Motion variants.
- Responsive desktop, tablet, portrait-mobile, and landscape-mobile layouts.
- Motus identity, animated icons, favicon, and component feedback using Lottie React.
- Keyboard navigation, visible focus states, touch-friendly controls, and reduced-motion support.
- Installable `motus-ui` package with ESM, TypeScript declarations, and compiled styles.
- npm workspace structure with a package consumer smoke test.

### Changed

- Renamed the project and repository from Formstate UI to Motus UI.
- Reworked the landing page around a focused hero and interactive component showcase.
- Simplified the component sidebar into a quieter grouped index.
- Split the showcase and reusable component library into dedicated workspaces.

### Fixed

- Corrected mobile workspace sizing and clipped preview controls.
- Corrected Contact Card and Project Card transition states.
- Corrected Text Motion ticker clipping and animation cleanup.
- Delayed résumé download until its completion animation finishes.

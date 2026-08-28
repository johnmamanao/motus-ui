# Motus UI

Expressive React components with polished motion and clear interaction feedback.

## Install

```bash
npm install motus-ui
```

Import the stylesheet once:

```tsx
import 'motus-ui/styles.css';
```

Use any exported component:

```tsx
import { CopyLinkButton, TextMotion } from 'motus-ui';

export function Example() {
  return (
    <>
      <TextMotion text="Selected work" variant="ripple" />
      <CopyLinkButton value="https://example.com/project" />
    </>
  );
}
```

## Exports

`ClickKey`, `CopyLinkButton`, `ResumeDownloadButton`, `TextMotion`, `ExpandableTab`, `PortfolioNav`, `ProjectCard`, `ProjectList`, `SkillsList`, `ContactCard`, `TechStack`, `SilkBackground`, `HalftoneBackground`, `LightBackground`, `LiquidGlassCard`, and `RouteLens`.

Motus supports React 18.2 and React 19. ESM and TypeScript declarations are included.

Source, previews, and contribution instructions are available in the [Motus UI repository](https://github.com/johnmamanao/motus-ui).

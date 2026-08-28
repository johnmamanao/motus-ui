# Releasing Motus UI

Motus has two release targets: the public npm package in `packages/motus-ui` and the static showcase in `apps/site`.

## Verify a release

Run the complete verification suite from the repository root:

```bash
npm ci
npm run check
npm run format:check
npm run build
npm run verify:package
npm audit --omit=dev
```

The package build is written to `packages/motus-ui/dist`. The site build is written to `apps/site/dist`.

## Publish to npm

1. Confirm the version in `packages/motus-ui/package.json` and update `CHANGELOG.md`.
2. Authenticate with an npm account that has publishing 2FA enabled:

   ```bash
   npm login
   npm whoami
   ```

3. Review the exact package contents:

   ```bash
   npm pack --workspace motus-ui --dry-run
   ```

4. Publish the public package:

   ```bash
   npm publish --workspace motus-ui
   ```

5. Verify the registry release:

   ```bash
   npm view motus-ui version
   ```

Never publish from the workspace root. The root and showcase packages are intentionally private.

## Deploy the showcase

The root `vercel.json` builds the Vite showcase and serves `apps/site/dist`. Direct component routes are rewritten to `index.html`.

For another static host, use:

- Build command: `npm run build:site`
- Output directory: `apps/site/dist`
- SPA fallback: rewrite unknown routes to `/index.html`

## Tag the release

After npm and the showcase are verified:

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "Motus UI 0.1.0" --generate-notes
```

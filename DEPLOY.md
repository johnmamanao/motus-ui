# Deploying Motus UI

Motus is a client-side Vite application. It can be deployed to any static host that supports a single-page-application fallback.

## Verify the release

```bash
npm install
npm run format:check
npm run build
```

The deployable output is written to `dist/`.

## Vercel

1. Import `johnmamanao/motus-ui` into Vercel.
2. Select the **Vite** framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

The included `vercel.json` sends direct component routes such as `/components/text-motion` to the application entry point.

## Other static hosts

Use the same build command and output directory. Configure the host to rewrite unknown paths to `/index.html`; without that fallback, direct component URLs may return a 404.

## Release checklist

- [ ] Update `CHANGELOG.md`
- [ ] Run `npm run format:check`
- [ ] Run `npm run build`
- [ ] Test landing and component routes on mobile and desktop
- [ ] Commit and push to `main`
- [ ] Tag the release, for example `v0.1.0`
- [ ] Create matching GitHub release notes

## Version tags

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "Motus UI 0.1.0" --generate-notes
```

Motus is not currently published as an npm package. Its present distribution model is the hosted component workspace with copyable component source.

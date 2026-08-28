import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageDirectory = join(root, 'packages', 'motus-ui');
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'motus-ui-consumer-'));
const consumerDirectory = join(temporaryDirectory, 'consumer');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const commandOptions = (cwd) => ({
  cwd,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});

const quoteWindowsArgument = (value) => (/\s/.test(value) ? `"${value.replaceAll('"', '""')}"` : value);
const run = (args, cwd) => {
  if (process.platform !== 'win32') return execFileSync(npmCommand, args, commandOptions(cwd));
  const command = ['npm', ...args].map(quoteWindowsArgument).join(' ');
  return execFileSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command], commandOptions(cwd));
};

try {
  run(['run', 'build', '--workspace', 'motus-ui'], root);
  const packed = JSON.parse(
    run(['pack', '--ignore-scripts', '--silent', '--json', '--pack-destination', temporaryDirectory], packageDirectory),
  );
  const tarball = join(temporaryDirectory, packed[0].filename);

  mkdirSync(join(consumerDirectory, 'src'), { recursive: true });
  writeFileSync(
    join(consumerDirectory, 'package.json'),
    JSON.stringify(
      {
        name: 'motus-ui-consumer-test',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: { build: 'tsc --noEmit && vite build' },
        dependencies: {
          'motus-ui': `file:${tarball.replaceAll('\\', '/')}`,
          react: '^19.2.4',
          'react-dom': '^19.2.4',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^5.0.0',
          '@types/react': '^19.2.14',
          '@types/react-dom': '^19.2.3',
          typescript: '~5.8.2',
          vite: '^6.4.3',
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(consumerDirectory, 'index.html'),
    '<div id="root"></div><script type="module" src="/src/main.tsx"></script>',
  );
  writeFileSync(
    join(consumerDirectory, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        include: ['src'],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(consumerDirectory, 'vite.config.js'),
    "import react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\nexport default defineConfig({ plugins: [react()] });\n",
  );
  writeFileSync(
    join(consumerDirectory, 'src', 'main.tsx'),
    "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { ClickKey, CopyLinkButton, TextMotion } from 'motus-ui';\nimport 'motus-ui/styles.css';\nconst required = [ClickKey, CopyLinkButton, TextMotion];\nif (required.some((item) => typeof item !== 'function')) throw new Error('A public Motus export is missing.');\ncreateRoot(document.getElementById('root')!).render(<><TextMotion text=\"Motus UI\" /><ClickKey /><CopyLinkButton /></>);\n",
  );

  run(['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerDirectory);
  run(['run', 'build'], consumerDirectory);
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "const motus = await import('motus-ui'); if (typeof motus.TextMotion !== 'function') process.exit(1);",
    ],
    commandOptions(consumerDirectory),
  );

  const packedPackage = JSON.parse(
    readFileSync(join(consumerDirectory, 'node_modules', 'motus-ui', 'package.json'), 'utf8'),
  );
  if (!packedPackage.exports?.['.'] || !packedPackage.exports?.['./styles.css']) {
    throw new Error('The packed package is missing its runtime or stylesheet exports.');
  }

  console.log(`Verified ${packed[0].id}: clean consumer install and Vite build passed.`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}

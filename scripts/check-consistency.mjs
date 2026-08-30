import { readFileSync } from 'node:fs';

const files = [
  'apps/site/src/App.tsx',
  'packages/motus-ui/src/ExpandableTab.tsx',
  'packages/motus-ui/src/maps/AtlasReveal.tsx',
  'packages/motus-ui/src/buttons/ClickKey.tsx',
];

const bannedPhrases = [
  'Connection matrix',
  'Relay idle',
  'Component studio',
  'Interactive preview',
  'Country index',
  'Select territory',
  'Cartography /',
  'Expandable studies',
  'Select a perspective',
  'Project access',
  'M–',
];

const failures = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const phrase of bannedPhrases) {
    if (source.includes(phrase)) failures.push(`${file}: remove "${phrase}"`);
  }
}

const catalog = readFileSync('apps/site/src/App.tsx', 'utf8');
const descriptions = [...catalog.matchAll(/description: '([^']+)'/g)].map((match) => match[1]);
const directOpening = /^(Animate|Choose|Copy|Expand|Move|Open|Preview|Render|Reveal|Switch)\b/;

for (const description of descriptions) {
  if (!directOpening.test(description)) failures.push(`App catalog: use a direct action sentence: "${description}"`);
}

if (descriptions.length !== 16) failures.push(`App catalog: expected 16 descriptions, found ${descriptions.length}`);

if (failures.length) {
  console.error('Consistency check failed:\n' + failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Consistency check passed.');

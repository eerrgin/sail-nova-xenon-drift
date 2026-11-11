import { mkdir, copyFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const out = resolve(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'favicon.svg'];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of files) await copyFile(resolve(root, file), resolve(out, file));
console.log(`Static DJ studio built: ${files.length} files → ${out}`);

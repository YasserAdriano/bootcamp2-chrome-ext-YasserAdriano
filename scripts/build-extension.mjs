import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const dist = 'dist';
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const filesToCopy = ['manifest.json'];
for (const f of filesToCopy) {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join(dist, f));
}

if (fs.existsSync('src')) fs.cpSync('src', path.join(dist, 'src'), { recursive: true });
if (fs.existsSync('icons')) fs.cpSync('icons', path.join(dist, 'icons'), { recursive: true });

const outputPath = path.join(dist, 'extension.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Build gerado em ${dist}/ e ${dist}/extension.zip (${archive.pointer()} bytes)`);
});
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') console.warn(err);
  else throw err;
});
archive.on('error', (err) => { throw err; });

archive.pipe(output);
archive.glob('**/*', { cwd: dist, ignore: ['extension.zip'] });
await archive.finalize();

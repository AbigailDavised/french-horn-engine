import fs from 'node:fs';
import path from 'node:path';

const cjsDir = path.resolve('dist/cjs');
for (const file of fs.readdirSync(cjsDir)) {
  if (file.endsWith('.js')) {
    const full = path.join(cjsDir, file);
    const content = fs.readFileSync(full, 'utf8').replace(/require\("\.\/([^"]+)\.js"\)/g, 'require("./$1.cjs")');
    fs.writeFileSync(full.replace(/\.js$/, '.cjs'), content, 'utf8');
    fs.unlinkSync(full);
  }
}

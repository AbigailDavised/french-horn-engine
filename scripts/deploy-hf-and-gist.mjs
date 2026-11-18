import fs from 'node:fs';

const hfToken = fs.readFileSync('E:/Soft/key/huggingface_token.txt', 'utf8').trim();
const ghDoc = fs.readFileSync('E:/Soft/key/GITHUB_TOKEN.md', 'utf8');
const ghMatches = ghDoc.match(/ghp_[A-Za-z0-9]+/g);
if (!ghMatches || ghMatches.length < 2) throw new Error('Could not locate AbigailDavised GitHub token in GITHUB_TOKEN.md');
const ghToken = ghMatches[1];

const repoId = 'AbigailDavised/french-horn-fingering-transposer';

const createRes = await fetch('https://huggingface.co/api/repos/create', {
  method: 'POST',
  headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'space', name: 'french-horn-fingering-transposer', sdk: 'static', private: false }),
});
console.log('[HF] Create Space:', createRes.status, await createRes.text());

const readmeB64 = Buffer.from(fs.readFileSync('hf-space/README.md', 'utf8'), 'utf8').toString('base64');
const htmlB64 = Buffer.from(fs.readFileSync('hf-space/index.html', 'utf8'), 'utf8').toString('base64');
const ndjson = [
  JSON.stringify({ key: 'header', value: { summary: 'feat: deploy F/Bb French Horn fingering & transposition static space' } }),
  JSON.stringify({ key: 'file', value: { content: readmeB64, path: 'README.md', encoding: 'base64' } }),
  JSON.stringify({ key: 'file', value: { content: htmlB64, path: 'index.html', encoding: 'base64' } }),
].join('\n');

const commitRes = await fetch(`https://huggingface.co/api/spaces/${repoId}/commit/main`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${hfToken}`, 'Content-Type': 'application/x-ndjson' },
  body: ndjson,
});
console.log('[HF] Commit:', commitRes.status, await commitRes.text());

const fingCsv = fs.readFileSync('dataset/french_horn_double_fingerings.csv', 'utf8');
const crookCsv = fs.readFileSync('dataset/classical_horn_crooks_transposition.csv', 'utf8');

const gistRes = await fetch('https://api.github.com/gists', {
  method: 'POST',
  headers: {
    Authorization: `token ${ghToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'french-horn-engine-setup',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    description: 'F/Bb Double French Horn Chromatic Fingerings, Stopped-Horn Chart & Classical Crook Transposition Table — HornLib.com',
    public: true,
    files: {
      'french_horn_double_fingerings.csv': { content: fingCsv },
      'classical_horn_crooks_transposition.csv': { content: crookCsv },
      'README.md': {
        content: [
          '# F/Bb Double French Horn Acoustics & Fingering Reference',
          '',
          '- Interactive Fingering Chart: https://hornlib.com/fingerings',
          '- Harmonic Overtone Series Lab: https://hornlib.com/tools/harmonics',
          '- Classical Crook Transposer: https://hornlib.com/tools/transposition',
          '- Orchestral Audition Excerpts: https://hornlib.com/repertoire-excerpts',
          '- Chromatic Horn Tuner: https://hornlib.com/tools/tuner',
          '- Zero-Dependency npm Engine: https://www.npmjs.com/package/french-horn-engine',
        ].join('\n'),
      },
    },
  }),
});
const gistJson = await gistRes.json();
console.log('[Gist] Created:', gistRes.status, gistJson.html_url);
fs.writeFileSync('.gist-url.txt', gistJson.html_url || '', 'utf8');

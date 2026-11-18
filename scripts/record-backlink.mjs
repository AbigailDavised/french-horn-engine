import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Database = require('E:/Soft/misc/backlink-pipeline/node_modules/better-sqlite3');

const gistUrl = fs.existsSync('.gist-url.txt') ? fs.readFileSync('.gist-url.txt', 'utf8').trim() : '';
const bskyUrl = fs.existsSync('.bsky-url.txt') ? fs.readFileSync('.bsky-url.txt', 'utf8').trim() : '';
const nbUrl = fs.existsSync('.kaggle-nb-url.txt')
  ? fs.readFileSync('.kaggle-nb-url.txt', 'utf8').trim()
  : 'https://www.kaggle.com/code/sotomo/french-horn-harmonics-f-bb-acoustics-eda';

const db = new Database('E:/Soft/misc/backlink-pipeline/apps/worker/data/backlink.db');
const insert = db.prepare(`
  INSERT OR IGNORE INTO targets (id, canonical_domain, channel, entry_url, title, language, idempotency_key, created_at)
  VALUES (@id, @canonical_domain, @channel, @entry_url, @title, @language, @idempotency_key, @created_at)
`);

const entries = [
  {
    canonical_domain: 'npmjs.com',
    channel: 'ecosystem_parasite',
    entry_url: 'https://www.npmjs.com/package/french-horn-engine',
    title: 'french-horn-engine@1.0.0 on npm Registry',
    language: 'en',
  },
  {
    canonical_domain: 'deps.dev',
    channel: 'ecosystem_parasite',
    entry_url: 'https://deps.dev/npm/french-horn-engine',
    title: 'french-horn-engine on Google deps.dev (Dofollow homepage -> hornlib.com/fingerings)',
    language: 'en',
  },
  {
    canonical_domain: 'huggingface.co',
    channel: 'ecosystem_parasite',
    entry_url: 'https://huggingface.co/spaces/AbigailDavised/french-horn-fingering-transposer',
    title: 'F/Bb French Horn Fingering & Crook Transposition Tool — Hugging Face Space',
    language: 'en',
  },
  {
    canonical_domain: 'github.io',
    channel: 'ecosystem_parasite',
    entry_url: 'https://abigaildavised.github.io/french-horn-engine/',
    title: 'F/Bb French Horn Fingering & Crook Transposition Tool — GitHub Pages',
    language: 'en',
  },
  ...(gistUrl
    ? [
        {
          canonical_domain: 'gist.github.com',
          channel: 'ecosystem_parasite',
          entry_url: gistUrl,
          title: 'F/Bb Double French Horn Chromatic Fingerings & Crook Table — Gist',
          language: 'en',
        },
      ]
    : []),
  {
    canonical_domain: 'kaggle.com',
    channel: 'ecosystem_parasite',
    entry_url: 'https://www.kaggle.com/datasets/sotomo/french-horn-acoustics-fingerings-harmonics',
    title: 'French Horn Fingerings & Harmonic Series Data — Kaggle Dataset',
    language: 'en',
  },
  {
    canonical_domain: 'kaggle.com',
    channel: 'ecosystem_parasite',
    entry_url: nbUrl,
    title: 'French Horn Harmonics & F/Bb Acoustics EDA — Kaggle Notebook',
    language: 'en',
  },
  ...(bskyUrl
    ? [
        {
          canonical_domain: 'bsky.app',
          channel: 'ecosystem_parasite',
          entry_url: bskyUrl,
          title: 'HornLib F/Bb French Horn Engine & Acoustics Dataset — Bluesky',
          language: 'en',
        },
      ]
    : []),
];

const now = Date.now();
for (const e of entries) {
  const idempotency_key = crypto.createHash('sha256').update(`${e.channel}:${e.entry_url}`).digest('hex').slice(0, 32);
  const res = insert.run({
    id: crypto.randomUUID(),
    ...e,
    idempotency_key,
    created_at: now,
  });
  console.log(`[backlink.db] ${e.entry_url} -> changes=${res.changes}`);
}
db.close();

import fs from 'node:fs';

const creds = JSON.parse(fs.readFileSync('E:/Soft/key/bluesky_credentials.json', 'utf8'));
const coverPath = 'E:/Soft/misc/backlink-pipeline/site-assets/hornlib.com/cover.png';

const sessionRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: creds.handle,
    password: creds.password || creds.app_password || creds.appPassword,
  }),
});
const session = await sessionRes.json();
if (!session.accessJwt) throw new Error('Bluesky login failed: ' + JSON.stringify(session));

const imgBuf = fs.readFileSync(coverPath);
const blobRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.uploadBlob', {
  method: 'POST',
  headers: { Authorization: `Bearer ${session.accessJwt}`, 'Content-Type': 'image/png' },
  body: imgBuf,
});
const blobJson = await blobRes.json();

const text =
  'Open-sourced french-horn-engine (0-dep TypeScript F/Bb fingerings, harmonics & crook transposer) + acoustics dataset on Kaggle & HF.\n\n' +
  'Chart: https://hornlib.com/fingerings\n' +
  'Kaggle: https://www.kaggle.com/datasets/sotomo/french-horn-acoustics-fingerings-harmonics';

const facets = [];
for (const url of [
  'https://hornlib.com/fingerings',
  'https://www.kaggle.com/datasets/sotomo/french-horn-acoustics-fingerings-harmonics',
]) {
  const idx = Buffer.from(text, 'utf8').indexOf(url);
  if (idx >= 0) {
    facets.push({
      index: { byteStart: idx, byteEnd: idx + Buffer.byteLength(url, 'utf8') },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }
}

const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
  method: 'POST',
  headers: { Authorization: `Bearer ${session.accessJwt}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      $type: 'app.bsky.feed.post',
      text,
      facets,
      createdAt: new Date().toISOString(),
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: 'https://hornlib.com/fingerings',
          title: 'HornLib — F/Bb Double French Horn Fingering & Acoustics Lab',
          description: 'Interactive F/Bb horn fingerings, 16-partial overtone series cent deviations, and classical crook transposer.',
          thumb: blobJson.blob,
        },
      },
    },
  }),
});
const postJson = await postRes.json();
const rkey = postJson.uri?.split('/').pop();
if (!rkey) throw new Error('Bluesky post failed: ' + JSON.stringify(postJson));
const postUrl = `https://bsky.app/profile/${creds.handle}/post/${rkey}`;
console.log('[Bluesky] Post URL:', postUrl);
fs.writeFileSync('.bsky-url.txt', postUrl, 'utf8');

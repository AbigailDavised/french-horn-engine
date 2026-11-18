import fs from 'node:fs';
import path from 'node:path';

const { username, key } = JSON.parse(fs.readFileSync('E:/Soft/key/kaggle.json', 'utf8'));
const authHeader = 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
const SLUG = 'french-horn-acoustics-fingerings-harmonics';

async function uploadBlob(filePath) {
  const buf = fs.readFileSync(filePath);
  const name = path.basename(filePath);
  const initRes = await fetch('https://www.kaggle.com/api/v1/blobs/upload', {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'DATASET',
      name,
      contentLength: buf.length,
      lastModifiedEpochSeconds: Math.floor(fs.statSync(filePath).mtimeMs / 1000),
    }),
  });
  const initJson = await initRes.json();
  if (!initRes.ok || !initJson.createUrl) {
    throw new Error(`Blob init failed for ${name}: ${initRes.status} ${JSON.stringify(initJson)}`);
  }
  const putRes = await fetch(initJson.createUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(buf.length) },
    body: buf,
  });
  if (!putRes.ok) throw new Error(`Blob PUT failed for ${name}: ${putRes.status}`);
  return initJson.token;
}

const files = [
  'dataset/french_horn_double_fingerings.csv',
  'dataset/french_horn_harmonic_series_16.csv',
  'dataset/classical_horn_crooks_transposition.csv',
];

const tokens = [];
for (const f of files) {
  const token = await uploadBlob(f);
  tokens.push({ token });
  console.log('[Kaggle] Uploaded:', path.basename(f));
}

const description = [
  'Musical Acoustics & Brass Pedagogy Reference Dataset for the **F/Bb Double French Horn**, containing chromatic written-to-concert pitch frequencies, F-side vs. Bb-trigger valve combinations, stopped-horn (`gestopft`) compensation fingerings, 16-partial natural harmonic series cent deviations, and classical orchestral crook transposition intervals.',
  '',
  '### Included Files',
  '- `french_horn_double_fingerings.csv`: Chromatic F/Bb double horn note catalog with Hz frequencies, MIDI numbers, preferred orchestral side, and stopped-horn valve shifts.',
  '- `french_horn_harmonic_series_16.csv`: Natural overtone partials 1 through 16 with frequency ratios and equal-temperament cent deviations.',
  '- `classical_horn_crooks_transposition.csv`: Semitone offsets and clef shortcuts for historical orchestral crooks (Horn in Eb, D, C-basso, E, G, A, Bb).',
  '',
  '### Companion Tools & Open-Source Engine',
  '- Interactive 3D Fingering Chart: https://hornlib.com/fingerings',
  '- Harmonic Series Intonation Lab: https://hornlib.com/tools/harmonics',
  '- Orchestral Crook Transposer: https://hornlib.com/tools/transposition',
  '- Zero-Dependency npm Engine (`french-horn-engine`): https://www.npmjs.com/package/french-horn-engine',
  '- Hugging Face Static Space: https://huggingface.co/spaces/AbigailDavised/french-horn-fingering-transposer',
].join('\n');

const subtitle = 'F/Bb French Horn chromatic fingerings, 16 overtone partials & crook rules.';

const createRes = await fetch('https://www.kaggle.com/api/v1/datasets/create/new', {
  method: 'POST',
  headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'French Horn Fingerings & Harmonic Series Data',
    slug: SLUG,
    ownerSlug: username,
    subtitle,
    description,
    isPrivate: false,
    licenses: [{ name: 'CC0-1.0' }],
    keywords: ['music', 'education', 'physics', 'tabular'],
    files: tokens,
  }),
});
console.log('[Kaggle] Create dataset:', createRes.status, await createRes.text());

await new Promise((r) => setTimeout(r, 5000));

const fileSpecs = {
  'french_horn_double_fingerings.csv': {
    description: 'Chromatic note-by-note F/Bb double French horn fingerings, concert frequencies, MIDI numbers, and stopped-horn valve compensations.',
    columns: {
      note_id: 'Canonical lowercase pitch identifier.',
      written_note_in_f: 'Written pitch in modern Horn in F notation.',
      concert_pitch: 'Actual sounding concert pitch (perfect fifth lower).',
      frequency_hz: 'Sounding fundamental frequency in Hertz (A4 = 440 Hz).',
      midi_note: 'Concert pitch MIDI note number.',
      register: 'Playing register classification (low, mid, high, altissimo).',
      f_side_valves: 'Standard valve combination on the F horn side.',
      bb_trigger_valves: 'Standard valve combination on the Bb thumb-trigger side.',
      preferred_side: 'Recommended horn side in standard orchestral practice.',
      stopped_f_valves: 'Compensated F-horn valve fingering for hand-stopped (gestopft) notes.',
      harmonic_order_f: 'Active overtone partial index on the F horn.',
      harmonic_order_bb: 'Active overtone partial index on the Bb horn.',
    },
  },
  'french_horn_harmonic_series_16.csv': {
    description: 'Partials 1 through 16 of the natural harmonic overtone series with equal-temperament cent deviations.',
    columns: {
      partial_order: 'Harmonic overtone partial number (1 to 16).',
      written_open_f_horn: 'Written pitch produced on the open F horn.',
      written_open_bb_horn: 'Written pitch produced on the open Bb horn.',
      frequency_ratio: 'Integer harmonic multiple of fundamental frequency.',
      equal_temperament_cents_deviation: 'Pitch deviation in cents relative to 12-tone equal temperament.',
      intonation_tendency: 'Categorical intonation tendency label.',
      acoustic_notes: 'Pedagogical and acoustic performance guidance.',
    },
  },
  'classical_horn_crooks_transposition.csv': {
    description: 'Historical natural horn crook transposition intervals, clef reading methods, and canonical orchestral repertoire.',
    columns: {
      crook_id: 'Canonical crook identifier.',
      crook_name: 'Historical orchestral crook designation.',
      semitone_offset_to_f_horn: 'Semitone transposition offset relative to modern Horn in F.',
      interval_rule: 'Interval transposition rule for sight-transposing.',
      clef_reading_method: 'Traditional clef substitution mental shortcut.',
      canonical_repertoire: 'Representative symphonic and chamber works using this crook.',
    },
  },
};

const metaGetRes = await fetch(`https://www.kaggle.com/api/v1/datasets/metadata/${username}/${SLUG}`, {
  headers: { Authorization: authHeader },
});
const metaGet = await metaGetRes.json();
const info = metaGet.info || {};
const updatedData = (info.data || []).map((f) => {
  const s = fileSpecs[f.name];
  if (!s) return f;
  return {
    ...f,
    description: s.description,
    columns: (f.columns || []).map((c) => ({
      ...c,
      description: (s.columns && s.columns[c.name]) || c.description || '',
    })),
  };
});

const metaPostRes = await fetch(`https://www.kaggle.com/api/v1/datasets/metadata/${username}/${SLUG}`, {
  method: 'POST',
  headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...info,
    subtitle,
    isPrivate: false,
    expectedUpdateFrequency: 'quarterly',
    userSpecifiedSources:
      'Brass acoustics harmonic series physics, 12-TET frequency standards, and conservatory F/Bb double horn pedagogy compiled by HornLib.com.',
    data: updatedData,
  }),
});
console.log('[Kaggle] Metadata update:', metaPostRes.status, await metaPostRes.text());

const notebook = {
  nbformat: 4,
  nbformat_minor: 5,
  metadata: {
    kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
    language_info: { name: 'python', version: '3.10.12' },
  },
  cells: [
    {
      cell_type: 'markdown',
      metadata: {},
      source: [
        '# French Horn Acoustics: Overtone Cent Deviations & F/Bb Register Analysis\n\n',
        'Acoustic analysis of the **16-partial natural harmonic series** and **chromatic F/Bb double horn fingerings**.\n\n',
        '- Interactive 3D Fingering Chart: [HornLib.com](https://hornlib.com/fingerings)\n',
        '- Harmonic Series Intonation Lab: [hornlib.com/tools/harmonics](https://hornlib.com/tools/harmonics)\n',
        '- Zero-Dependency npm Engine (`french-horn-engine`): [deps.dev](https://deps.dev/npm/french-horn-engine)\n',
      ],
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        'from pathlib import Path\n',
        'import pandas as pd\n',
        'import matplotlib.pyplot as plt\n\n',
        'BASE = next(Path("/kaggle/input").rglob("french_horn_double_fingerings.csv")).parent\n',
        'notes = pd.read_csv(BASE / "french_horn_double_fingerings.csv")\n',
        'harms = pd.read_csv(BASE / "french_horn_harmonic_series_16.csv")\n',
        'crooks = pd.read_csv(BASE / "classical_horn_crooks_transposition.csv")\n',
        'print(f"Loaded {len(notes)} chromatic notes, {len(harms)} partials, {len(crooks)} crooks.")\n',
        'display(harms[["partial_order", "written_open_f_horn", "equal_temperament_cents_deviation", "intonation_tendency"]])\n',
      ],
    },
    {
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        'fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n',
        'colors = ["#dc2626" if abs(c) >= 14 else "#0f4c81" for c in harms["equal_temperament_cents_deviation"]]\n',
        'axes[0].bar(harms["partial_order"].astype(str), harms["equal_temperament_cents_deviation"], color=colors)\n',
        'axes[0].axhline(0, color="#64748b", linestyle="--")\n',
        'axes[0].set_title("Natural Harmonic Partials (1–16) Deviation vs. 12-TET (Cents)")\n',
        'axes[0].set_xlabel("Harmonic Partial Order")\n',
        'axes[0].set_ylabel("Cents Deviation")\n\n',
        'pd.crosstab(notes["register"], notes["preferred_side"]).plot(kind="bar", ax=axes[1], color=["#b45309", "#1d4ed8"])\n',
        'axes[1].set_title("Preferred Horn Side (F vs. Bb) Across Playing Registers")\n',
        'axes[1].set_ylabel("Note Count")\n',
        'axes[1].tick_params(axis="x", rotation=15)\n\n',
        'plt.tight_layout()\n',
        'plt.show()\n',
      ],
    },
  ],
};

const pushRes = await fetch('https://www.kaggle.com/api/v1/kernels/push', {
  method: 'POST',
  headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: `${username}/french-horn-harmonics-acoustics-eda`,
    newTitle: 'French Horn Harmonics & F/Bb Acoustics EDA',
    text: JSON.stringify(notebook),
    language: 'python',
    kernelType: 'notebook',
    isPrivate: false,
    enableGpu: false,
    enableTpu: false,
    enableInternet: false,
    datasetDataSources: [`${username}/${SLUG}`],
    competitionDataSources: [],
    kernelDataSources: [],
  }),
});
const pushJson = await pushRes.json();
console.log('[Kaggle] Kernel push:', pushRes.status, JSON.stringify(pushJson));
if (pushJson.url) fs.writeFileSync('.kaggle-nb-url.txt', pushJson.url, 'utf8');

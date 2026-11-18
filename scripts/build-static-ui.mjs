import fs from 'node:fs';
import { HORN_NOTES_CATALOG, NATURAL_HARMONIC_SERIES, CROOK_OPTIONS } from '../dist/esm/index.js';

const notesLite = HORN_NOTES_CATALOG.map((n) => ({
  id: n.id,
  w: n.writtenName,
  c: n.concertName,
  hz: n.frequency,
  midi: n.midiNote,
  reg: n.register,
  fv: n.fingering.fValves,
  bbv: n.fingering.bbValves,
  pref: n.fingering.preferred,
  stop: n.fingering.stoppedFValves,
  desc: n.description?.en || '',
}));

const crooksLite = CROOK_OPTIONS.map((c) => ({
  id: c.id,
  name: c.nameEn,
  off: c.semitoneOffset,
  rule: c.intervalRuleEn,
  clef: c.clefMethodEn,
  rep: c.famousPiecesEn.join(', '),
}));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>F/Bb Double French Horn Fingering &amp; Transposition Tool — french-horn-engine</title>
  <style>
    :root { --bg:#fdfbf7; --card:#ffffff; --text:#1c1917; --muted:#57534e; --accent:#92400e; --border:#e7e5e4; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; background:var(--bg); color:var(--text); line-height:1.5; }
    .wrap { max-width:980px; margin:0 auto; padding:24px 16px 48px; }
    header { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-end; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:14px; }
    h1 { font-size:1.45rem; margin:0; }
    .sub { color:var(--muted); font-size:0.9rem; margin:4px 0 0; }
    .links { display:flex; gap:12px; flex-wrap:wrap; font-size:0.85rem; }
    .links a { color:var(--accent); text-decoration:none; font-weight:600; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:16px; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:16px; }
    .card h2 { font-size:1.05rem; margin:0 0 12px; }
    label { display:block; font-size:0.82rem; font-weight:600; color:var(--muted); margin:10px 0 4px; }
    select, input { width:100%; padding:8px 10px; border:1px solid #d6d3d1; border-radius:6px; font-size:0.95rem; background:#fff; }
    .kpis { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; }
    .kpi { background:#f5f5f4; border-radius:8px; padding:10px; }
    .kpi .lbl { font-size:0.75rem; color:var(--muted); }
    .kpi .val { font-size:1.08rem; font-weight:700; margin-top:2px; font-variant-numeric:tabular-nums; }
    table { width:100%; border-collapse:collapse; font-size:0.82rem; margin-top:8px; }
    th, td { border-bottom:1px solid var(--border); padding:6px 8px; text-align:left; }
    footer { margin-top:24px; padding-top:14px; border-top:1px solid var(--border); font-size:0.8rem; color:var(--muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
    footer a { color:var(--accent); text-decoration:none; font-weight:600; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <h1>F/Bb Double French Horn Fingering &amp; Crook Transposition</h1>
        <p class="sub">Client-side chromatic fingering lookup, stopped-horn compensation &amp; orchestral crook transposer.</p>
      </div>
      <div class="links">
        <a href="https://hornlib.com/fingerings" target="_blank" rel="noopener noreferrer">3D Interactive Chart</a>
        <a href="https://hornlib.com/tools/harmonics" target="_blank" rel="noopener noreferrer">Harmonics Lab</a>
        <a href="https://hornlib.com/repertoire-excerpts" target="_blank" rel="noopener noreferrer">Audition Excerpts</a>
        <a href="https://www.npmjs.com/package/french-horn-engine" target="_blank" rel="noopener noreferrer">npm Package</a>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h2>1. F/Bb Double Horn Chromatic Fingering</h2>
        <label for="noteSel">Written Pitch (Horn in F)</label>
        <select id="noteSel"></select>
        <div class="kpis">
          <div class="kpi"><div class="lbl">Concert Pitch &amp; Hz</div><div class="val" id="nPitch">-</div></div>
          <div class="kpi"><div class="lbl">Preferred Orchestral Side</div><div class="val" id="nPref">-</div></div>
          <div class="kpi"><div class="lbl">F-Side / Bb-Trigger</div><div class="val" id="nValves">-</div></div>
          <div class="kpi"><div class="lbl">Stopped Horn (+) F-Side</div><div class="val" id="nStop">-</div></div>
        </div>
        <p id="nDesc" style="font-size:0.83rem; color:var(--muted); margin:10px 0 0;"></p>
      </div>

      <div class="card">
        <h2>2. Historical Orchestral Crook Transposer</h2>
        <label for="crookSel">Original Score Crook</label>
        <select id="crookSel"></select>
        <label for="srcNote">Written Note in Original Score</label>
        <select id="srcNote">
          <option>C4</option><option>D4</option><option>E♭4</option><option>E4</option><option>F4</option><option selected>G4</option><option>A4</option><option>B♭4</option><option>C5</option><option>D5</option><option>E5</option>
        </select>
        <div class="kpis">
          <div class="kpi"><div class="lbl">Read on Modern Horn in F</div><div class="val" id="tTarget">-</div></div>
          <div class="kpi"><div class="lbl">Semitone Shift</div><div class="val" id="tShift">-</div></div>
        </div>
        <p id="tRule" style="font-size:0.83rem; color:var(--muted); margin:10px 0 0;"></p>
      </div>
    </div>

    <div class="card" style="margin-top:16px; overflow-x:auto;">
      <h2>Natural Harmonic Overtone Series (Partials 1–16 &amp; Equal-Temperament Cents)</h2>
      <table>
        <thead><tr><th>Partial</th><th>Open F Horn</th><th>Open Bb Horn</th><th>Cents vs. 12-TET</th><th>Tendency &amp; Pedagogy Note</th></tr></thead>
        <tbody id="harmBody"></tbody>
      </table>
    </div>

    <footer>
      <span>Open-source acoustics engine by <strong>HornLib.com</strong> (MIT License).</span>
      <span>Need real-time microphone tuner, drone generator, or Strauss/Mahler excerpts? <a href="https://hornlib.com/fingerings" target="_blank" rel="noopener noreferrer">Open HornLib Studio →</a></span>
    </footer>
  </div>

  <script>
    const NOTES = ${JSON.stringify(notesLite)};
    const CROOKS = ${JSON.stringify(crooksLite)};
    const HARMS = ${JSON.stringify(NATURAL_HARMONIC_SERIES)};
    const SCALE = ['C','C#','D','E♭','E','F','F#','G','A♭','A','B♭','B'];

    const nsel = document.getElementById('noteSel');
    NOTES.forEach((n, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = \`\${n.w} (Concert \${n.c} · \${n.hz} Hz · \${n.reg})\`;
      if (n.w === 'C5') opt.selected = true;
      nsel.appendChild(opt);
    });

    const csel = document.getElementById('crookSel');
    CROOKS.forEach((c, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = c.name;
      if (c.id === 'eb') opt.selected = true;
      csel.appendChild(opt);
    });

    document.getElementById('harmBody').innerHTML = HARMS.map(h => \`
      <tr>
        <td><strong>#\${h.order}</strong></td>
        <td>\${h.writtenNameF}</td>
        <td>\${h.writtenNameBb}</td>
        <td>\${h.centsDeviation > 0 ? '+' + h.centsDeviation : h.centsDeviation}¢</td>
        <td>\${h.descriptionEn}</td>
      </tr>
    \`).join('');

    function update() {
      const n = NOTES[Number(nsel.value) || 0];
      document.getElementById('nPitch').textContent = \`\${n.c} (\${n.hz} Hz)\`;
      document.getElementById('nPref').textContent = \`\${n.pref} Horn (\${n.pref==='Bb'?n.bbv:n.fv})\`;
      document.getElementById('nValves').textContent = \`F: \${n.fv}  |  Bb: \${n.bbv}\`;
      document.getElementById('nStop').textContent = \`F-side: \${n.stop}\`;
      document.getElementById('nDesc').textContent = n.desc;

      const cr = CROOKS[Number(csel.value) || 0];
      const sn = document.getElementById('srcNote').value;
      const m = sn.match(/^([A-G][♭#]?)([0-9])$/);
      let idx = SCALE.indexOf(m[1]), oct = +m[2];
      idx += cr.off;
      while (idx < 0) { idx += 12; oct--; }
      while (idx >= 12) { idx -= 12; oct++; }
      document.getElementById('tTarget').textContent = SCALE[idx] + oct;
      document.getElementById('tShift').textContent = (cr.off > 0 ? '+' : '') + cr.off + ' semitones';
      document.getElementById('tRule').textContent = cr.rule + ' — Famous works: ' + cr.rep;
    }

    ['noteSel','crookSel','srcNote'].forEach(id => document.getElementById(id).addEventListener('input', update));
    update();
  </script>
</body>
</html>`;

fs.writeFileSync('hf-space/index.html', html, 'utf8');
fs.writeFileSync('docs/index.html', html, 'utf8');
console.log('Generated HornLib static UI, size KB:', (html.length / 1024).toFixed(1));

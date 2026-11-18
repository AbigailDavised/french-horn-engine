import fs from 'node:fs';
import { HORN_NOTES_CATALOG, NATURAL_HARMONIC_SERIES, CROOK_OPTIONS } from '../dist/esm/index.js';

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const noteHeader = [
  'note_id',
  'written_note_in_f',
  'concert_pitch',
  'frequency_hz',
  'midi_note',
  'register',
  'f_side_valves',
  'bb_trigger_valves',
  'preferred_side',
  'stopped_f_valves',
  'harmonic_order_f',
  'harmonic_order_bb',
];

const noteRows = HORN_NOTES_CATALOG.map((n) => [
  n.id,
  n.writtenName,
  n.concertName,
  n.frequency,
  n.midiNote,
  n.register,
  n.fingering.fValves,
  n.fingering.bbValves,
  n.fingering.preferred,
  n.fingering.stoppedFValves,
  n.fingering.harmonicF ?? '',
  n.fingering.harmonicBb ?? '',
]);

fs.writeFileSync(
  'dataset/french_horn_double_fingerings.csv',
  [noteHeader, ...noteRows].map((r) => r.map(csvEscape).join(',')).join('\n') + '\n',
  'utf8',
);

const harmHeader = [
  'partial_order',
  'written_open_f_horn',
  'written_open_bb_horn',
  'frequency_ratio',
  'equal_temperament_cents_deviation',
  'intonation_tendency',
  'acoustic_notes',
];

const harmRows = NATURAL_HARMONIC_SERIES.map((h) => [
  h.order,
  h.writtenNameF,
  h.writtenNameBb,
  h.ratio,
  h.centsDeviation,
  h.intonationTendency,
  h.descriptionEn,
]);

fs.writeFileSync(
  'dataset/french_horn_harmonic_series_16.csv',
  [harmHeader, ...harmRows].map((r) => r.map(csvEscape).join(',')).join('\n') + '\n',
  'utf8',
);

const crookHeader = [
  'crook_id',
  'crook_name',
  'semitone_offset_to_f_horn',
  'interval_rule',
  'clef_reading_method',
  'canonical_repertoire',
];

const crookRows = CROOK_OPTIONS.map((c) => [
  c.id,
  c.nameEn,
  c.semitoneOffset,
  c.intervalRuleEn,
  c.clefMethodEn,
  c.famousPiecesEn.join('; '),
]);

fs.writeFileSync(
  'dataset/classical_horn_crooks_transposition.csv',
  [crookHeader, ...crookRows].map((r) => r.map(csvEscape).join(',')).join('\n') + '\n',
  'utf8',
);

console.log('Exported HornLib CSVs:', HORN_NOTES_CATALOG.length, 'notes,', NATURAL_HARMONIC_SERIES.length, 'harmonics,', CROOK_OPTIONS.length, 'crooks');

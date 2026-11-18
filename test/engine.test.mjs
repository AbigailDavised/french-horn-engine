import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  HORN_NOTES_CATALOG,
  NATURAL_HARMONIC_SERIES,
  CROOK_OPTIONS,
  lookupHornNote,
  calculateTransposition,
  calculateHornTuningSlide,
  computeHarmonicSeriesHz,
} from '../dist/esm/index.js';

const require = createRequire(import.meta.url);
const cjs = require('../dist/cjs/index.cjs');

test('catalogs load chromatic horn notes, 16 harmonics, and classical crooks', () => {
  assert.ok(HORN_NOTES_CATALOG.length >= 35);
  assert.equal(NATURAL_HARMONIC_SERIES.length, 16);
  assert.ok(CROOK_OPTIONS.length >= 8);
});

test('lookupHornNote resolves written F-horn notes to concert pitch & fingerings', () => {
  const c4 = lookupHornNote('C4');
  assert.equal(c4.concertName, 'F3');
  assert.equal(c4.fingering.fValves, '0');

  const g5 = lookupHornNote('G5');
  assert.equal(g5.concertName, 'C5');
  assert.equal(g5.fingering.preferred, 'Bb');
});

test('calculateTransposition handles Horn in Eb, D, C-basso, and G accurately', () => {
  const eb = calculateTransposition('G4', 'eb');
  assert.equal(eb.targetNoteName, 'F4');
  assert.equal(eb.semitonesShifted, -2);

  const g = calculateTransposition('C4', 'g');
  assert.equal(g.targetNoteName, 'D4');
  assert.equal(g.semitonesShifted, 2);
});

test('calculateHornTuningSlide & computeHarmonicSeriesHz', () => {
  const slide = calculateHornTuningSlide({ ambientCelsius: 24, referencePitchHz: 440 });
  assert.ok(slide.speedOfSoundMps > 345);
  assert.ok(slide.estimatedMainSlidePullMm > 0);

  const series = computeHarmonicSeriesHz(43.65);
  assert.equal(series[4].order, 5);
  assert.equal(series[4].centsDeviation, -14);
});

test('CJS export parity', () => {
  assert.equal(typeof cjs.calculateTransposition, 'function');
  assert.equal(cjs.NATURAL_HARMONIC_SERIES.length, 16);
});

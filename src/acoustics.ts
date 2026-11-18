import { HORN_NOTES_CATALOG, HornNote, NATURAL_HARMONIC_SERIES } from './fingering.js';

export interface TuningCalibrationResult {
  ambientCelsius: number;
  referencePitchHz: number;
  speedOfSoundMps: number;
  pitchDriftCentsFrom20C: number;
  estimatedMainSlidePullMm: number;
  recommendation: string;
}

/**
 * Computes acoustic speed-of-sound pitch drift and main tuning slide adjustment
 * for an F/Bb double French horn (~3.75m F-tube length) across ambient temperatures
 * and orchestra pitch standards (e.g. 440 Hz US/UK vs. 442/443 Hz Continental Europe).
 */
export function calculateHornTuningSlide(params: {
  ambientCelsius: number;
  referencePitchHz?: number;
  baselineCalibratedHzAt20C?: number;
}): TuningCalibrationResult {
  const temp = params.ambientCelsius;
  const refHz = params.referencePitchHz ?? 440;
  const baseHz = params.baselineCalibratedHzAt20C ?? 442;

  const c20 = 331.3 + 0.606 * 20; // ~343.42 m/s
  const cT = 331.3 + 0.606 * temp;
  const tempRatio = cT / c20;
  const pitchDriftCentsFrom20C = Number((1200 * Math.log2(tempRatio)).toFixed(1));

  // Effective open F horn acoustic length ~3750 mm at 440 Hz
  const targetRatio = (baseHz * tempRatio) / refHz;
  const deltaLengthMm = Math.max(-15, Math.min(45, (targetRatio - 1) * 3750));
  // Cylindrical slide has two legs, so slide pull distance = deltaLength / 2
  const pullMm = Number(Math.max(0, deltaLengthMm / 2).toFixed(1));

  const recommendation =
    pullMm <= 2
      ? 'Push main slide nearly all the way in; warm instrument thoroughly with air before tuning.'
      : `Pull main tuning slide approximately ${pullMm} mm, then balance F and Bb independent slides.`;

  return {
    ambientCelsius: temp,
    referencePitchHz: refHz,
    speedOfSoundMps: Number(cT.toFixed(2)),
    pitchDriftCentsFrom20C,
    estimatedMainSlidePullMm: pullMm,
    recommendation,
  };
}

export function lookupHornNote(query: string): HornNote | undefined {
  const q = query.trim().toLowerCase().replace('♯', '#').replace('b', '♭');
  return HORN_NOTES_CATALOG.find(
    (n) =>
      n.id.toLowerCase() === query.trim().toLowerCase() ||
      n.writtenName.toLowerCase() === q ||
      n.writtenName.replace('♭', 'b').toLowerCase() === query.trim().toLowerCase(),
  );
}

export function computeHarmonicSeriesHz(fundamentalHz: number) {
  return NATURAL_HARMONIC_SERIES.map((node) => ({
    ...node,
    pureHarmonicHz: Number((fundamentalHz * node.ratio).toFixed(2)),
  }));
}

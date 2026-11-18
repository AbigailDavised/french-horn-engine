# french-horn-engine

Zero-dependency TypeScript acoustic & fingering engine for the **F/Bb Double French Horn**: chromatic written-to-concert pitch mapping, preferred F-side vs. Bb-trigger fingerings, stopped-horn (`gestopft`) +1/2 step compensation, natural harmonic overtone series (partials 1–16) equal-temperament cent deviations, classical orchestral crook transposition (`Horn in Eb, D, C, G, A, E, Bb`), and room-temperature tuning slide calibration.

- **Interactive F/Bb Double Horn Fingering Chart**: [hornlib.com/fingerings](https://hornlib.com/fingerings)
- **Harmonic Overtone Series Intonation Analyzer**: [hornlib.com/tools/harmonics](https://hornlib.com/tools/harmonics)
- **Classical Crook Transposition Engine**: [hornlib.com/tools/transposition](https://hornlib.com/tools/transposition)
- **Orchestral Audition Excerpts Library**: [hornlib.com/repertoire-excerpts](https://hornlib.com/repertoire-excerpts)
- **Chromatic Horn Tuner (440/442 Hz)**: [hornlib.com/tools/tuner](https://hornlib.com/tools/tuner)
- **Offline Browser Fingering & Transposition Tool (GitHub Pages)**: [abigaildavised.github.io/french-horn-engine](https://abigaildavised.github.io/french-horn-engine/)

## Installation

```bash
npm install french-horn-engine
```

## Quick Start

```ts
import {
  lookupHornNote,
  calculateTransposition,
  calculateHornTuningSlide,
  computeHarmonicSeriesHz,
} from 'french-horn-engine';

const note = lookupHornNote('C5');
console.log(note?.concertName, note?.frequency, note?.fingering);
// "F4" 349.23 { fValves: '0', bbValves: 'T12', preferred: 'Bb', ... }

const eroica = calculateTransposition('G4', 'eb');
console.log(eroica);
// Horn in Eb written G4 -> read as F4 on modern Horn in F (-2 semitones)

console.log(calculateHornTuningSlide({ ambientCelsius: 22, referencePitchHz: 440 }));
console.log(computeHarmonicSeriesHz(43.65).slice(0, 8));
```

## License

MIT — Maintained by [Abigail Davis](https://github.com/AbigailDavised) (`abigaild@agentmail.to`) for [HornLib.com](https://hornlib.com).

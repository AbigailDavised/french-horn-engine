/**
 * HornLib — French Horn Acoustic & Fingering Data Model
 * 包含：
 * 1. 记谱音 (Written in F) 与 实际音 (Concert Pitch) 频率映射
 * 2. 双排管 (Double Horn F / Bb) 完整指法库与推荐换管点
 * 3. 手塞音 (Stopped Horn / Gestopft / +) 升高半音与指法补偿规则
 * 4. 自然泛音列 (1~16阶) 纯律音分偏差 (Cents Deviation)
 */

export interface AlternateFingering {
  tube: 'F' | 'Bb';
  valves: string;
  centsDeviation: number;
  labelZh: string;
  labelEn: string;
  acousticNote: string;
  harmonic?: number;
}

export interface HornFingering {
  fValves: string;       // F管指法: "0", "2", "1", "12", "23", "13", "123"
  bbValves: string;      // Bb管指法: "T0", "T2", "T1", "T12", "T23", "T13", "T123"
  preferred: 'F' | 'Bb'; // 职业演奏家推荐管别
  stoppedFValves: string;// F管手塞音补偿指法 (塞紧升高半音，因此指法需降低半音)
  stoppedBbNote?: string;// Bb管手塞声学提示
  harmonicF?: number;    // 对应F管自然泛音阶数 (1~16)
  harmonicBb?: number;   // 对应Bb管自然泛音阶数 (1~16)
  alternates?: AlternateFingering[];
}

export interface HornNote {
  id: string;            // 如 "c4", "f-sharp-4"
  writtenName: string;   // 记谱音名 (Horn in F): 如 "C4", "F#4"
  concertName: string;   // 实际发音 (Concert Pitch): 如 "F3", "B3" (比记谱低纯五度)
  frequency: number;     // 真实发音物理频率 (Hz)
  midiNote: number;      // 实际发音的 MIDI 编号
  register: 'low' | 'mid' | 'high' | 'altissimo';
  fingering: HornFingering;
  stavePosition: number; // 五线谱线间相对纵坐标 (-10 ~ 10, 0 为高音谱表中央C线)
  isCommon: boolean;     // 是否为核心常用教学音域
  pedalNote?: boolean;   // 是否为超低泛音基音
  description?: {
    en: string;
    zh: string;
    de: string;
    ja: string;
  };
}

export interface HarmonicNode {
  order: number;         // 泛音序号: 1 ~ 16
  writtenNameF: string;  // F管开管记谱音名
  writtenNameBb: string; // Bb管开管记谱音名
  ratio: number;         // 频率与基音倍比: 1, 2, 3...
  centsDeviation: number;// 与十二平均律音分偏差 (例如第5泛音 -14 cents, 第7泛音 -31 cents)
  intonationTendency: 'in-tune' | 'flat' | 'very-flat' | 'sharp' | 'unusable';
  descriptionEn: string;
  descriptionZh: string;
}

/**
 * 自然泛音列声学偏离表 (Harmonic Series 1 - 16)
 * 这是圆号演奏音准控制的物理基石
 */
export const NATURAL_HARMONIC_SERIES: HarmonicNode[] = [
  {
    order: 1,
    writtenNameF: 'C2',
    writtenNameBb: 'F2',
    ratio: 1,
    centsDeviation: 0,
    intonationTendency: 'in-tune',
    descriptionEn: 'Fundamental (Pedal note). Deep and resonant, requires relaxed embouchure.',
    descriptionZh: '基音（踏板音）。深沉而松弛，需要极度放松的嘴唇与饱满气流。',
  },
  {
    order: 2,
    writtenNameF: 'C3',
    writtenNameBb: 'F3',
    ratio: 2,
    centsDeviation: 0,
    intonationTendency: 'in-tune',
    descriptionEn: 'Octave above fundamental. Exact pure pitch.',
    descriptionZh: '第2泛音（纯八度）。物理纯律无偏差，极佳的低音锚点。',
  },
  {
    order: 3,
    writtenNameF: 'G3',
    writtenNameBb: 'C4',
    ratio: 3,
    centsDeviation: +2,
    intonationTendency: 'in-tune',
    descriptionEn: 'Pure perfect fifth. Slightly sharp (+2 cents), virtually imperceptible.',
    descriptionZh: '第3泛音（纯五度）。微高 2 音分，声学上近乎完美。',
  },
  {
    order: 4,
    writtenNameF: 'C4',
    writtenNameBb: 'F4',
    ratio: 4,
    centsDeviation: 0,
    intonationTendency: 'in-tune',
    descriptionEn: 'Middle C octave. Stable and centered reference tone.',
    descriptionZh: '第4泛音（中央C）。音准稳定，双排管中音区核心交界。',
  },
  {
    order: 5,
    writtenNameF: 'E4',
    writtenNameBb: 'A4',
    ratio: 5,
    centsDeviation: -14,
    intonationTendency: 'flat',
    descriptionEn: 'Pure major third. Noticeably flat (-14 cents), lip up or use alternate fingering.',
    descriptionZh: '第5泛音（纯大三度）。明显偏低 14 音分，需收紧嘴唇微提或换用备用指法。',
  },
  {
    order: 6,
    writtenNameF: 'G4',
    writtenNameBb: 'C5',
    ratio: 6,
    centsDeviation: +2,
    intonationTendency: 'in-tune',
    descriptionEn: 'Compound fifth. Very bright and stable harmonic.',
    descriptionZh: '第6泛音（复五度）。清脆稳定，圆号高贵音色的典型代表。',
  },
  {
    order: 7,
    writtenNameF: 'B♭4',
    writtenNameBb: 'E♭5',
    ratio: 7,
    centsDeviation: -31,
    intonationTendency: 'very-flat',
    descriptionEn: 'Natural 7th. Very flat (-31 cents). Usually avoided in equal temperament, used for blues.',
    descriptionZh: '第7泛音（自然小七度）。极度偏低 31 音分，一般规避使用，除非特殊色彩或蓝调效果。',
  },
  {
    order: 8,
    writtenNameF: 'C5',
    writtenNameBb: 'F5',
    ratio: 8,
    centsDeviation: 0,
    intonationTendency: 'in-tune',
    descriptionEn: 'High C octave. Perfect pure harmonic node.',
    descriptionZh: '第8泛音（高八度）。完全纯正，高音区基准点。',
  },
  {
    order: 9,
    writtenNameF: 'D5',
    writtenNameBb: 'G5',
    ratio: 9,
    centsDeviation: +4,
    intonationTendency: 'in-tune',
    descriptionEn: 'Major 9th. Slightly sharp (+4 cents), very easy to center.',
    descriptionZh: '第9泛音（大二度）。微高 4 音分，非常容易聚拢音芯。',
  },
  {
    order: 10,
    writtenNameF: 'E5',
    writtenNameBb: 'A5',
    ratio: 10,
    centsDeviation: -14,
    intonationTendency: 'flat',
    descriptionEn: 'High major third. Flat (-14 cents), often played on Bb horn to avoid cracks.',
    descriptionZh: '第10泛音（高音大三度）。偏低 14 音分，常切 B♭ 管以防止破音。',
  },
  {
    order: 11,
    writtenNameF: 'F#5',
    writtenNameBb: 'B5',
    ratio: 11,
    centsDeviation: -49,
    intonationTendency: 'unusable',
    descriptionEn: 'Between F and F#. Extremely flat (-49 cents), requires heavy hand stopping or valve alt.',
    descriptionZh: '第11泛音（中音增四度/减五度）。极偏 49 音分（几乎处于半音中间），必须靠指法修正。',
  },
  {
    order: 12,
    writtenNameF: 'G5',
    writtenNameBb: 'C6',
    ratio: 12,
    centsDeviation: +2,
    intonationTendency: 'in-tune',
    descriptionEn: 'High G harmonic. Piercing and heroic orchestral brilliance.',
    descriptionZh: '第12泛音（高音G）。英雄性交响号角的辉煌高音，穿透力极强。',
  },
  {
    order: 13,
    writtenNameF: 'A♭5',
    writtenNameBb: 'D♭6',
    ratio: 13,
    centsDeviation: +41,
    intonationTendency: 'unusable',
    descriptionEn: 'Extremely sharp (+41 cents). Almost a quarter tone high.',
    descriptionZh: '第13泛音。极度偏高 41 音分，一般仅在自然圆号曲目中出现。',
  },
  {
    order: 14,
    writtenNameF: 'B♭5',
    writtenNameBb: 'E♭6',
    ratio: 14,
    centsDeviation: -31,
    intonationTendency: 'very-flat',
    descriptionEn: 'Very flat high 7th (-31 cents).',
    descriptionZh: '第14泛音。偏低 31 音分的高阶自然音。',
  },
  {
    order: 15,
    writtenNameF: 'B5',
    writtenNameBb: 'E6',
    ratio: 15,
    centsDeviation: -12,
    intonationTendency: 'flat',
    descriptionEn: 'Leading tone harmonic. Slightly flat (-12 cents).',
    descriptionZh: '第15泛音（导音）。微低 12 音分。',
  },
  {
    order: 16,
    writtenNameF: 'C6',
    writtenNameBb: 'F6',
    ratio: 16,
    centsDeviation: 0,
    intonationTendency: 'in-tune',
    descriptionEn: 'Top C altissimo. Demands supreme lip speed and core support.',
    descriptionZh: '第16泛音（超高音C）。需要极高的唇肌张力与核心气流支撑。',
  }
];

/**
 * 现代圆号完整全音域指法库 (从 F#2 到 C6)
 * 涵盖记谱音、实际音(低纯五度)、F/Bb双排管转阀搭配以及手塞音补偿指法
 */
export const HORN_NOTES_CATALOG: HornNote[] = [
  // ── 低音区 (Low Register) ──
  {
    id: 'f-sharp-2',
    writtenName: 'F#2',
    concertName: 'B1',
    frequency: 61.74,
    midiNote: 35,
    register: 'low',
    stavePosition: -8,
    isCommon: false,
    fingering: {
      fValves: '123',
      bbValves: 'T123',
      preferred: 'F',
      stoppedFValves: '13',
      harmonicF: 2,
    },
    description: {
      en: 'Low F-sharp. Requires loose, open jaw and warm air column.',
      zh: '低音升F。需要松弛开放的下颌与温热宽广的气柱。',
      de: 'Tiefes Fis. Erfordert lockeren Unterkiefer und warme Luftführung.',
      ja: '低いF#。顎をリラックスさせ、温かい息の柱が必要です。'
    }
  },
  {
    id: 'g2',
    writtenName: 'G2',
    concertName: 'C2',
    frequency: 65.41,
    midiNote: 36,
    register: 'low',
    stavePosition: -7,
    isCommon: false,
    fingering: {
      fValves: '13',
      bbValves: 'T13',
      preferred: 'F',
      stoppedFValves: '23',
      harmonicF: 2,
    },
    description: {
      en: 'Low G. Deep orchestral pedal foundation note.',
      zh: '低音G。深沉的管弦乐低音基础音。',
      de: 'Tiefes G. Sonores Fundament im Orchestersatz.',
      ja: '低いG。オーケストラの深みのある低音基盤音。'
    }
  },
  {
    id: 'a-flat-2',
    writtenName: 'A♭2',
    concertName: 'D♭2',
    frequency: 69.30,
    midiNote: 37,
    register: 'low',
    stavePosition: -6,
    isCommon: true,
    fingering: {
      fValves: '23',
      bbValves: 'T23',
      preferred: 'F',
      stoppedFValves: '12',
      harmonicF: 2,
    },
    description: {
      en: 'Low A-flat. Rich and dark F horn coloration.',
      zh: '低音降A。浑厚深邃的 F 管音色。',
      de: 'Tiefes As. Dunkle, warme F-Horn-Klangfarbe.',
      ja: '低いA♭。豊かで深みのあるF管の音色。'
    }
  },
  {
    id: 'a2',
    writtenName: 'A2',
    concertName: 'D2',
    frequency: 73.42,
    midiNote: 38,
    register: 'low',
    stavePosition: -5,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T12',
      preferred: 'F',
      stoppedFValves: '1',
      harmonicF: 2,
    },
    description: {
      en: 'Low A. Resonant and centered on F horn.',
      zh: '低音A。在 F 管上共鸣饱满且重心集中。',
      de: 'Tiefes A. Vollmundig und zentriert auf dem F-Horn.',
      ja: '低いA。F管で響きが豊かで芯があります。'
    }
  },
  {
    id: 'b-flat-2',
    writtenName: 'B♭2',
    concertName: 'E♭2',
    frequency: 77.78,
    midiNote: 39,
    register: 'low',
    stavePosition: -4,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 2,
    },
    description: {
      en: 'Low B-flat. Standard 1st valve fingering.',
      zh: '低音降B。标准1号键指法。',
      de: 'Tiefes B. Standard 1. Ventil.',
      ja: '低いB♭。標準的な第1バルブ。'
    }
  },
  {
    id: 'b2',
    writtenName: 'B2',
    concertName: 'E2',
    frequency: 82.41,
    midiNote: 40,
    register: 'low',
    stavePosition: -3,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'F',
      stoppedFValves: '0',
      harmonicF: 2,
    },
    description: {
      en: 'Low B natural. 2nd valve alone.',
      zh: '低音还原B。单按2号键。',
      de: 'Tiefes H. 2. Ventil allein.',
      ja: '低いB（ナチュラル）。第2バルブのみ。'
    }
  },
  {
    id: 'c3',
    writtenName: 'C3',
    concertName: 'F2',
    frequency: 87.31,
    midiNote: 41,
    register: 'low',
    stavePosition: -2,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 2,
    },
    description: {
      en: 'C3 Open note (2nd harmonic on F horn). Solid low landmark.',
      zh: 'C3 开管自然音（F管第2泛音）。坚实的低音坐标。',
      de: 'C3 Leerton (2. Naturton F-Horn). Stabiler Referenzton.',
      ja: 'C3 開放音（F管第2倍音）。安定した低音の基準。'
    }
  },

  // ── 中低音区 (Middle Register Transition) ──
  {
    id: 'c-sharp-3',
    writtenName: 'C#3',
    concertName: 'F#2',
    frequency: 92.50,
    midiNote: 42,
    register: 'mid',
    stavePosition: -1.5,
    isCommon: true,
    fingering: {
      fValves: '123',
      bbValves: 'T123',
      preferred: 'F',
      stoppedFValves: '13',
      harmonicF: 3,
    },
    description: {
      en: 'Low C-sharp. All 3 valves down.',
      zh: '中低音升C。三键全按。',
      de: 'Tiefes Cis. Alle 3 Ventile gedrückt.',
      ja: '低いC#。3つのバルブすべてを押します。'
    }
  },
  {
    id: 'd3',
    writtenName: 'D3',
    concertName: 'G2',
    frequency: 98.00,
    midiNote: 43,
    register: 'mid',
    stavePosition: -1,
    isCommon: true,
    fingering: {
      fValves: '13',
      bbValves: 'T13',
      preferred: 'F',
      stoppedFValves: '23',
      harmonicF: 3,
    },
    description: {
      en: 'D3. Valving 1 & 3 on F horn.',
      zh: 'D3。F管 1+3 键组合。',
      de: 'D3. 1. und 3. Ventil auf F-Horn.',
      ja: 'D3。F管の第1+第3バルブ。'
    }
  },
  {
    id: 'e-flat-3',
    writtenName: 'E♭3',
    concertName: 'A♭2',
    frequency: 103.83,
    midiNote: 44,
    register: 'mid',
    stavePosition: -0.5,
    isCommon: true,
    fingering: {
      fValves: '23',
      bbValves: 'T23',
      preferred: 'F',
      stoppedFValves: '12',
      harmonicF: 3,
    },
    description: {
      en: 'E-flat 3. 2nd & 3rd valves down.',
      zh: '降E3。2+3 键。',
      de: 'Es3. 2. und 3. Ventil.',
      ja: 'E♭3。第2+第3バルブ。'
    }
  },
  {
    id: 'e3',
    writtenName: 'E3',
    concertName: 'A2',
    frequency: 110.00,
    midiNote: 45,
    register: 'mid',
    stavePosition: 0,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T12',
      preferred: 'F',
      stoppedFValves: '1',
      harmonicF: 3,
    },
    description: {
      en: 'E3. 1st & 2nd valves on F horn.',
      zh: 'E3。F管 1+2 键。',
      de: 'E3. 1. und 2. Ventil auf F-Horn.',
      ja: 'E3。F管の第1+第2バルブ。'
    }
  },
  {
    id: 'f3',
    writtenName: 'F3',
    concertName: 'B♭2',
    frequency: 116.54,
    midiNote: 46,
    register: 'mid',
    stavePosition: 0.5,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 3,
    },
    description: {
      en: 'F3. 1st valve.',
      zh: 'F3。1号键。',
      de: 'F3. 1. Ventil.',
      ja: 'F3。第1バルブ。'
    }
  },
  {
    id: 'f-sharp-3',
    writtenName: 'F#3',
    concertName: 'B2',
    frequency: 123.47,
    midiNote: 47,
    register: 'mid',
    stavePosition: 1,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'F',
      stoppedFValves: '0',
      harmonicF: 3,
    },
    description: {
      en: 'F-sharp 3. 2nd valve.',
      zh: '升F3。2号键。',
      de: 'Fis3. 2. Ventil.',
      ja: 'F#3。第2バルブ。'
    }
  },
  {
    id: 'g3',
    writtenName: 'G3',
    concertName: 'C3',
    frequency: 130.81,
    midiNote: 48,
    register: 'mid',
    stavePosition: 1.5,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 3,
    },
    description: {
      en: 'G3 open note on F horn (3rd harmonic). Very centered.',
      zh: 'G3 开管音（F管第3泛音）。声音聚拢纯净。',
      de: 'G3 Leerton auf F-Horn (3. Naturton). Sehr zentriert.',
      ja: 'G3 F管の開放音（第3倍音）。芯のある澄んだ音。'
    }
  },
  {
    id: 'a-flat-3',
    writtenName: 'A♭3',
    concertName: 'D♭3',
    frequency: 138.59,
    midiNote: 49,
    register: 'mid',
    stavePosition: 2,
    isCommon: true,
    fingering: {
      fValves: '23',
      bbValves: 'T23',
      preferred: 'F',
      stoppedFValves: '12',
      harmonicF: 4,
    },
    description: {
      en: 'A-flat 3. 2+3 on F horn.',
      zh: '降A3。F管 2+3 键。',
      de: 'As3. 2. und 3. Ventil auf F-Horn.',
      ja: 'A♭3。F管の第2+第3バルブ。'
    }
  },
  {
    id: 'a3',
    writtenName: 'A3',
    concertName: 'D3',
    frequency: 146.83,
    midiNote: 50,
    register: 'mid',
    stavePosition: 2.5,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T12',
      preferred: 'F',
      stoppedFValves: '1',
      harmonicF: 4,
    },
    description: {
      en: 'A3. 1+2 on F horn, or T12 on Bb horn.',
      zh: 'A3。F管 1+2 键，或 Bb 管 T12。',
      de: 'A3. 1+2 auf F-Horn, oder T12 auf B-Horn.',
      ja: 'A3。F管の1+2、またはB♭管のT12。'
    }
  },
  {
    id: 'b-flat-3',
    writtenName: 'B♭3',
    concertName: 'E♭3',
    frequency: 155.56,
    midiNote: 51,
    register: 'mid',
    stavePosition: 3,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 4,
    },
    description: {
      en: 'B-flat 3. 1st valve on F horn.',
      zh: '降B3。F管 1 号键。',
      de: 'B3. 1. Ventil auf F-Horn.',
      ja: 'B♭3。F管の第1バルブ。'
    }
  },
  {
    id: 'b3',
    writtenName: 'B3',
    concertName: 'E3',
    frequency: 164.81,
    midiNote: 52,
    register: 'mid',
    stavePosition: 3.5,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'F',
      stoppedFValves: '0',
      harmonicF: 4,
    },
    description: {
      en: 'B natural 3. 2nd valve.',
      zh: '还原B3。2 号键。',
      de: 'H3. 2. Ventil.',
      ja: 'B3。第2バルブ。'
    }
  },

  // ── 中央与核心高音区 (Core Middle to High Register) ──
  {
    id: 'c4',
    writtenName: 'C4',
    concertName: 'F3',
    frequency: 174.61,
    midiNote: 53,
    register: 'mid',
    stavePosition: 4,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 4,
      harmonicBb: 3,
    },
    description: {
      en: 'Middle C (Written). 4th harmonic on F horn, open note. Foundational tone.',
      zh: '中央C（记谱音）。F管第4泛音，开管基准音。',
      de: 'Eingestrichenes C. 4. Naturton auf F-Horn, Leerton. Grundlegender Ton.',
      ja: '中央のC（記譜音）。F管第4倍音、開放の基準音。'
    }
  },
  {
    id: 'c-sharp-4',
    writtenName: 'C#4',
    concertName: 'F#3',
    frequency: 185.00,
    midiNote: 54,
    register: 'mid',
    stavePosition: 4.5,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T23',
      preferred: 'F',
      stoppedFValves: '1',
      harmonicF: 5,
      harmonicBb: 4,
    },
    description: {
      en: 'C#4. F horn: 12 (or 23). Bb horn: T23.',
      zh: '升C4。F管 12（或23），Bb管 T23。',
      de: 'Cis4. F-Horn: 12 (oder 23). B-Horn: T23.',
      ja: 'C#4。F管: 12、B♭管: T23。'
    }
  },
  {
    id: 'd4',
    writtenName: 'D4',
    concertName: 'G3',
    frequency: 196.00,
    midiNote: 55,
    register: 'mid',
    stavePosition: 5,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T12',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 5,
      harmonicBb: 4,
    },
    description: {
      en: 'D4. F horn: 1. Bb horn: T12.',
      zh: 'D4。F管 1 键，Bb管 T12。',
      de: 'D4. F-Horn: 1. B-Horn: T12.',
      ja: 'D4。F管: 1、B♭管: T12。'
    }
  },
  {
    id: 'e-flat-4',
    writtenName: 'E♭4',
    concertName: 'A♭3',
    frequency: 207.65,
    midiNote: 56,
    register: 'mid',
    stavePosition: 5.5,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T1',
      preferred: 'F',
      stoppedFValves: '0',
      harmonicF: 5,
      harmonicBb: 4,
    },
    description: {
      en: 'E-flat 4. F horn: 2. Bb horn: T1.',
      zh: '降E4。F管 2 键，Bb管 T1。',
      de: 'Es4. F-Horn: 2. B-Horn: T1.',
      ja: 'E♭4。F管: 2、B♭管: T1。'
    }
  },
  {
    id: 'e4',
    writtenName: 'E4',
    concertName: 'A3',
    frequency: 220.00,
    midiNote: 57,
    register: 'mid',
    stavePosition: 6,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T2',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 5,
      harmonicBb: 4,
    },
    description: {
      en: 'E4. 5th harmonic open on F horn (slightly flat, lip up), or T2 on Bb horn.',
      zh: 'E4。F管开管第5泛音（微偏低需提唇），或Bb管 T2。',
      de: 'E4. 5. Naturton Leerton F-Horn (etwas tief, treiben) oder T2 B-Horn.',
      ja: 'E4。F管第5倍音の開放音（やや低め、唇で上げる）、またはB♭管のT2。'
    }
  },
  {
    id: 'f4',
    writtenName: 'F4',
    concertName: 'B♭3',
    frequency: 233.08,
    midiNote: 58,
    register: 'mid',
    stavePosition: 6.5,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T0',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 6,
      harmonicBb: 4,
    },
    description: {
      en: 'F4. F horn: 1. Bb horn: T0 (open on Bb). Transition note to Bb horn.',
      zh: 'F4。F管按1键，Bb管为T0开管音。常作为切入Bb管的起点。',
      de: 'F4. F-Horn: 1. B-Horn: T0 (Leerton auf B). Übergangston zum B-Horn.',
      ja: 'F4。F管: 1、B♭管: T0（B♭管の開放音）。B♭管への移行ポイント。'
    }
  },
  {
    id: 'f-sharp-4',
    writtenName: 'F#4',
    concertName: 'B3',
    frequency: 246.94,
    midiNote: 59,
    register: 'mid',
    stavePosition: 7,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'F',
      stoppedFValves: '0',
      harmonicF: 6,
      harmonicBb: 5,
    },
    description: {
      en: 'F#4. F horn: 2. Bb horn: T2.',
      zh: '升F4。F管 2 键，Bb管 T2。',
      de: 'Fis4. F-Horn: 2. B-Horn: T2.',
      ja: 'F#4。F管: 2、B♭管: T2。'
    }
  },
  {
    id: 'g4',
    writtenName: 'G4',
    concertName: 'C4',
    frequency: 261.63,
    midiNote: 60,
    register: 'mid',
    stavePosition: 7.5,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'F',
      stoppedFValves: '2',
      harmonicF: 6,
      harmonicBb: 5,
    },
    description: {
      en: 'G4. 6th harmonic on F horn, open. Highly resonant center of the horn.',
      zh: 'G4。F管第6泛音开管音。圆号最光辉饱满的黄金共鸣中心。',
      de: 'G4. 6. Naturton auf F-Horn, Leerton. Resonantes Zentrum des Horns.',
      ja: 'G4。F管第6倍音の開放音。ホルンの最も輝かしく豊かな共鳴中心。'
    }
  },
  {
    id: 'a-flat-4',
    writtenName: 'A♭4',
    concertName: 'D♭4',
    frequency: 277.18,
    midiNote: 61,
    register: 'high',
    stavePosition: 8,
    isCommon: true,
    fingering: {
      fValves: '23',
      bbValves: 'T23',
      preferred: 'Bb',
      stoppedFValves: '12',
      harmonicF: 7,
      harmonicBb: 5,
    },
    description: {
      en: 'A-flat 4. Recommended on Bb horn (T23) for rock-solid stability.',
      zh: '降A4。强烈推荐使用 Bb 管 (T23)，音准如磐石般稳固。',
      de: 'As4. Empfohlen auf B-Horn (T23) für felsenfeste Stabilität.',
      ja: 'A♭4。圧倒的な安定性のためにB♭管（T23）を推奨。'
    }
  },
  {
    id: 'a4',
    writtenName: 'A4',
    concertName: 'D4',
    frequency: 293.66,
    midiNote: 62,
    register: 'high',
    stavePosition: 8.5,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T12',
      preferred: 'Bb',
      stoppedFValves: '1',
      harmonicF: 7,
      harmonicBb: 5,
    },
    description: {
      en: 'A4. Bb horn T12 preferred. F horn 12 also possible.',
      zh: 'A4。首选 Bb 管 T12，F管 12 亦可。',
      de: 'A4. B-Horn T12 bevorzugt. F-Horn 12 ebenfalls möglich.',
      ja: 'A4。B♭管のT12が好ましい。F管の12も可能。'
    }
  },
  {
    id: 'b-flat-4',
    writtenName: 'B♭4',
    concertName: 'E♭4',
    frequency: 311.13,
    midiNote: 63,
    register: 'high',
    stavePosition: 9,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 8,
      harmonicBb: 6,
    },
    description: {
      en: 'B-flat 4. Bb horn T1 gives brilliant tone.',
      zh: '降B4。Bb管 T1 具有明亮辉煌的音色。',
      de: 'B4. B-Horn T1 verleiht strahlenden Ton.',
      ja: 'B♭4。B♭管のT1は輝かしい音色をもたらします。'
    }
  },
  {
    id: 'b4',
    writtenName: 'B4',
    concertName: 'E4',
    frequency: 329.63,
    midiNote: 64,
    register: 'high',
    stavePosition: 9.5,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'Bb',
      stoppedFValves: '0',
      harmonicF: 8,
      harmonicBb: 6,
    },
    description: {
      en: 'B natural 4. Bb horn T2 gives superior security.',
      zh: '还原B4。Bb管 T2 提供极高的防破音保险度。',
      de: 'H4. B-Horn T2 bietet überlegene Treffsicherheit.',
      ja: 'B4。B♭管のT2は抜群の安定感を提供します。'
    }
  },
  {
    id: 'c5',
    writtenName: 'C5',
    concertName: 'F4',
    frequency: 349.23,
    midiNote: 65,
    register: 'high',
    stavePosition: 10,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 8,
      harmonicBb: 6,
    },
    description: {
      en: 'High C (Written). Bb horn T0 is the standard orchestral fingering.',
      zh: '高音C（记谱音）。Bb管 T0 为交响乐标准指法，开阔透亮。',
      de: 'Hohes C. B-Horn T0 ist der Orchesterstandard.',
      ja: '高いC（記譜音）。B♭管のT0がオーケストラの標準指法です。'
    }
  },

  // ── 高音与超高音区 (High & Altissimo Register) ──
  {
    id: 'c-sharp-5',
    writtenName: 'C#5',
    concertName: 'F#4',
    frequency: 369.99,
    midiNote: 66,
    register: 'high',
    stavePosition: 10.5,
    isCommon: true,
    fingering: {
      fValves: '12',
      bbValves: 'T12',
      preferred: 'Bb',
      stoppedFValves: '1',
      harmonicF: 9,
      harmonicBb: 7,
    },
    description: {
      en: 'C#5. Bb horn T12 (or T23).',
      zh: '升C5。Bb管 T12（或T23）。',
      de: 'Cis5. B-Horn T12 (oder T23).',
      ja: 'C#5。B♭管のT12（またはT23）。'
    }
  },
  {
    id: 'd5',
    writtenName: 'D5',
    concertName: 'G4',
    frequency: 392.00,
    midiNote: 67,
    register: 'high',
    stavePosition: 11,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 9,
      harmonicBb: 8,
    },
    description: {
      en: 'D5. Bb horn T1 is bright and focused.',
      zh: 'D5。Bb管 T1 音色清脆聚焦。',
      de: 'D5. B-Horn T1 ist strahlend und fokussiert.',
      ja: 'D5。B♭管のT1は明るくフォーカスされた音。'
    }
  },
  {
    id: 'e-flat-5',
    writtenName: 'E♭5',
    concertName: 'A♭4',
    frequency: 415.30,
    midiNote: 68,
    register: 'high',
    stavePosition: 11.5,
    isCommon: true,
    fingering: {
      fValves: '2',
      bbValves: 'T2',
      preferred: 'Bb',
      stoppedFValves: '0',
      harmonicF: 10,
      harmonicBb: 8,
    },
    description: {
      en: 'E-flat 5. Bb horn T2 is solid.',
      zh: '降E5。Bb管 T2 稳定可靠。',
      de: 'Es5. B-Horn T2 ist sehr verlässlich.',
      ja: 'E♭5。B♭管のT2は信頼性が高い。'
    }
  },
  {
    id: 'e5',
    writtenName: 'E5',
    concertName: 'A4',
    frequency: 440.00,
    midiNote: 69,
    register: 'high',
    stavePosition: 12,
    isCommon: true,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 10,
      harmonicBb: 8,
    },
    description: {
      en: 'E5 (Concert A440). Bb horn T0 or T12. Pure solo brilliance.',
      zh: 'E5（实际发音标准 A440 音高）。Bb管 T0 开管或 T12。独奏辉煌高音。',
      de: 'E5 (Klingend A440). B-Horn T0 oder T12. Brillanter Soloton.',
      ja: 'E5（実音A440）。B♭管のT0またはT12。輝かしいソロトーン。'
    }
  },
  {
    id: 'f5',
    writtenName: 'F5',
    concertName: 'B♭4',
    frequency: 466.16,
    midiNote: 70,
    register: 'altissimo',
    stavePosition: 12.5,
    isCommon: true,
    fingering: {
      fValves: '1',
      bbValves: 'T1',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 11,
      harmonicBb: 9,
    },
    description: {
      en: 'F5 Altissimo. Bb horn T1. Keep throat open.',
      zh: 'F5 超高音。Bb管 T1。保持咽喉管道开放。',
      de: 'F5 Altissimo. B-Horn T1. Kehle weit offen halten.',
      ja: 'F5 最高音域。B♭管のT1。喉を開放したまま保ちます。'
    }
  },
  {
    id: 'g5',
    writtenName: 'G5',
    concertName: 'C5',
    frequency: 523.25,
    midiNote: 72,
    register: 'altissimo',
    stavePosition: 13.5,
    isCommon: false,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 12,
      harmonicBb: 10,
    },
    description: {
      en: 'Top G (Strauss Heldenleben). Master-tier altissimo.',
      zh: '高音G（施特劳斯《英雄生涯》高光）。大师级超高音考验。',
      de: 'Spitzen-G (Strauss Heldenleben). Meisterklasse-Altissimo.',
      ja: '最高音G（リヒャルト・シュトラウス『英雄の生涯』）。最高峰の難関。'
    }
  },
  {
    id: 'c6',
    writtenName: 'C6',
    concertName: 'F5',
    frequency: 698.46,
    midiNote: 77,
    register: 'altissimo',
    stavePosition: 16,
    isCommon: false,
    fingering: {
      fValves: '0',
      bbValves: 'T0',
      preferred: 'Bb',
      stoppedFValves: '2',
      harmonicF: 16,
      harmonicBb: 13,
    },
    description: {
      en: 'Extreme High C (Written C6). Pinnacle of horn altissimo technique.',
      zh: '极限高音C（记谱 C6）。现代圆号超吹技法的巅峰。',
      de: 'Extremes hohes C (Notiert C6). Gipfel der Horn-Blastechnik.',
      ja: '極限のハイC（記譜C6）。ホルン演奏技術の頂点。'
    }
  }
];

export function getHornNoteById(id: string): HornNote | undefined {
  return HORN_NOTES_CATALOG.find((n) => n.id === id);
}

export function getNotesByValves(valves: string, isBbHorn: boolean): HornNote[] {
  return HORN_NOTES_CATALOG.filter((n) => {
    if (isBbHorn) {
      return n.fingering.bbValves === valves || n.fingering.bbValves === `T${valves}`;
    }
    return n.fingering.fValves === valves;
  });
}

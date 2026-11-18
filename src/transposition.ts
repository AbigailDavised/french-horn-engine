/**
 * HornLib — Classical French Horn Transposition Engine
 * 针对莫扎特、贝多芬、海顿、勃拉姆斯等古典自然圆号（Natural Horn Crooks）谱面的移调心算模型
 * 核心基准：现代双排圆号以 F 调记谱（Horn in F）为读取基准
 */

export interface CrookOption {
  id: string;
  nameEn: string;
  nameZh: string;
  semitoneOffset: number; // 相对于现代 Horn in F 的记谱半音偏移量 (如 Eb 调 = -2 半音)
  intervalRuleEn: string; // 心算口诀 (英文)
  intervalRuleZh: string; // 心算口诀 (中文)
  clefMethodZh: string;   // 古典谱号替代法技巧
  clefMethodEn: string;
  famousPieces: string[]; // 经典代表曲目
  famousPiecesEn: string[];
}

export const CROOK_OPTIONS: CrookOption[] = [
  {
    id: 'c-basso',
    nameEn: 'Horn in C (basso)',
    nameZh: 'C 调低音圆号 (Horn in C basso)',
    semitoneOffset: -5,
    intervalRuleEn: 'Transpose DOWN a Perfect 4th (or read in Bass Clef + 8ve)',
    intervalRuleZh: '向下移纯四度（或用低音谱号读谱并高八度）',
    clefMethodZh: '视作低音谱号，调号加一个升号（或减一个降号）',
    clefMethodEn: 'Read in bass clef one octave up; add one sharp / subtract one flat.',
    famousPieces: ['海顿交响曲早中期', '莫扎特交响曲 No.36/41', '贝多芬第一交响曲'],
    famousPiecesEn: ['Haydn Early Symphonies', 'Mozart Symphonies 36 & 41', 'Beethoven Symphony No. 1'],
  },
  {
    id: 'd',
    nameEn: 'Horn in D',
    nameZh: 'D 调圆号 (Horn in D)',
    semitoneOffset: -3,
    intervalRuleEn: 'Transpose DOWN a Minor 3rd',
    intervalRuleZh: '向下移小三度（小三度读谱）',
    clefMethodZh: '视作低音中音谱号（次中音谱号），加三个升号',
    clefMethodEn: 'Read in tenor clef, add three sharps (or subtract three flats).',
    famousPieces: ['贝多芬第二交响曲', '海顿 D 大调圆号协奏曲', '莫扎特第四圆号协奏曲第二乐章'],
    famousPiecesEn: ['Beethoven Symphony No. 2', 'Haydn Concerto in D', 'Mozart Horn Concerto No. 4 Romance'],
  },
  {
    id: 'eb',
    nameEn: 'Horn in E♭',
    nameZh: 'E♭ 调圆号 (Horn in E♭) — 最常见古典调',
    semitoneOffset: -2,
    intervalRuleEn: 'Transpose DOWN a Major 2nd (One Whole Step)',
    intervalRuleZh: '向下移大二度（下移一个全音，古典交响最常用！）',
    clefMethodZh: '视作低音中音谱号，调号减两个降号（或加两个升号）',
    clefMethodEn: 'Read in bass clef one octave higher, or read down one step; add two sharps / minus two flats.',
    famousPieces: ['贝多芬第三交响曲《英雄》', '莫扎特四首圆号协奏曲全部', '贝多芬第五交响曲'],
    famousPiecesEn: ['Beethoven Symphony No. 3 (Eroica)', 'Mozart Concertos 1–4', 'Beethoven Symphony No. 5'],
  },
  {
    id: 'e',
    nameEn: 'Horn in E',
    nameZh: 'E 调圆号 (Horn in E)',
    semitoneOffset: -1,
    intervalRuleEn: 'Transpose DOWN a Minor 2nd (One Half Step)',
    intervalRuleZh: '向下移小二度（下移一个半音）',
    clefMethodZh: '所有音名向下挪半音，原指法降半音吹奏',
    clefMethodEn: 'Shift down one half-step; think one semitone lower throughout.',
    famousPieces: ['贝多芬第七交响曲', '勃拉姆斯圆号三重奏 Op.40', '韦伯《魔弹射手》序曲'],
    famousPiecesEn: ['Beethoven Symphony No. 7', 'Brahms Horn Trio Op. 40', 'Weber Der Freischütz Overture'],
  },
  {
    id: 'f',
    nameEn: 'Horn in F (Modern Standard)',
    nameZh: 'F 调圆号 (现代通用记谱标准)',
    semitoneOffset: 0,
    intervalRuleEn: 'Modern standard — As written (No transposition)',
    intervalRuleZh: '现代标准记谱 — 所见即所吹，无需移调',
    clefMethodZh: '直接按现代标准高音谱表读谱',
    clefMethodEn: 'Standard modern treble clef; play as written.',
    famousPieces: ['柴可夫斯基第五交响曲', '马勒全集', '理查·施特劳斯交响诗'],
    famousPiecesEn: ['Tchaikovsky Symphony No. 5', 'Mahler Symphonies', 'Richard Strauss Tone Poems'],
  },
  {
    id: 'g',
    nameEn: 'Horn in G',
    nameZh: 'G 调圆号 (Horn in G)',
    semitoneOffset: +2,
    intervalRuleEn: 'Transpose UP a Major 2nd (One Whole Step)',
    intervalRuleZh: '向上移大二度（上移一个全音）',
    clefMethodZh: '视作中音谱号（Alto Clef），加一个降号',
    clefMethodEn: 'Read in alto clef; add two sharps / subtract two flats.',
    famousPieces: ['莫扎特第 40 交响曲', '罗西尼《威廉·退尔》序曲', '海顿第 94 惊愕交响曲'],
    famousPiecesEn: ['Mozart Symphony No. 40', 'Rossini William Tell', 'Haydn Surprise Symphony'],
  },
  {
    id: 'a',
    nameEn: 'Horn in A',
    nameZh: 'A 调圆号 (Horn in A)',
    semitoneOffset: +4,
    intervalRuleEn: 'Transpose UP a Major 3rd',
    intervalRuleZh: '向上移大三度（上移四个半音）',
    clefMethodZh: '高音谱表直接向上看大三度（如原谱 C 读作 E）',
    clefMethodEn: 'Read up a major third directly on treble clef; add four sharps.',
    famousPieces: ['贝多芬第七交响曲第一/终乐章', '莫扎特第 29 交响曲', '门德尔松第四交响曲'],
    famousPiecesEn: ['Beethoven Symphony No. 7 Finale', 'Mozart Symphony No. 29', 'Mendelssohn Symphony No. 4'],
  },
  {
    id: 'bb-alto',
    nameEn: 'Horn in B♭ (alto)',
    nameZh: 'B♭ 高音圆号 (Horn in B♭ alto)',
    semitoneOffset: +5,
    intervalRuleEn: 'Transpose UP a Perfect 4th',
    intervalRuleZh: '向上移纯四度（高昂明亮，上移五个半音）',
    clefMethodZh: '向上纯四度读谱，可直接在 B♭ 管上按开管泛音吹奏',
    clefMethodEn: 'Read up a perfect 4th; play directly on B♭ tube harmonic nodes.',
    famousPieces: ['莫扎特第 25 交响曲 (G小调)', '海顿第 39 交响曲', '舒曼第二交响曲'],
    famousPiecesEn: ['Mozart Symphony No. 25 in G minor', 'Haydn Symphony No. 39', 'Schumann Symphony No. 2'],
  },
  {
    id: 'bb-basso',
    nameEn: 'Horn in B♭ (basso)',
    nameZh: 'B♭ 低音圆号 (Horn in B♭ basso)',
    semitoneOffset: -7,
    intervalRuleEn: 'Transpose DOWN a Perfect 5th',
    intervalRuleZh: '向下移纯五度（深沉雄浑，下移七个半音）',
    clefMethodZh: '向下纯五度读谱，常在深低音区出现',
    clefMethodEn: 'Read down a perfect 5th; typical in low pedal register.',
    famousPieces: ['勃拉姆斯第二交响曲', '贝多芬第四交响曲', '海顿第 98 交响曲'],
    famousPiecesEn: ['Brahms Symphony No. 2', 'Beethoven Symphony No. 4', 'Haydn Symphony No. 98'],
  },
];

// 标准十二半音音名列表 (用于半音运算)
const SEMITONE_SCALE = [
  'C', 'C#', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'A♭', 'A', 'B♭', 'B'
];

export interface TranspositionResult {
  sourceCrook: string;
  sourceNoteName: string;
  targetNoteName: string; // 现代 F 调圆号应读谱音
  semitonesShifted: number;
  clefMethod: string;
  intervalRule: string;
}

/**
 * 核心移调心算器：将古典克鲁克管上的谱面音换算为现代 Horn in F 读谱音
 */
export function calculateTransposition(
  writtenNoteWithOctave: string,
  crookId: string
): TranspositionResult {
  const crook = CROOK_OPTIONS.find((c) => c.id === crookId) || CROOK_OPTIONS[2];
  
  // 分离音名与八度 (例如 "G4" -> "G", 4)
  const match = writtenNoteWithOctave.match(/^([A-G][b♭#]?)([0-9])$/);
  if (!match) {
    return {
      sourceCrook: crook.nameEn,
      sourceNoteName: writtenNoteWithOctave,
      targetNoteName: writtenNoteWithOctave,
      semitonesShifted: 0,
      clefMethod: crook.clefMethodZh,
      intervalRule: crook.intervalRuleZh,
    };
  }

  let noteName = match[1].replace('b', '♭');
  let octave = parseInt(match[2], 10);

  // 查出当前音名在半音音阶中的序号 (0-11)
  let scaleIndex = SEMITONE_SCALE.indexOf(noteName);
  if (scaleIndex === -1) {
    // 兼容同音异名 (如 D# -> Eb)
    if (noteName === 'D#') scaleIndex = SEMITONE_SCALE.indexOf('E♭');
    else if (noteName === 'G#') scaleIndex = SEMITONE_SCALE.indexOf('A♭');
    else if (noteName === 'A#') scaleIndex = SEMITONE_SCALE.indexOf('B♭');
    else scaleIndex = 0;
  }

  // 施加半音偏移 (Horn in F 是现代基准)
  let targetIndex = scaleIndex + crook.semitoneOffset;
  let targetOctave = octave;

  while (targetIndex < 0) {
    targetIndex += 12;
    targetOctave -= 1;
  }
  while (targetIndex >= 12) {
    targetIndex -= 12;
    targetOctave += 1;
  }

  const targetNoteName = `${SEMITONE_SCALE[targetIndex]}${targetOctave}`;

  return {
    sourceCrook: crook.nameEn,
    sourceNoteName: writtenNoteWithOctave,
    targetNoteName,
    semitonesShifted: crook.semitoneOffset,
    clefMethod: crook.clefMethodZh,
    intervalRule: crook.intervalRuleZh,
  };
}

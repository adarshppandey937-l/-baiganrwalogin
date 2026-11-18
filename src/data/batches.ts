import rawBatchesJson from './rwax_batches.json';
import type {
  BatchCategory,
  BatchItem,
  LectureItem,
  SubjectFolder,
  TopicFolder,
} from '../types/portal';

export const BRAND_FIRST = 'PANDEY';
export const BRAND_SECOND = 'JI';
export const BRAND_FULL = 'PANDEY JI';
export const BRAND_LOGO_URL = '/src/assets/images/pandey_ji_logo.jpg';
export const BRAND_LOGO_FALLBACK_URL =
  'https://i.postimg.cc/wv3RgCjh/Screenshot-2026-07-30-13-33-52-41-948cd9899890cbd5c2798760b2b95377.jpg';

const FALLBACK_COVERS: Record<BatchCategory, string> = {
  police: '/src/assets/images/batch_police_upsi_1794979148698.jpg',
  ssc: '/src/assets/images/batch_ssc_foundation_1794979149645.jpg',
  railway: '/src/assets/images/batch_railway_ntpc_1794979151121.jpg',
  defence: '/src/assets/images/batch_defence_army_navy_1794979151766.jpg',
  board: '/src/assets/images/batch_board_science_1794979152799.jpg',
  state: '/src/assets/images/batch_teaching_pet_1794979154247.jpg',
};

interface RawBatch {
  id: number | string;
  title: string;
  thumbnail: string;
}

interface RawBatchesFile {
  new?: RawBatch[];
  old?: RawBatch[];
}

function detectCategory(title: string): BatchCategory {
  const t = title.toLowerCase();
  if (
    t.includes('class ') ||
    t.includes('board') ||
    t.includes('cbse') ||
    t.includes('बोर्ड') ||
    t.includes('10th') ||
    t.includes('11th') ||
    t.includes('12th') ||
    t.includes('9th')
  ) {
    return 'board';
  }
  if (
    t.includes('army') ||
    t.includes('navy') ||
    t.includes('airforce') ||
    t.includes('capf') ||
    t.includes('bsf') ||
    t.includes('nda') ||
    t.includes('cds') ||
    t.includes('agniveer') ||
    t.includes('marcos')
  ) {
    return 'defence';
  }
  if (
    t.includes('rrb') ||
    t.includes('rail') ||
    t.includes('ntpc') ||
    t.includes('alp') ||
    t.includes('group d') ||
    t.includes('rpf')
  ) {
    return 'railway';
  }
  if (
    t.includes('police') ||
    t.includes('upsi') ||
    t.includes('constable') ||
    t.includes('daroga') ||
    t.includes('खाकी') ||
    t.includes('थानेदार')
  ) {
    return 'police';
  }
  if (t.includes('ssc') || t.includes('cgl') || t.includes('chsl') || t.includes('mts') || t.includes('cpo')) {
    return 'ssc';
  }
  return 'state';
}

const rawData = rawBatchesJson as RawBatchesFile;
const combinedRaw: RawBatch[] = [
  ...(rawData.new || []),
  ...(rawData.old || []),
];

export const BATCHES: BatchItem[] = combinedRaw.map((item) => {
  const category = detectCategory(item.title || '');
  return {
    id: String(item.id),
    title: String(item.title || '').trim(),
    thumbnail: item.thumbnail || FALLBACK_COVERS[category],
    fallbackThumbnail: FALLBACK_COVERS[category],
    category,
  };
});

interface TopicTemplate {
  name: string;
  description: string;
  lectures: {
    title: string;
    durationSec: number;
    recordedDate: string;
    formula: string;
    keyPoints: string[];
    question: string;
    solution: string;
    quizQ: string;
    quizOptions: string[];
    quizAns: number;
    quizExp: string;
  }[];
}

interface SubjectTemplate {
  name: string;
  faculty: string;
  topics: TopicTemplate[];
}

const COMPETITIVE_SUBJECTS: SubjectTemplate[] = [
  {
    name: 'Mathematics (गणित)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Number System & Divisibility',
        description: 'Unit digit, divisibility rules, remainder theorem, and LCM/HCF shortcuts',
        lectures: [
          {
            title: 'Lecture 01: Unit Digit & Cyclicity Rules',
            durationSec: 2880,
            recordedDate: '12 Oct 2026',
            formula: 'Unit Digit(a^n) = Unit Digit(a^(n mod 4)), where 0 maps to 4',
            keyPoints: [
              'Digits 0, 1, 5, 6 always retain the same unit digit for any positive power.',
              'Digits 4 and 9 alternate with a cycle length of 2 (odd vs even exponent).',
              'Digits 2, 3, 7, 8 repeat their unit digit strictly every 4 powers.',
            ],
            question: 'Find the unit digit of (237)^143 × (148)^94.',
            solution:
              '143 mod 4 = 3 → 7³ ends in 3. 94 mod 4 = 2 → 8² ends in 4. Product: 3 × 4 = 12 → Unit digit is 2.',
            quizQ: 'What is the unit digit of 7^95 - 3^58?',
            quizOptions: ['0', '4', '6', '7'],
            quizAns: 1,
            quizExp: '7^95 ends in 7^3 = 3; 3^58 ends in 3^2 = 9. Taking borrow: 13 - 9 = 4.',
          },
          {
            title: 'Lecture 02: Divisibility Rules (7, 11, 13 & Composite Numbers)',
            durationSec: 3120,
            recordedDate: '14 Oct 2026',
            formula: '11-Rule: |(Sum of odd positions) − (Sum of even positions)| ≡ 0 (mod 11)',
            keyPoints: [
              'Break composite divisors like 72 into co-prime factors (8 × 9) and test both.',
              'For 88, check divisibility by 8 (last 3 digits) and 11 (alternating digit sum).',
              'Any 6-digit repeating block like abcabc is always divisible by 7, 11, and 13 (1001).',
            ],
            question: 'Which number divides every 6-digit number of the form xyzxyz?',
            solution: 'xyzxyz = xyz × 1001 = xyz × 7 × 11 × 13.',
            quizQ: 'Which number always divides every 6-digit number of the form xyzxyz?',
            quizOptions: ['101', '1001', '111', '999'],
            quizAns: 1,
            quizExp: 'xyzxyz = xyz × 1001, and 1001 = 7 × 11 × 13.',
          },
        ],
      },
      {
        name: 'Percentage, Ratio & Profit-Loss',
        description: 'Fraction-to-percentage conversion tables, successive change, and marked price',
        lectures: [
          {
            title: 'Lecture 01: Fraction Conversion & Ratio Scaling',
            durationSec: 2760,
            recordedDate: '19 Oct 2026',
            formula: 'Net % Change = x + y + (x·y)/100',
            keyPoints: [
              'Memorize reciprocal equivalents from 1/2 (50%) up to 1/20 (5%) for rapid calculation.',
              'If price increases by a/b, consumption must drop by a/(a+b) for constant spend.',
              'Use ratio chains for successive percentage changes.',
            ],
            question: 'Sugar price rises by 25%. By what % should consumption drop to keep spend unchanged?',
            solution: '25% = +1/4 → reduction = 1/(4+1) = 1/5 = 20%.',
            quizQ: 'Successive discounts of 20% and 15% equal a single discount of:',
            quizOptions: ['35%', '32%', '30%', '33%'],
            quizAns: 1,
            quizExp: '20 + 15 − (20 × 15)/100 = 35 − 3 = 32%.',
          },
        ],
      },
    ],
  },
  {
    name: 'Reasoning (तर्कशक्ति)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Syllogism & Coding-Decoding',
        description: '100-50 rule, Either-Or cases, opposite pairs, and series patterns',
        lectures: [
          {
            title: 'Lecture 01: Syllogism 100-50 Method & Either-Or Rules',
            durationSec: 2640,
            recordedDate: '13 Oct 2026',
            formula: 'Positive + Positive = Positive | Positive + Negative = Negative',
            keyPoints: [
              'Two negative statements never yield a definite direct conclusion.',
              'An Either-Or pair requires both conclusions individually false and matching terms.',
              'Middle term must carry value 100 at least once to connect premises.',
            ],
            question: 'All pens are books. Some books are desks. Does "Some pens are desks" follow?',
            solution: 'Middle term "books" is 50 in both premises → Does NOT follow.',
            quizQ: 'Which pair forms a valid complementary Either-Or pair?',
            quizOptions: ['All + No', 'Some + No', 'All + Some', 'No + Some Not'],
            quizAns: 1,
            quizExp: 'Some + No (and All + Some Not) form valid complementary pairs.',
          },
        ],
      },
    ],
  },
  {
    name: 'General Studies & Polity (सामान्य अध्ययन)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Indian Constitution & Fundamental Rights',
        description: 'Articles 12–35, Writs, Constitutional Amendments, and Modern History',
        lectures: [
          {
            title: 'Lecture 01: Fundamental Rights (Articles 12 to 35) & 5 Writs',
            durationSec: 3240,
            recordedDate: '15 Oct 2026',
            formula: 'Art. 32 (Supreme Court Writs) | Art. 226 (High Court Writs)',
            keyPoints: [
              'Articles 14–18 cover Equality; 19–22 cover Freedoms; 23–24 cover Exploitation.',
              'Article 32 was called the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar.',
              '44th Amendment (1978) shifted Right to Property to Article 300A.',
            ],
            question: 'Which writ prevents a lower court from exceeding its jurisdiction?',
            solution: 'Writ of Prohibition.',
            quizQ: 'Which Constitutional Amendment added Fundamental Duties (Article 51A)?',
            quizOptions: ['42nd Amendment, 1976', '44th Amendment, 1978', '86th Amendment, 2002', '73rd Amendment, 1992'],
            quizAns: 0,
            quizExp: 'The 42nd Amendment Act (1976) added Part IV-A on recommendation of the Swaran Singh Committee.',
          },
        ],
      },
    ],
  },
  {
    name: 'Hindi (सामान्य हिंदी)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'संधि, समास एवं अलंकार',
        description: 'स्वर/व्यंजन/विसर्ग संधि, समास के भेद एवं अभ्यास प्रश्न',
        lectures: [
          {
            title: 'Lecture 01: स्वर संधि के 5 भेद — पहचान की सटीक ट्रिक',
            durationSec: 2580,
            recordedDate: '18 Oct 2026',
            formula: 'दीर्घ (आ, ई, ऊ) | गुण (ए, ओ, अर्) | वृद्धि (ऐ, औ) | यण (य, व, र से पूर्व आधा वर्ण)',
            keyPoints: [
              'मध्य में आ, ई, ऊ की मात्रा होने पर दीर्घ संधि की जाँच करें।',
              'यण संधि में य/व से ठीक पहले प्रायः अर्ध व्यंजन आता है।',
              'अयादि संधि में अय्, आय्, अव्, आव् ध्वनि निकलती है।',
            ],
            question: '“स्वागत” शब्द का सही संधि-विच्छेद बताइए।',
            solution: 'सु + आगत = स्वागत (यण स्वर संधि)।',
            quizQ: '“महौषध” में कौन-सी संधि है?',
            quizOptions: ['दीर्घ संधि', 'गुण संधि', 'वृद्धि संधि', 'अयादि संधि'],
            quizAns: 2,
            quizExp: 'महा + औषध = महौषध (आ + औ → औ), जो वृद्धि स्वर संधि का उदाहरण है।',
          },
        ],
      },
    ],
  },
];

const BOARD_SUBJECTS: SubjectTemplate[] = [
  {
    name: 'Physics (भौतिक विज्ञान)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Electrostatics & Ray Optics',
        description: 'Gauss law, capacitance, lens maker formula, and prism refraction',
        lectures: [
          {
            title: 'Lecture 01: Gauss Theorem & Electric Flux Applications',
            durationSec: 3180,
            recordedDate: '14 Oct 2026',
            formula: 'Φ = ∮ E · dA = q_enclosed / ε₀',
            keyPoints: [
              'Electric flux through a closed Gaussian surface depends solely on net enclosed charge.',
              'Electric field due to an infinite plane sheet: E = σ / (2ε₀).',
              'Inside a hollow spherical conducting shell, E = 0 and potential V is constant.',
            ],
            question: 'A charge of 8.85 μC sits at the center of a cube. Find total flux.',
            solution: 'Φ = q/ε₀ = (8.85 × 10⁻⁶) / (8.85 × 10⁻¹²) = 10⁶ N·m²/C.',
            quizQ: 'What is the SI unit of electric flux?',
            quizOptions: ['N·m/C', 'N·m²/C', 'J/C', 'V/m'],
            quizAns: 1,
            quizExp: 'Flux Φ = E · A, where E is in N/C and A is in m², giving N·m²/C.',
          },
        ],
      },
    ],
  },
  {
    name: 'Chemistry (रसायन विज्ञान)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Electrochemistry & Chemical Kinetics',
        description: 'Nernst equation, cell potential, and first-order reaction half-life',
        lectures: [
          {
            title: 'Lecture 01: Nernst Equation & Cell Potential',
            durationSec: 2940,
            recordedDate: '16 Oct 2026',
            formula: 'E_cell = E°_cell − (0.0591 / n) log₁₀(Q)  at 298 K',
            keyPoints: [
              'Standard Gibbs energy relates to cell potential via ΔG° = −nFE°_cell.',
              'At equilibrium, E_cell = 0 and E°_cell = (0.0591 / n) log₁₀(Kc).',
              'First-order half-life t½ = 0.693 / k is independent of initial concentration.',
            ],
            question: 'For n = 2 and E°_cell = 0.2955 V at 298 K, compute log₁₀(Kc).',
            solution: 'log₁₀(Kc) = (2 × 0.2955) / 0.0591 = 10.',
            quizQ: 'What is the half-life expression for a first-order chemical reaction?',
            quizOptions: ['[A]₀ / 2k', '0.693 / k', '1 / k[A]₀', '2.303 / k'],
            quizAns: 1,
            quizExp: 'First-order half-life t½ = ln(2)/k ≈ 0.693/k.',
          },
        ],
      },
    ],
  },
  {
    name: 'Mathematics (गणित)',
    faculty: 'PANDEY JI Faculty',
    topics: [
      {
        name: 'Calculus & Definite Integrals',
        description: 'Differentiation, integration by parts, and King property',
        lectures: [
          {
            title: 'Lecture 01: King Property & Definite Integration Tricks',
            durationSec: 3240,
            recordedDate: '21 Oct 2026',
            formula: '∫[a→b] f(x) dx = ∫[a→b] f(a + b − x) dx',
            keyPoints: [
              'Odd functions integrate to 0 over any symmetric interval [−a, a].',
              'King property solves trigonometric ratio integrals over [0, π/2] in 2 steps.',
              'Select u using ILATE rule for Integration by Parts.',
            ],
            question: 'Evaluate ∫[0→π/2] sin(x) / (sin(x) + cos(x)) dx.',
            solution: '2I = ∫[0→π/2] 1 dx = π/2 → I = π/4.',
            quizQ: 'What is the value of ∫[−π/2 → π/2] sin³(x) dx?',
            quizOptions: ['0', '1', '2/3', 'π/2'],
            quizAns: 0,
            quizExp: 'sin³(x) is an odd function integrated over [−a, a], so its value is 0.',
          },
        ],
      },
    ],
  },
];

export function getBatchCurriculum(batch: BatchItem): SubjectFolder[] {
  const templates = batch.category === 'board' ? BOARD_SUBJECTS : COMPETITIVE_SUBJECTS;

  return templates.map((subj, sIdx) => {
    const topics: TopicFolder[] = subj.topics.map((topic, tIdx) => {
      const lectures: LectureItem[] = topic.lectures.map((lec, lIdx) => ({
        id: `${batch.id}-s${sIdx}-t${tIdx}-l${lIdx}`,
        index: lIdx + 1,
        title: lec.title,
        durationSec: lec.durationSec,
        recordedDate: lec.recordedDate,
        thumbnail: batch.thumbnail || batch.fallbackThumbnail,
        instructor: subj.faculty,
        summary: topic.description,
        slides: [
          {
            timeSec: 0,
            heading: `Core Concept — ${topic.name}`,
            keyPoints: lec.keyPoints,
            formula: lec.formula,
          },
          {
            timeSec: Math.round(lec.durationSec * 0.45),
            heading: 'Worked Exam Example',
            keyPoints: [
              'Identify the exact formula shortcut before expanding.',
              'Double-check signs and units before marking the final option.',
            ],
            formula: lec.formula,
            exampleProblem: {
              question: lec.question,
              solution: lec.solution,
            },
          },
          {
            timeSec: Math.round(lec.durationSec * 0.8),
            heading: 'Quick Revision Summary',
            keyPoints: lec.keyPoints,
            formula: lec.formula,
          },
        ],
        noteSections: [
          {
            title: 'Key Formula & Rules',
            bullets: lec.keyPoints,
            formulaBox: lec.formula,
          },
          {
            title: 'Solved Example',
            bullets: [`Question: ${lec.question}`, `Solution: ${lec.solution}`],
          },
        ],
        quiz: [
          {
            id: `${batch.id}-q-${sIdx}-${tIdx}-${lIdx}`,
            question: lec.quizQ,
            options: lec.quizOptions,
            correctIndex: lec.quizAns,
            explanation: lec.quizExp,
          },
        ],
      }));

      return {
        id: `${batch.id}-s${sIdx}-t${tIdx}`,
        name: topic.name,
        lectureCount: lectures.length,
        description: topic.description,
        lectures,
      };
    });

    return {
      id: `${batch.id}-s${sIdx}`,
      name: subj.name,
      faculty: subj.faculty,
      topicCount: topics.length,
      lectureCount: topics.reduce((sum, t) => sum + t.lectureCount, 0),
      topics,
    };
  });
}

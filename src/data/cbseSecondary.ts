import type { CBSEClassData, CBSESubject } from '../types/curriculum';
import { buildChapters, type RawTopicBlueprint } from './curriculumHelpers';

function makeSubject(
  classNumber: number,
  slug: string,
  name: string,
  category: CBSESubject['category'],
  accentTint: CBSESubject['accentTint'],
  description: string,
  chapters: RawTopicBlueprint[],
  hindiName?: string
): CBSESubject {
  return {
    id: `c${classNumber}-${slug}`,
    classNumber,
    name,
    hindiName,
    category,
    accentTint,
    description,
    chapters: buildChapters(classNumber, slug, name, chapters),
  };
}

export const CBSE_SECONDARY_CLASSES: CBSEClassData[] = [
  // ==================== CLASS 9 ====================
  {
    classNumber: 9,
    label: 'Class 9',
    stage: 'Secondary (Classes 9–10)',
    subjects: [
      makeSubject(9, 'math', 'Mathematics', 'Mathematics', 'blue', 'Number Systems, Polynomials, Coordinate Geometry, Triangles, and Heron’s Formula.', [
        {
          title: 'Number Systems (Real & Irrational Numbers)',
          topics: ['Rational vs Irrational numbers', 'Representing √2, √3 on number line', 'Laws of exponents for real numbers', 'Rationalising the denominator'],
          summary: 'Explore real numbers combining rational and irrational numbers, classify decimal expansions, and rationalize surd denominators.',
          objectives: ['Distinguish terminating, non-terminating recurring, and irrational decimals', 'Rationalize expressions like 1/(√5 − √3)'],
          studyNotes: [
            'Rational numbers have either terminating or non-terminating repeating decimal expansions (e.g., 1/3 = 0.333...).',
            'Irrational numbers (√2, √3, π) have non-terminating, non-repeating decimal expansions.',
            'To rationalize 1/(√a + √b), multiply numerator and denominator by the conjugate (√a − √b).'
          ],
          revisionPoints: ['Real = Rational ∪ Irrational', '(√a + √b)(√a − √b) = a − b', '√2 ≈ 1.414, π is irrational'],
          practiceQuestions: [
            { question: 'Rationalize the denominator of 1 / (√7 − √6).', answer: 'Multiply by (√7 + √6): (√7 + √6) / (7 − 6) = √7 + √6.' },
            { question: 'Is 0.1010010001... rational or irrational?', answer: 'Irrational, because it is non-terminating and non-repeating.' }
          ],
          quizQuestions: [
            { question: 'Which of the following is an irrational number?', options: ['0.25', '√16', '√7', '22/7'], correctIndex: 2, explanation: '7 is not a perfect square, so √7 is irrational; 22/7 is rational.' },
            { question: 'Every rational number is:', options: ['A natural number', 'A whole number', 'A real number', 'An integer'], correctIndex: 2, explanation: 'All rational and irrational numbers belong to the Real Numbers set.' },
            { question: 'What is (√5 + √2)(√5 − √2)?', options: ['7', '3', '√3', '2√5'], correctIndex: 1, explanation: '(√5)² − (√2)² = 5 − 2 = 3.' },
            { question: 'Simplify 16^(3/4):', options: ['4', '8', '12', '2'], correctIndex: 1, explanation: '16^(1/4) = 2, and 2³ = 8.' },
            { question: 'The decimal expansion of an irrational number is:', options: ['Terminating', 'Non-terminating recurring', 'Non-terminating non-recurring', 'Always 0'], correctIndex: 2, explanation: 'Irrationals never terminate and never repeat in a fixed block.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Polynomials & Remainder / Factor Theorem',
          topics: ['Degree of a polynomial', 'Zeroes of a polynomial', 'Remainder & Factor Theorems', 'Algebraic identities'],
          summary: 'Classify polynomials by degree and terms, compute zeroes, and factorize cubics and quadratics via Factor Theorem.',
          objectives: ['Determine degree and coefficients', 'Apply Remainder Theorem p(a) and Factor Theorem'],
          studyNotes: [
            'In a polynomial, variable powers must be non-negative integers (0, 1, 2...). Degree is the highest power of the variable.',
            'Factor Theorem: (x − a) is a factor of p(x) if and only if p(a) = 0.'
          ],
          revisionPoints: ['Zero of ax + b is -b/a', 'x³ + y³ + z³ − 3xyz = (x+y+z)(x²+y²+z²−xy−yz−zx)', 'If x+y+z=0 then x³+y³+z³=3xyz'],
          practiceQuestions: [
            { question: 'Find the zero of p(x) = 3x − 6.', answer: '3x − 6 = 0 -> x = 2.' },
            { question: 'Check whether (x − 1) is a factor of x³ − 2x² + x.', answer: 'p(1) = 1 − 2 + 1 = 0 -> Yes, it is a factor.' }
          ],
          quizQuestions: [
            { question: 'What is the degree of the zero polynomial?', options: ['0', '1', 'Not defined', 'Infinite'], correctIndex: 2, explanation: 'The degree of the zero polynomial is not defined.' },
            { question: 'Find the zero of p(x) = 2x + 5:', options: ['5/2', '-5/2', '2/5', '-2/5'], correctIndex: 1, explanation: '2x + 5 = 0 -> x = -5/2.' },
            { question: 'What is the remainder when x³ + 1 is divided by (x + 1)?', options: ['0', '1', '2', '-1'], correctIndex: 0, explanation: 'p(-1) = (-1)³ + 1 = -1 + 1 = 0.' },
            { question: 'If a + b + c = 0, then a³ + b³ + c³ equals:', options: ['0', 'abc', '3abc', 'a²+b²+c²'], correctIndex: 2, explanation: 'Standard cubic identity reduces to 3abc when sum is 0.' },
            { question: 'Which expression is NOT a polynomial?', options: ['x² + 3x + 1', 'y + 2/y', '5', 't³ − 7'], correctIndex: 1, explanation: '2/y = 2y⁻¹ has a negative exponent, so it is not a polynomial.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Coordinate Geometry & Heron’s Formula',
          topics: ['Cartesian plane & quadrants', 'Abscissa and ordinate', 'Area of triangle via Heron’s Formula'],
          summary: 'Locate points across all four Cartesian quadrants and compute triangle areas cleanly from side lengths using Heron’s Formula.',
          objectives: ['Identify quadrants from (x, y) signs', 'Compute semi-perimeter s and Area = √(s(s−a)(s−b)(s−c))'],
          studyNotes: [
            'Cartesian signs: Quadrant I (+, +), Q II (−, +), Q III (−, −), Q IV (+, −). Origin is (0, 0).',
            'Heron’s Formula: For sides a, b, c, semi-perimeter s = (a + b + c)/2, and Area = √[s(s − a)(s − b)(s − c)].'
          ],
          revisionPoints: ['x-coordinate = Abscissa', 'y-coordinate = Ordinate', 'Point on x-axis has y = 0'],
          practiceQuestions: [
            { question: 'In which quadrant does (-4, 5) lie?', answer: 'Quadrant II (−, +).' },
            { question: 'Find the area of a triangle with sides 5 cm, 12 cm, and 13 cm.', answer: 's = (5+12+13)/2 = 15. Area = √(15×10×3×2) = √900 = 30 cm².' }
          ],
          quizQuestions: [
            { question: 'In which quadrant does the point (-3, -7) lie?', options: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], correctIndex: 2, explanation: 'Both x and y are negative in Quadrant III.' },
            { question: 'What is the ordinate of the point (6, -2)?', options: ['6', '-2', '4', '0'], correctIndex: 1, explanation: 'Ordinate is the y-coordinate (-2).' },
            { question: 'Any point on the y-axis has coordinates of the form:', options: ['(x, 0)', '(0, y)', '(y, y)', '(1, y)'], correctIndex: 1, explanation: 'On the y-axis, x-coordinate is always 0.' },
            { question: 'For sides 13 cm, 14 cm, 15 cm, what is the semi-perimeter s?', options: ['42 cm', '21 cm', '14 cm', '28 cm'], correctIndex: 1, explanation: 's = (13 + 14 + 15) / 2 = 42 / 2 = 21 cm.' },
            { question: 'Find the area of an equilateral triangle of side 4 cm:', options: ['4√3 cm²', '8√3 cm²', '16√3 cm²', '2√3 cm²'], correctIndex: 0, explanation: '(√3 / 4) × 4² = 4√3 cm².' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(9, 'science', 'Science', 'Science', 'mint', 'Matter, Atoms & Molecules, Cell Biology, Motion, and Newton’s Laws of Force.', [
        {
          title: 'Matter in Our Surroundings & Atoms',
          topics: ['States of matter & latent heat', 'Sublimation & evaporation', 'Dalton’s atomic theory', 'Mole concept & atomic mass'],
          summary: 'Explore particle nature of matter, cooling effect of evaporation, and laws of chemical combination and atomic structure.',
          objectives: ['Explain latent heat & factors affecting evaporation', 'State Law of Conservation of Mass & Constant Proportions'],
          studyNotes: [
            'Evaporation causes cooling because surface particles absorb latent heat from surroundings. Rate increases with surface area, temperature, and wind speed.',
            'Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction. 1 mole = 6.022 × 10²³ particles.'
          ],
          revisionPoints: ['0°C = 273.15 K', 'Sublimation: Solid -> Gas directly', 'Water H:O mass ratio = 1:8'],
          practiceQuestions: [
            { question: 'Convert 25°C to Kelvin.', answer: '25 + 273 = 298 K.' },
            { question: 'Why does a desert cooler cool better on a hot dry day?', answer: 'High temperature and low humidity increase evaporation rate, absorbing more heat.' }
          ],
          quizQuestions: [
            { question: 'What is 300 K on the Celsius scale?', options: ['27°C', '37°C', '573°C', '100°C'], correctIndex: 0, explanation: '300 − 273 = 27°C.' },
            { question: 'Direct change of solid camphor into gas without becoming liquid is:', options: ['Condensation', 'Sublimation', 'Evaporation', 'Fusion'], correctIndex: 1, explanation: 'Sublimation skips the liquid phase.' },
            { question: 'Which factor DECREASES the rate of evaporation?', options: ['Higher wind speed', 'Larger surface area', 'Higher humidity', 'Higher temperature'], correctIndex: 2, explanation: 'Humid air already holds moisture, slowing evaporation.' },
            { question: 'What is the ratio by mass of Hydrogen to Oxygen in water (H2O)?', options: ['2 : 1', '1 : 8', '1 : 16', '8 : 1'], correctIndex: 1, explanation: 'H₂ : O = (2×1) : 16 = 2 : 16 = 1 : 8.' },
            { question: 'Who proposed that all matter is made of indivisible particles called atoms?', options: ['Newton', 'John Dalton', 'Bohr', 'Mendeleev'], correctIndex: 1, explanation: 'Dalton’s Atomic Theory (1808) laid modern chemical foundations.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Motion: Distance, Displacement & Equations',
          topics: ['Scalar vs vector', 'Uniform & non-uniform acceleration', 'v = u + at, s = ut + ½at², v² − u² = 2as'],
          summary: 'Analyze motion through graphs and derive and solve problems with the three kinematic equations of uniformly accelerated motion.',
          objectives: ['Distinguish distance vs displacement', 'Solve problems with the 3 equations of motion'],
          studyNotes: [
            'Distance is total path length (scalar); displacement is shortest straight-line distance from start to end (vector).',
            'Three equations: (1) v = u + at, (2) s = ut + ½at², (3) v² − u² = 2as.'
          ],
          revisionPoints: ['Slope of v–t graph = Acceleration', 'Area under v–t graph = Displacement', 'Circular motion at constant speed is accelerated'],
          practiceQuestions: [
            { question: 'A car starts from rest and reaches 20 m/s in 5 s. Find its acceleration.', answer: 'a = (v − u)/t = (20 − 0)/5 = 4 m/s².' },
            { question: 'When are distance and magnitude of displacement equal?', answer: 'When an object moves in a straight line without reversing direction.' }
          ],
          quizQuestions: [
            { question: 'What does the slope of a velocity–time graph represent?', options: ['Distance', 'Speed', 'Acceleration', 'Force'], correctIndex: 2, explanation: 'Change in velocity divided by time is acceleration.' },
            { question: 'What does the area under a velocity–time graph give?', options: ['Acceleration', 'Displacement / Distance', 'Mass', 'Momentum'], correctIndex: 1, explanation: 'Velocity × Time = Displacement.' },
            { question: 'An object moves in a circular track returning to start. Its net displacement is:', options: ['2πr', 'πr²', 'Zero', 'r'], correctIndex: 2, explanation: 'Initial and final positions coincide, so displacement is zero.' },
            { question: 'A train starts from rest (u = 0) with a = 2 m/s². Distance covered in 4 s is:', options: ['8 m', '16 m', '32 m', '4 m'], correctIndex: 1, explanation: 's = 0 + ½(2)(4²) = 16 m.' },
            { question: 'What is the SI unit of acceleration?', options: ['m/s', 'm/s²', 'km/h', 'N/m'], correctIndex: 1, explanation: 'Metre per second squared (m/s²).' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Force, Laws of Motion & Fundamental Unit of Life',
          topics: ['Newton’s 1st, 2nd, 3rd Laws', 'Momentum p = mv & F = ma', 'Prokaryotic vs Eukaryotic cells', 'Cell organelles'],
          summary: 'Master Newton’s three laws of motion alongside cell biology—mitochondria, nucleus, plastids, and osmosis.',
          objectives: ['Calculate F = ma & conserve momentum', 'Explain roles of Nucleus, Mitochondria, Lysosomes'],
          studyNotes: [
            '1st Law (Inertia): Bodies resist change in motion. 2nd Law: F = ma (1 N = 1 kg·m/s²). 3rd Law: Every action has an equal and opposite reaction.',
            'Cell organelles: Mitochondria (powerhouse making ATP), Ribosomes (proteins), Lysosomes (suicidal bags), Chloroplasts (photosynthesis in plants).'
          ],
          revisionPoints: ['F = ma, p = mv', 'Mitochondria = ATP powerhouse', 'Plant cells have cell wall & large vacuole'],
          practiceQuestions: [
            { question: 'Find the force needed to accelerate a 5 kg mass at 3 m/s².', answer: 'F = ma = 5 × 3 = 15 N.' },
            { question: 'Why are mitochondria called the powerhouse of the cell?', answer: 'They generate energy in the form of ATP molecules.' }
          ],
          quizQuestions: [
            { question: 'Which Newton’s law defines Force quantitatively as F = ma?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'], correctIndex: 1, explanation: 'Rate of change of momentum is proportional to applied force (F = ma).' },
            { question: 'Which organelle is known as the powerhouse of the cell?', options: ['Golgi body', 'Mitochondria', 'Lysosome', 'Nucleolus'], correctIndex: 1, explanation: 'Mitochondria release energy as ATP.' },
            { question: 'Which structure is present in plant cells but absent in animal cells?', options: ['Cell membrane', 'Nucleus', 'Cell wall & Plastids', 'Cytoplasm'], correctIndex: 2, explanation: 'Cellulose cell wall and plastids are unique to plants/algae.' },
            { question: 'Why do passengers fall forward when a moving bus brakes suddenly?', options: ['Friction', 'Inertia of motion', 'Gravity', 'Momentum loss'], correctIndex: 1, explanation: 'Upper body keeps moving forward due to inertia.' },
            { question: 'Which organelle is called the "suicidal bag" of the cell?', options: ['Ribosome', 'Lysosome', 'Vacuole', 'Endoplasmic reticulum'], correctIndex: 1, explanation: 'Lysosomes contain digestive enzymes that can digest damaged cells.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(9, 'sst', 'Social Science', 'Social Science', 'peach', 'French Revolution, India’s Physical Features, Democracy, and People as Resource.', [
        {
          title: 'The French Revolution (1789)',
          topics: ['Three Estates society', 'Storming of the Bastille', 'Declaration of Rights of Man', 'Reign of Terror & Napoleon'],
          summary: 'Understand how inequality, bread crises, and Enlightenment ideals sparked the 1789 French Revolution, reshaping modern democracy.',
          objectives: ['Explain the 3 Estates tax burden', 'Trace key events from 1789 to 1799'],
          studyNotes: [
            'France was divided into 1st Estate (Clergy), 2nd Estate (Nobility)—both tax-exempt—and 3rd Estate (90%+ peasants, workers, bourgeoisie) who paid all taxes (Tithe & Taille).',
            'On 14 July 1789, crowds stormed the Bastille fortress. The National Assembly passed the Declaration of the Rights of Man and Citizen.'
          ],
          revisionPoints: ['14 July 1789: Fall of Bastille', 'Liberty, Equality, Fraternity', 'Rousseau wrote Social Contract'],
          practiceQuestions: [
            { question: 'What was "Tithe" in pre-revolutionary France?', answer: 'A tax (one-tenth of agricultural produce) levied by the Church.' },
            { question: 'Who wrote "The Spirit of the Laws"?', answer: 'Montesquieu (advocating separation of powers).' }
          ],
          quizQuestions: [
            { question: 'On which date was the Bastille fortress stormed in Paris?', options: ['14 July 1789', '26 January 1789', '4 July 1776', '15 August 1791'], correctIndex: 0, explanation: '14 July 1789 marks Bastille Day.' },
            { question: 'Which Estate in France paid ALL direct and indirect taxes?', options: ['First Estate', 'Second Estate', 'Third Estate', 'Clergy only'], correctIndex: 2, explanation: 'Clergy and Nobility enjoyed feudal tax exemptions.' },
            { question: 'Who led the Jacobin Reign of Terror (1793–1794)?', options: ['Louis XVI', 'Maximilien Robespierre', 'Napoleon Bonaparte', 'Mirabeau'], correctIndex: 1, explanation: 'Robespierre instituted severe guillotine policies during 1793–94.' },
            { question: 'Which philosopher proposed division of power into legislature, executive, and judiciary?', options: ['Voltaire', 'Montesquieu', 'John Locke', 'Rousseau'], correctIndex: 1, explanation: 'Montesquieu argued for separation of powers in The Spirit of the Laws.' },
            { question: 'When did women in France finally win the right to vote?', options: ['1791', '1804', '1946', '1918'], correctIndex: 2, explanation: 'French women won suffrage in 1946.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'Physical Features of India & Drainage',
          topics: ['Himalayas, Northern Plains, Peninsular Plateau', 'Western & Eastern Ghats', 'Himalayan vs Peninsular rivers'],
          summary: 'Explore India’s six physiographic divisions and compare perennial Himalayan rivers with seasonal Peninsular rivers.',
          objectives: ['Locate major Himalayan ranges & Plateau divisions', 'Compare Indus/Ganga vs Godavari/Narmada'],
          studyNotes: [
            'Himalayas have 3 parallel ranges: Himadri (Greater), Himachal (Lesser), and Shiwaliks (outermost).',
            'Himalayan rivers (Ganga, Brahmaputra) are perennial (snow + rain fed); Peninsular rivers (Godavari, Krishna, Kaveri) are mostly rain-fed. Narmada & Tapi flow west into the Arabian Sea.'
          ],
          revisionPoints: ['Himadri -> Himachal -> Shiwaliks', 'Godavari = Dakshin Ganga', 'Narmada & Tapi flow westward'],
          practiceQuestions: [
            { question: 'Which river is known as "Dakshin Ganga"?', answer: 'The Godavari (longest Peninsular river).' },
            { question: 'Name two west-flowing Peninsular rivers that form estuaries.', answer: 'Narmada and Tapi.' }
          ],
          quizQuestions: [
            { question: 'Which is the northernmost and loftiest range of the Himalayas?', options: ['Shiwaliks', 'Himachal', 'Himadri (Inner Himalayas)', 'Aravali'], correctIndex: 2, explanation: 'Himadri contains peaks like Everest and Kanchenjunga.' },
            { question: 'Which river is known as the Dakshin Ganga?', options: ['Krishna', 'Kaveri', 'Godavari', 'Mahanadi'], correctIndex: 2, explanation: 'Godavari is the largest Peninsular river system.' },
            { question: 'Which two major Peninsular rivers flow westward into the Arabian Sea?', options: ['Ganga and Yamuna', 'Narmada and Tapi', 'Krishna and Kaveri', 'Mahanadi and Godavari'], correctIndex: 1, explanation: 'Narmada and Tapi flow through rift valleys westward.' },
            { question: 'India’s only active volcano is located on:', options: ['Lakshadweep', 'Barren Island (Andaman & Nicobar)', 'Majuli Island', 'Daman'], correctIndex: 1, explanation: 'Barren Island in the Andaman Sea has India’s active volcano.' },
            { question: 'The fertile alluvial Northern Plains were formed by which river systems?', options: ['Narmada, Tapi, Luni', 'Indus, Ganga, Brahmaputra', 'Kaveri, Vaigai', 'Mahi, Sabarmati'], correctIndex: 1, explanation: 'Himalayan rivers deposited deep fertile alluvium.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'What is Democracy? & People as Resource',
          topics: ['Features of democracy', 'Human capital formation', 'Education & health investment', 'Types of unemployment'],
          summary: 'Define essential conditions for genuine democracy and analyze how education and healthcare turn population into productive human capital.',
          objectives: ['Distinguish real democracy from sham elections', 'Compare seasonal and disguised unemployment'],
          studyNotes: [
            'Democracy requires free and fair elections, one person–one vote–one value, rule of law, and respect for minority rights.',
            'Disguised unemployment happens in farming when more people work than needed; removing extra workers does not drop output.'
          ],
          revisionPoints: ['One person, one vote, one value', 'Human capital = Skill + Education + Health', 'Disguised unemployment = hidden zero-marginal productivity'],
          practiceQuestions: [
            { question: 'What is disguised unemployment?', answer: 'When more workers are employed in a task (e.g., 8 on a farm needing 5) than actually required.' },
            { question: 'Why is human capital superior to land and physical capital?', answer: 'Because only humans can utilize and organize land, tools, and technology.' }
          ],
          quizQuestions: [
            { question: 'Which is a core feature of a true democracy?', options: ['Single-party monopoly', 'Free, fair, competitive elections', 'Military censorship', 'Hereditary rule'], correctIndex: 1, explanation: 'Voters must have real choice and fair elections.' },
            { question: 'If 7 people work on a small plot where only 4 are needed, this illustrates:', options: ['Educated unemployment', 'Disguised unemployment', 'Frictional unemployment', 'Urban growth'], correctIndex: 1, explanation: 'The extra 3 workers contribute zero additional output.' },
            { question: 'Which economic sector includes farming, forestry, and mining?', options: ['Primary sector', 'Secondary sector', 'Tertiary sector', 'Quaternary sector'], correctIndex: 0, explanation: 'Primary sector harvests natural resources directly.' },
            { question: 'Which sector covers banking, teaching, transport, and IT services?', options: ['Primary', 'Secondary', 'Tertiary', 'Agricultural'], correctIndex: 2, explanation: 'Tertiary sector provides services.' },
            { question: 'Investment in education and healthcare builds:', options: ['Physical debt', 'Human capital', 'Inflation', 'Fossil reserves'], correctIndex: 1, explanation: 'Healthy, educated citizens generate higher productivity.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(9, 'english', 'English', 'Languages', 'lavender', 'Tenses integration, determiners, reported speech, and analytical writing.', [
        {
          title: 'Integrated Grammar: Tenses & Modals',
          topics: ['Present/Past/Future Perfect', 'Gap filling & editing', 'Modals of necessity & deduction'],
          summary: 'Master Perfect and Perfect Continuous tenses and fix tense-consistency errors in editing passages.',
          objectives: ['Use has/have/had + V3 accurately', 'Use since (point of time) vs for (duration)'],
          studyNotes: [
            'Present Perfect (has/have + V3) links past action to present. Past Perfect (had + V3) describes the earlier of two past actions.',
            'Use "since" with a starting point (since 2020, since Monday) and "for" with a duration (for 3 hours).'
          ],
          revisionPoints: ['since = point of time', 'for = period of time', 'Earlier past action = had + V3'],
          practiceQuestions: [
            { question: 'Fill in: "The train ___ (leave) before we reached the station."', answer: 'had left.' },
            { question: 'Fill in: "She has been studying ___ 6 AM."', answer: 'since.' }
          ],
          quizQuestions: [
            { question: 'Fill in: "By the time the doctor arrived, the patient ___."', options: ['recovered', 'had recovered', 'has recovered', 'recovering'], correctIndex: 1, explanation: 'Earlier of two past events takes Past Perfect (had + V3).' },
            { question: 'Choose the right preposition: "We have lived in Pune ___ eight years."', options: ['since', 'for', 'from', 'by'], correctIndex: 1, explanation: '"eight years" is a duration, so use "for".' },
            { question: 'Identify the tense: "She has finished her science project."', options: ['Simple Past', 'Present Perfect', 'Past Perfect', 'Future Perfect'], correctIndex: 1, explanation: 'has + V3 is Present Perfect.' },
            { question: 'Fill in: "You ___ to respect your elders."', options: ['should', 'ought', 'must', 'can'], correctIndex: 1, explanation: 'Only "ought" is followed by "to" (ought to).' },
            { question: 'Error correction: "Neither of the boys were present." Replace "were" with:', options: ['are', 'was', 'have', 'had been'], correctIndex: 1, explanation: '"Neither" takes a singular verb (was).' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Subject-Verb Concord & Reported Speech',
          topics: ['Collective nouns & indefinite pronouns', 'Either/or, Neither/nor proximity rule', 'Reported commands & requests'],
          summary: 'Handle tricky subject-verb agreement rules and convert commands, requests, and exclamations into indirect speech.',
          objectives: ['Apply proximity rule with or/nor', 'Report imperatives with ordered/requested/advised + to'],
          studyNotes: [
            'With "either...or" or "neither...nor", the verb agrees with the nearest subject ("Neither the teacher nor the students WERE late").',
            'Imperatives in indirect speech: He said to me, "Open the door" -> He asked/told me to open the door.'
          ],
          revisionPoints: ['Each/Every/Neither/Everyone + Singular verb', 'Imperatives use to + V1 in indirect speech'],
          practiceQuestions: [
            { question: 'Fill in: "Bread and butter ___ his daily breakfast."', answer: 'is (treated as one single dish).' },
            { question: 'Report: The coach said to us, "Practise regularly."', answer: 'The coach advised us to practise regularly.' }
          ],
          quizQuestions: [
            { question: 'Fill in: "Each of the participants ___ given a certificate."', options: ['were', 'are', 'was', 'have'], correctIndex: 2, explanation: '"Each" is always singular -> was.' },
            { question: 'Fill in: "Neither Riya nor her friends ___ coming today."', options: ['is', 'are', 'was', 'has'], correctIndex: 1, explanation: 'Verb agrees with nearer plural noun "friends" -> are.' },
            { question: 'Indirect of: The doctor said to the patient, "Take rest."', options: ['The doctor advised the patient to take rest.', 'The doctor said take rest.', 'The doctor advised that take rest.', 'The doctor asked taking rest.'], correctIndex: 0, explanation: 'Imperative advice uses "advised ... to + V1".' },
            { question: 'Fill in: "Ten kilometres ___ a long distance to walk."', options: ['are', 'were', 'is', 'have'], correctIndex: 2, explanation: 'Single unit of distance/amount takes singular verb "is".' },
            { question: 'Fill in: "The jury ___ divided in their opinions."', options: ['was', 'were', 'is', 'has'], correctIndex: 1, explanation: 'When collective members act individually (divided), use plural "were".' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Descriptive Paragraph & Diary Entry',
          topics: ['Sensory details in descriptions', 'Diary entry format & tone', 'Short story elements'],
          summary: 'Craft vivid descriptive paragraphs about people, places, and events, and write expressive first-person diary entries.',
          objectives: ['Structure Diary Entries (Date, Day, Time, Salutation, Body, Name)', 'Build story plot (Setting, Conflict, Climax, Resolution)'],
          studyNotes: [
            'A Diary Entry uses informal, reflective first-person ("I") voice with Date, Day, and Time at top left.',
            'Good stories have a clear setting, rising action/conflict, turning point (climax), and satisfying resolution.'
          ],
          revisionPoints: ['Diary = 1st person reflective', 'Include Date, Day, Time', 'Show don’t just tell'],
          practiceQuestions: [
            { question: 'Which pronoun perspective is standard in a Diary Entry?', answer: 'First person ("I", "my", "we").' },
            { question: 'Name the four key stages of a short story plot.', answer: 'Introduction/Exposition, Rising Action, Climax, and Resolution.' }
          ],
          quizQuestions: [
            { question: 'A Diary Entry is written in which point of view?', options: ['Third person', 'First person', 'Second person', 'Passive only'], correctIndex: 1, explanation: 'Personal diaries express the writer’s own "I" reflections.' },
            { question: 'Which details appear at the top of a Diary Entry?', options: ['Subject line and Receiver address', 'Date, Day, and Time', 'Invoice number', 'Bibliography'], correctIndex: 1, explanation: 'Diaries begin with Date, Day, and Time.' },
            { question: 'What is the highest point of tension in a story called?', options: ['Setting', 'Climax', 'Prologue', 'Index'], correctIndex: 1, explanation: 'The climax is the decisive turning point.' },
            { question: 'Which sensory detail appeals to hearing?', options: ['Golden glow', 'Rustling of dry leaves', 'Bitter taste', 'Rough bark'], correctIndex: 1, explanation: '"Rustling" describes sound.' },
            { question: 'The concluding part where a story’s conflict is settled is:', options: ['Climax', 'Resolution', 'Dialogue', 'Foreshadowing'], correctIndex: 1, explanation: 'Resolution ties up loose ends.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(9, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'उपसर्ग-प्रत्यय, समास, अर्थ के आधार पर वाक्य भेद एवं अलंकार।', [
        {
          title: 'अर्थ के आधार पर वाक्य भेद',
          topics: ['विधानवाचक, निषेधवाचक, प्रश्नवाचक', 'विस्मयादिवाचक, आज्ञावाचक, इच्छावाचक, संदेहवाचक, संकेतवाचक'],
          summary: 'अर्थ के आधार पर वाक्य के आठों भेदों की पहचान और एक रूप से दूसरे रूप में परिवर्तन सीखें।',
          objectives: ['आठों वाक्य भेदों के उदाहरण पहचानना', 'विधानवाचक से निषेधवाचक बनाना'],
          studyNotes: [
            'अर्थ के आधार पर 8 भेद: विधानवाचक (सामान्य कथन), निषेधवाचक (नहीं), प्रश्नवाचक (?), आज्ञावाचक (आज्ञा/अनुरोध), इच्छावाचक (शुभकामना), संदेहवाचक (शायद), संकेतवाचक (शर्त: यदि...तो), विस्मयवाचक (!)।'
          ],
          revisionPoints: ['कुल 8 भेद', 'शायद = संदेहवाचक', 'यदि...तो = संकेतवाचक'],
          practiceQuestions: [
            { question: '"यदि वर्षा होती, तो फसल अच्छी होती।" किस भेद का वाक्य है?', answer: 'संकेतवाचक वाक्य।' },
            { question: '"ईश्वर तुम्हें दीर्घायु करे!" कौन-सा वाक्य भेद है?', answer: 'इच्छावाचक वाक्य।' }
          ],
          quizQuestions: [
            { question: 'अर्थ के आधार पर वाक्य के कितने भेद होते हैं?', options: ['3', '5', '8', '10'], correctIndex: 2, explanation: 'अर्थ के आधार पर आठ भेद होते हैं।' },
            { question: '"शायद आज शाम को बारिश हो।" यह वाक्य है:', options: ['संकेतवाचक', 'संदेहवाचक', 'विधानवाचक', 'इच्छावाचक'], correctIndex: 1, explanation: '"शायद" संभावना/संदेह दर्शाता है।' },
            { question: '"नववर्ष मंगलमय हो!" किस प्रकार का वाक्य है?', options: ['आज्ञावाचक', 'इच्छावाचक', 'विस्मयादिवाचक', 'निषेधवाचक'], correctIndex: 1, explanation: 'शुभकामना या आशीर्वाद इच्छावाचक वाक्य होते हैं।' },
            { question: '"यदि तुम परिश्रम करोगे तो सफल हो जाओगे।" यह है:', options: ['संकेतवाचक', 'संदेहवाचक', 'प्रश्नवाचक', 'विधानवाचक'], correctIndex: 0, explanation: 'एक क्रिया दूसरी पर निर्भर हो तो संकेतवाचक होता है।' },
            { question: '"शोर मत करो।" कौन-सा वाक्य है?', options: ['निषेधवाचक / आज्ञावाचक निषेध', 'प्रश्नवाचक', 'संदेहवाचक', 'इच्छावाचक'], correctIndex: 0, explanation: '"मत" नकारात्मक/निषेध दर्शाता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'शब्दालंकार एवं अर्थालंकार',
          topics: ['अनुप्रास, यमक, श्लेष', 'उपमा, रूपक, उत्प्रेक्षा, अतिशयोक्ति'],
          summary: 'काव्य सौंदर्य परखने के लिए यमक, श्लेष, रूपक और उत्प्रेक्षा अलंकारों के लक्षण पहचानें।',
          objectives: ['श्लेष व यमक में अंतर करना', 'उत्प्रेक्षा के वाचक शब्द (मानो, जनु) पहचानना'],
          studyNotes: [
            'यमक: एक शब्द दो या अधिक बार भिन्न अर्थों में ("काली घटा का घमंड घटा")। श्लेष: एक ही शब्द के अनेक अर्थ चिपके हों ("रहिमन पानी राखिए...")।',
            'उत्प्रेक्षा: उपमेय में उपमान की संभावना—"मानो, मनु, जानो, जनु" वाचक शब्द आते हैं।'
          ],
          revisionPoints: ['श्लेष = एक शब्द, अनेक अर्थ', 'रूपक = अभेद आरोप ("मैया मैं तो चंद्र-खिलौना लैहों")', 'मानो/जनु = उत्प्रेक्षा'],
          practiceQuestions: [
            { question: '"काली घटा का घमंड घटा" में कौन-सा अलंकार है?', answer: 'यमक अलंकार (पहला घटा = बादल, दूसरा घटा = कम हुआ)।' },
            { question: '"मैया मैं तो चंद्र-खिलौना लैहों" में अलंकार बताइए।', answer: 'रूपक अलंकार।' }
          ],
          quizQuestions: [
            { question: '"तीन बेर खाती थीं वे तीन बेर खाती हैं" में कौन-सा अलंकार है?', options: ['अनुप्रास', 'यमक', 'श्लेष', 'उपमा'], correctIndex: 1, explanation: '"बेर" दो बार भिन्न अर्थ (बार और फल) में प्रयुक्त है।' },
            { question: 'जहाँ एक शब्द एक ही बार आए परंतु उसके एक से अधिक अर्थ निकलें:', options: ['यमक', 'श्लेष', 'अनुप्रास', 'रूपक'], correctIndex: 1, explanation: 'श्लेष का अर्थ ही चिपका हुआ होता है।' },
            { question: '"मनु, मानो, जनु, जानो" किस अलंकार के वाचक शब्द हैं?', options: ['उपमा', 'रूपक', 'उत्प्रेक्षा', 'अतिशयोक्ति'], correctIndex: 2, explanation: 'ये शब्द संभावना (उत्प्रेक्षा) प्रकट करते हैं।' },
            { question: '"चरण-कमल बंदौ हरिराई" में कौन-सा अलंकार है?', options: ['उपमा', 'रूपक', 'यमक', 'अनुप्रास'], correctIndex: 1, explanation: 'चरण पर कमल का अभेद आरोप होने से रूपक अलंकार है।' },
            { question: '"हनुमान की पूँछ में लगन न पाई आग। लंका सिगरी जल गई..." में है:', options: ['श्लेष', 'अतिशयोक्ति', 'उपमा', 'अनुप्रास'], correctIndex: 1, explanation: 'किसी बात को बढ़ा-चढ़ाकर कहना अतिशयोक्ति अलंकार है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'समास एवं संवाद/लघुकथा लेखन',
          topics: ['तत्पुरुष, कर्मधारय, बहुव्रीहि', 'लघुकथा की संरचना'],
          summary: 'कर्मधारय व बहुव्रीहि समास के सूक्ष्म अंतर को समझें और शिक्षाप्रद लघुकथा लिखना सीखें।',
          objectives: ['नीलकंठ का कर्मधारय व बहुव्रीहि विग्रह अंतर जानना', 'लघुकथा के तत्व समझना'],
          studyNotes: [
            'कर्मधारय में विशेषण-विशेष्य संबंध होता है (नीलकमल = नीला है जो कमल)। बहुव्रीहि में दोनों पद मिलकर किसी तीसरे विशेष अर्थ की ओर संकेत करते हैं (दशानन = दस हैं आनन जिसके अर्थात रावण)।'
          ],
          revisionPoints: ['तीसरा विशेष अर्थ = बहुव्रीहि', 'विशेषण-विशेष्य = कर्मधारय'],
          practiceQuestions: [
            { question: '"पीतांबर" का बहुव्रीहि विग्रह क्या होगा?', answer: 'पीला है अंबर जिसका (श्रीकृष्ण / विष्णु)।' },
            { question: '"लंबोदर" में कौन-सा समास है?', answer: 'बहुव्रीहि समास (गणेश जी)।' }
          ],
          quizQuestions: [
            { question: '"गजानन" (गज के समान आनन है जिसका - गणेश) में कौन-सा समास है?', options: ['द्विगु', 'द्वंद्व', 'बहुव्रीहि', 'अव्ययीभाव'], correctIndex: 2, explanation: 'तीसरे विशेष व्यक्ति (गणेश) की ओर संकेत करने से बहुव्रीहि समास है।' },
            { question: '"यथाशक्ति" (शक्ति के अनुसार) किस समास का उदाहरण है?', options: ['अव्ययीभाव', 'तत्पुरुष', 'द्विगु', 'द्वंद्व'], correctIndex: 0, explanation: 'प्रथम पद "यथा" अव्यय होने से अव्ययीभाव समास है।' },
            { question: '"नीलकमल" (नीला है जो कमल) में समास है:', options: ['कर्मधारय', 'द्विगु', 'द्वंद्व', 'अव्ययीभाव'], correctIndex: 0, explanation: 'विशेषण (नील) और विशेष्य (कमल) का संबंध कर्मधारय है।' },
            { question: '"दशानन" का सही विग्रह है:', options: ['दस और आनन', 'दस हैं आनन जिसके (रावण)', 'दस आननों का घर', 'नया आनन'], correctIndex: 1, explanation: 'दशानन बहुव्रीहि समास है।' },
            { question: 'अव्ययीभाव समास में कौन-सा पद प्रधान होता है?', options: ['उत्तर पद', 'पूर्व (प्रथम) पद', 'दोनों पद', 'तीसरा पद'], correctIndex: 1, explanation: 'अव्ययीभाव में पहला पद अव्यय एवं प्रधान होता है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(9, 'it', 'Information Technology (IT)', 'Technology', 'lavender', 'IT/ITeS fundamentals, Calc spreadsheets, Impress presentations, and digital documentation.', [
        {
          title: 'Introduction to IT–ITeS Industry',
          topics: ['IT vs ITeS / BPO', 'E-Governance & E-Banking', 'IT in Healthcare & Education'],
          summary: 'Explore how Information Technology and IT-enabled Services power banking, healthcare, education, and governance in India.',
          objectives: ['Distinguish IT and ITeS', 'List real-world e-Governance portals'],
          studyNotes: [
            'IT deals with creating, managing, and exchanging information via computers/networks. ITeS uses IT to improve service quality (BPO, call centres, telemedicine).',
            'LMS (Learning Management Systems) and ICT tools enable interactive classrooms and offline learning packages.'
          ],
          revisionPoints: ['ITeS = IT-enabled Services', 'ICT = Information & Communication Technology', 'MRI/ECG use IT in healthcare'],
          practiceQuestions: [
            { question: 'What does BPO stand for?', answer: 'Business Process Outsourcing.' },
            { question: 'Give two uses of IT in banking.', answer: 'Online fund transfers (UPI/NEFT) and ATM cash dispensing.' }
          ],
          quizQuestions: [
            { question: 'What does ITeS stand for?', options: ['Internet Technical Systems', 'Information Technology enabled Services', 'Internal Text Editing Service', 'Integrated Telecom System'], correctIndex: 1, explanation: 'ITeS covers services delivered using IT.' },
            { question: 'Which medical imaging technology relies heavily on computer processing?', options: ['Stethoscope', 'MRI & CT Scan', 'Mercury thermometer', 'Bandage'], correctIndex: 1, explanation: 'CT and MRI scanners reconstruct 3D body images using computers.' },
            { question: 'Online portals where citizens apply for passports or certificates are examples of:', options: ['E-Gaming', 'E-Governance', 'E-Waste', 'BPO'], correctIndex: 1, explanation: 'E-Governance delivers public services digitally.' },
            { question: 'What does LMS stand for in education?', options: ['Local Mail Server', 'Learning Management System', 'Linear Math Software', 'Large Memory Storage'], correctIndex: 1, explanation: 'Platforms like Indo American School Portal are Learning Management Systems.' },
            { question: 'ATM machines belong to IT applications in:', options: ['Agriculture', 'Banking & Finance', 'Meteorology', 'Textiles'], correctIndex: 1, explanation: 'ATMs connect to bank networks for 24/7 transactions.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Data Entry, Keyboarding & Touch Typing',
          topics: ['Home row keys (ASDF JKL;)', 'Typing speed (WPM) & accuracy', 'Ergonomic posture'],
          summary: 'Build fast, accurate touch typing without looking at the keyboard using proper home-row finger placement.',
          objectives: ['Identify home row keys', 'Calculate WPM and accuracy'],
          studyNotes: [
            'Left fingers rest on A-S-D-F; right fingers rest on J-K-L-; with thumbs on Spacebar.',
            'Touch typing avoids eye strain and increases speed measured in Words Per Minute (WPM).'
          ],
          revisionPoints: ['Home row = ASDF JKL;', 'F and J have raised bumps for index fingers', '90° elbow posture prevents strain'],
          practiceQuestions: [
            { question: 'Which two keys have small raised bumps to guide fingers without looking?', answer: 'F and J.' },
            { question: 'How is typing speed commonly measured?', answer: 'WPM (Words Per Minute).' }
          ],
          quizQuestions: [
            { question: 'Which keys make up the Home Row on a QWERTY keyboard?', options: ['Q W E R T Y', 'A S D F and J K L ;', 'Z X C V B N', '1 2 3 4 5 6'], correctIndex: 1, explanation: 'Fingers rest on ASDF and JKL;.' },
            { question: 'Which two keys carry tactile bumps for your index fingers?', options: ['A and S', 'F and J', 'G and H', 'Q and P'], correctIndex: 1, explanation: 'F and J help align hands blindly.' },
            { question: 'Which fingers press the Spacebar in touch typing?', options: ['Little fingers', 'Thumbs', 'Index fingers', 'Ring fingers'], correctIndex: 1, explanation: 'Thumbs handle the Spacebar.' },
            { question: 'What does WPM measure?', options: ['Watts Per Minute', 'Words Per Minute', 'Windows Per Monitor', 'Web Pages Managed'], correctIndex: 1, explanation: 'Words Per Minute measures typing speed.' },
            { question: 'For healthy ergonomics, your monitor top should be:', options: ['Far below chest', 'At or slightly below eye level', 'Behind you', 'Tilted flat'], correctIndex: 1, explanation: 'Eye-level alignment prevents neck strain.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Electronic Spreadsheets: Cell Referencing & Mail Merge',
          topics: ['Relative vs Absolute referencing ($A$1)', 'COUNT, IF functions', 'Mail Merge in Writer'],
          summary: 'Automate mark sheets with absolute cell references ($) and conditional IF formulas, and send bulk personalized letters via Mail Merge.',
          objectives: ['Use $A$1 to lock cell references', 'Explain Data Source + Main Document in Mail Merge'],
          studyNotes: [
            'Relative reference (A1) changes when copied; Absolute reference ($A$1) stays locked when dragged across cells.',
            'Mail Merge combines a Main Document (letter template) with a Data Source (names/addresses list) to produce personalized letters.'
          ],
          revisionPoints: ['$ locks row or column', '=IF(cond, trueVal, falseVal)', 'Mail Merge = Main Doc + Data Source'],
          practiceQuestions: [
            { question: 'What is the purpose of the $ sign in $B$2?', answer: 'It makes B2 an absolute reference so it does not change when copied.' },
            { question: 'Write an IF formula to show "Pass" if A1 >= 33 else "Fail".', answer: '=IF(A1>=33, "Pass", "Fail").' }
          ],
          quizQuestions: [
            { question: 'Which reference stays fixed when a formula is copied to other cells?', options: ['A1', '$A$1', 'A$1 (row fixed only)', 'B2'], correctIndex: 1, explanation: '$ before both column and row creates an absolute reference.' },
            { question: 'Mail Merge combines a Main Document with a:', options: ['Slide Master', 'Data Source', 'Macro', 'Firewall'], correctIndex: 1, explanation: 'Data Source supplies recipient fields like Name and Address.' },
            { question: 'Which function counts only cells containing numbers?', options: ['COUNTA', 'COUNT', 'SUM', 'LEN'], correctIndex: 1, explanation: 'COUNT tallies numeric cells; COUNTA counts all non-empty cells.' },
            { question: 'What will =IF(45>=33, "Pass", "Fail") display?', options: ['Fail', 'Pass', '45', 'Error'], correctIndex: 1, explanation: '45 >= 33 is true, returning "Pass".' },
            { question: 'Mixed cell referencing locks:', options: ['Both row and column', 'Either row OR column, not both', 'Neither', 'Entire workbook'], correctIndex: 1, explanation: 'Examples like $A1 or A$1 lock one dimension.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 10 ====================
  {
    classNumber: 10,
    label: 'Class 10',
    stage: 'Secondary (Classes 9–10)',
    subjects: [
      makeSubject(10, 'math', 'Mathematics', 'Mathematics', 'blue', 'Real Numbers, Quadratics, Trigonometry, Coordinate Geometry, and Statistics.', [
        {
          title: 'Real Numbers & Quadratic Equations',
          topics: ['Fundamental Theorem of Arithmetic', 'HCF × LCM = a × b', 'Quadratic formula & discriminant (b² − 4ac)'],
          summary: 'Apply prime factorization to find HCF/LCM and determine nature of roots of quadratic equations using the discriminant.',
          objectives: ['Verify HCF × LCM = Product of two numbers', 'Classify roots via D = b² − 4ac'],
          studyNotes: [
            'Fundamental Theorem of Arithmetic: Every composite number can be uniquely factorized into primes (ignoring order).',
            'For ax² + bx + c = 0, Discriminant D = b² − 4ac. D > 0 -> 2 distinct real roots; D = 0 -> 2 equal real roots; D < 0 -> no real roots.'
          ],
          revisionPoints: ['HCF(a,b) × LCM(a,b) = a × b', 'D = b² − 4ac', 'x = (-b ± √D) / 2a'],
          practiceQuestions: [
            { question: 'Find HCF and LCM of 12 and 18 and verify their product.', answer: 'HCF = 6, LCM = 36. 6 × 36 = 216 = 12 × 18.' },
            { question: 'Find the discriminant of 2x² − 4x + 2 = 0 and nature of roots.', answer: 'D = (-4)² − 4(2)(2) = 16 − 16 = 0 -> Two equal real roots.' }
          ],
          quizQuestions: [
            { question: 'If HCF(26, 91) = 13, what is LCM(26, 91)?', options: ['182', '364', '91', '260'], correctIndex: 0, explanation: 'LCM = (26 × 91) / 13 = 2 × 91 = 182.' },
            { question: 'A quadratic equation ax² + bx + c = 0 has two equal real roots when:', options: ['b² − 4ac > 0', 'b² − 4ac = 0', 'b² − 4ac < 0', 'a = 0'], correctIndex: 1, explanation: 'Zero discriminant yields repeated real roots x = -b/(2a).' },
            { question: 'For x² − 5x + 6 = 0, what is the sum of its roots?', options: ['-5', '5', '6', '-6'], correctIndex: 1, explanation: 'Sum of roots = -b/a = -(-5)/1 = 5.' },
            { question: 'What is the exponent of 2 in the prime factorization of 144?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: '144 = 16 × 9 = 2⁴ × 3².' },
            { question: 'If D < 0 for a quadratic equation, then the equation has:', options: ['Two distinct real roots', 'Equal real roots', 'No real roots', 'Infinite roots'], correctIndex: 2, explanation: 'Square root of a negative number is not real.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Introduction to Trigonometry',
          topics: ['sin, cos, tan ratios', 'Standard angles (0°, 30°, 45°, 60°, 90°)', 'sin²θ + cos²θ = 1'],
          summary: 'Master right-triangle trigonometric ratios, standard angle values, and the three Pythagorean trigonometric identities.',
          objectives: ['Recall exact values for 0°, 30°, 45°, 60°, 90°', 'Prove identities using sin²θ + cos²θ = 1'],
          studyNotes: [
            'In a right triangle: sinθ = Opposite / Hypotenuse, cosθ = Adjacent / Hypotenuse, tanθ = sinθ / cosθ = Opposite / Adjacent.',
            'Three fundamental identities: sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ.'
          ],
          revisionPoints: ['sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2', 'tan 45° = 1', 'sin²θ + cos²θ = 1'],
          practiceQuestions: [
            { question: 'Evaluate 2 tan²45° + cos²30° − sin²60°.', answer: '2(1)² + (√3/2)² − (√3/2)² = 2.' },
            { question: 'If sin A = 3/5, find cos A.', answer: 'cos A = √(1 − 9/25) = √(16/25) = 4/5.' }
          ],
          quizQuestions: [
            { question: 'What is the value of sin 30° + cos 60°?', options: ['0', '1/2', '1', '√3'], correctIndex: 2, explanation: '1/2 + 1/2 = 1.' },
            { question: 'Evaluate 9 sec²A − 9 tan²A:', options: ['1', '9', '8', '0'], correctIndex: 1, explanation: '9(sec²A − tan²A) = 9(1) = 9.' },
            { question: 'If tan θ = 1, then θ (acute) equals:', options: ['0°', '30°', '45°', '60°'], correctIndex: 2, explanation: 'tan 45° = 1.' },
            { question: 'What is sin²45° + cos²45°?', options: ['0', '1/2', '1', '2'], correctIndex: 2, explanation: 'sin²θ + cos²θ = 1 for every angle θ.' },
            { question: 'What is the value of cos 90°?', options: ['1', '0', '1/2', 'Not defined'], correctIndex: 1, explanation: 'cos 90° = 0.' }
          ],
          diagramType: 'geometry-shapes'
        },
        {
          title: 'Statistics & Probability',
          topics: ['Mean, Median, Mode of grouped data', 'Empirical relation: 3 Median = Mode + 2 Mean', 'Classical probability P(E)'],
          summary: 'Compute Mean, Median, and Mode for grouped class intervals and solve probability problems with cards, dice, and coins.',
          objectives: ['Use empirical relationship between Mean, Median, Mode', 'Compute P(E) + P(not E) = 1'],
          studyNotes: [
            'Empirical formula: Mode = 3 Median − 2 Mean.',
            'Probability P(E) = Favourable outcomes / Total equally likely outcomes. Always 0 ≤ P(E) ≤ 1.'
          ],
          revisionPoints: ['3 Median = Mode + 2 Mean', '0 ≤ P(E) ≤ 1', 'P(not E) = 1 − P(E)'],
          practiceQuestions: [
            { question: 'If P(E) = 0.05, what is the probability of "not E"?', answer: '1 − 0.05 = 0.95.' },
            { question: 'A die is thrown once. Find the probability of getting a prime number.', answer: 'Primes = {2, 3, 5} -> 3/6 = 1/2.' }
          ],
          quizQuestions: [
            { question: 'Which of the following CANNOT be the probability of an event?', options: ['2/3', '-0.5', '15%', '0.7'], correctIndex: 1, explanation: 'Probability can never be negative.' },
            { question: 'If Mean = 20 and Mode = 26, find the Median using empirical relation:', options: ['22', '24', '23', '21'], correctIndex: 0, explanation: '3 Median = 26 + 2(20) = 66 -> Median = 22.' },
            { question: 'A fair die is tossed once. Probability of getting an even number is:', options: ['1/6', '1/3', '1/2', '2/3'], correctIndex: 2, explanation: 'Even outcomes {2, 4, 6}: 3/6 = 1/2.' },
            { question: 'The sum of probabilities of all elementary events of an experiment is:', options: ['0', '0.5', '1', '100'], correctIndex: 2, explanation: 'Total probability always equals 1.' },
            { question: 'A bag has 3 red and 5 blue balls. Probability of drawing a red ball is:', options: ['3/5', '3/8', '5/8', '1/3'], correctIndex: 1, explanation: '3 red out of 8 total balls = 3/8.' }
          ],
          diagramType: 'math-numberline'
        }
      ]),
      makeSubject(10, 'science', 'Science', 'Science', 'mint', 'Chemical Reactions, Life Processes, and Electricity & Ohm’s Law.', [
        {
          title: 'Chemical Reactions and Equations',
          topics: ['Balancing chemical equations', 'Combination, Decomposition, Displacement, Double Displacement', 'Oxidation & Reduction (Redox)'],
          summary: 'Balance chemical equations systematically and classify reactions including redox, corrosion, and rancidity.',
          objectives: ['Balance equations conserving atoms', 'Identify oxidizing and reducing agents'],
          studyNotes: [
            'Types: Combination (A + B -> AB), Decomposition (AB -> A + B), Displacement (Zn + CuSO4 -> ZnSO4 + Cu), Double Displacement (precipitation).',
            'OIL RIG: Oxidation Is Loss of electrons (or gain of oxygen); Reduction Is Gain of electrons (or loss of oxygen).'
          ],
          revisionPoints: ['Balance atoms on LHS & RHS', 'Respiration is exothermic', 'Nitrogen flushing prevents chip rancidity'],
          practiceQuestions: [
            { question: 'Why is respiration considered an exothermic process?', answer: 'Because glucose reacts with oxygen in cells to release heat/ATP energy.' },
            { question: 'Why are potato chip bags flushed with nitrogen gas?', answer: 'To displace oxygen and prevent oxidation (rancidity) of oils.' }
          ],
          quizQuestions: [
            { question: 'In Zn + CuSO4 -> ZnSO4 + Cu, which type of reaction occurs?', options: ['Combination', 'Decomposition', 'Displacement', 'Double displacement'], correctIndex: 2, explanation: 'More reactive Zinc displaces Copper from CuSO4.' },
            { question: 'Which gas is used to flush snack packets to prevent rancidity?', options: ['Oxygen', 'Nitrogen', 'Chlorine', 'Hydrogen'], correctIndex: 1, explanation: 'Inert nitrogen prevents fat oxidation.' },
            { question: 'Gain of oxygen or loss of hydrogen is called:', options: ['Reduction', 'Oxidation', 'Neutralization', 'Sublimation'], correctIndex: 1, explanation: 'Adding oxygen is oxidation.' },
            { question: 'Breaking down CaCO3 by heating into CaO + CO2 is:', options: ['Thermal decomposition', 'Combination', 'Displacement', 'Redox only'], correctIndex: 0, explanation: 'One reactant breaks into two products using heat.' },
            { question: 'In balanced 2H2 + O2 -> 2H2O, total oxygen atoms on each side equal:', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'O2 has 2 atoms; 2H2O has 2 oxygen atoms.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Life Processes (Nutrition, Respiration, Transport, Excretion)',
          topics: ['Autotrophic & Human digestion', 'Aerobic vs Anaerobic respiration', 'Double circulation in human heart', 'Nephron filtration'],
          summary: 'Understand how organisms acquire nutrition, release energy as ATP, pump blood through a 4-chambered heart, and filter wastes.',
          objectives: ['Compare aerobic vs anaerobic respiration', 'Trace blood flow in human heart & xylem/phloem transport'],
          studyNotes: [
            'Aerobic respiration uses O2 to produce 38 ATP + CO2 + H2O; anaerobic in yeast yields ethanol + CO2; in tired muscles yields lactic acid.',
            'Human heart has 4 chambers ensuring oxygenated and deoxygenated blood never mix (double circulation). Kidneys filter blood via nephrons.'
          ],
          revisionPoints: ['Xylem = water (upward); Phloem = food (bidirectional)', 'Nephron = kidney functional unit', 'Stomata open/close via guard cells'],
          practiceQuestions: [
            { question: 'What is the functional filtration unit of the human kidney?', answer: 'Nephron.' },
            { question: 'Why do ventricles have thicker muscular walls than atria?', answer: 'Ventricles pump blood under high pressure to the lungs and entire body.' }
          ],
          quizQuestions: [
            { question: 'Which tissue transports prepared food from leaves to other plant parts?', options: ['Xylem', 'Phloem', 'Guard cell', 'Cortex'], correctIndex: 1, explanation: 'Phloem translocates sucrose/food throughout the plant.' },
            { question: 'What causes muscle cramps during sudden vigorous exercise?', options: ['Ethanol buildup', 'Lactic acid buildup', 'Oxygen excess', 'Starch buildup'], correctIndex: 1, explanation: 'Anaerobic breakdown of pyruvate in muscle cells produces lactic acid.' },
            { question: 'The filtration unit of the kidney is the:', options: ['Neuron', 'Nephron', 'Alveolus', 'Villus'], correctIndex: 1, explanation: 'Each kidney has over a million filtering nephrons.' },
            { question: 'How many chambers are in the human heart?', options: ['2', '3', '4', '6'], correctIndex: 2, explanation: 'Two atria and two ventricles (4 chambers).' },
            { question: 'Which enzyme in saliva begins digesting starch?', options: ['Pepsin', 'Trypsin', 'Salivary amylase', 'Lipase'], correctIndex: 2, explanation: 'Salivary amylase breaks starch into simple sugars.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Electricity: Ohm’s Law, Circuits & Power',
          topics: ['Current I = Q/t & Voltage V = W/Q', 'Ohm’s Law V = IR', 'Series vs Parallel resistors', 'Electric Power P = VI'],
          summary: 'Master electric current, potential difference, Ohm’s law, equivalent resistance in series and parallel, and Joule heating.',
          objectives: ['Calculate equivalent resistance in series and parallel', 'Solve problems using V = IR, P = VI, H = I²Rt'],
          studyNotes: [
            'Ohm’s Law: At constant temperature, V = I × R (R in Ohms Ω).',
            'Series: R_s = R1 + R2 (same current). Parallel: 1/R_p = 1/R1 + 1/R2 (same voltage, preferred in household wiring).'
          ],
          revisionPoints: ['V = IR', 'P = VI = I²R = V²/R', '1 kWh = 3.6 × 10⁶ Joules'],
          practiceQuestions: [
            { question: 'Two 6 Ω resistors are connected in parallel. Find equivalent resistance.', answer: '1/R = 1/6 + 1/6 = 2/6 = 1/3 -> R = 3 Ω.' },
            { question: 'Why are household appliances wired in parallel?', answer: 'Each gets full 220 V supply and operates independently with its own switch.' }
          ],
          quizQuestions: [
            { question: 'What is the SI unit of electrical resistance?', options: ['Ampere', 'Volt', 'Ohm (Ω)', 'Watt'], correctIndex: 2, explanation: 'Resistance is measured in Ohms (Ω).' },
            { question: 'A potential difference of 12 V drives 2 A current through a resistor. Find R:', options: ['24 Ω', '6 Ω', '10 Ω', '14 Ω'], correctIndex: 1, explanation: 'R = V / I = 12 / 2 = 6 Ω.' },
            { question: 'Two resistors of 4 Ω and 6 Ω are in series. Total resistance is:', options: ['2.4 Ω', '10 Ω', '24 Ω', '5 Ω'], correctIndex: 1, explanation: 'In series, resistances add: 4 + 6 = 10 Ω.' },
            { question: 'Which device measures electric current in a circuit (connected in series)?', options: ['Voltmeter', 'Ammeter', 'Galvanometer only', 'Rheostat'], correctIndex: 1, explanation: 'Ammeters are wired in series to measure amperes.' },
            { question: '1 kilowatt-hour (kWh) equals:', options: ['3.6 × 10³ J', '3.6 × 10⁶ J', '1000 J', '60 J'], correctIndex: 1, explanation: '1000 W × 3600 s = 3.6 × 10⁶ Joules.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(10, 'sst', 'Social Science', 'Social Science', 'peach', 'Nationalism in India, Resources & Development, Power Sharing, and Economic Development.', [
        {
          title: 'Nationalism in India (1915–1947)',
          topics: ['Satyagraha & Non-Cooperation', 'Salt March & Civil Disobedience', 'Sense of collective belonging'],
          summary: 'Trace India’s freedom struggle under Mahatma Gandhi—from Champaran and Non-Cooperation to the Dandi Salt March and Quit India.',
          objectives: ['Analyze Non-Cooperation vs Civil Disobedience', 'Explain significance of the 1930 Salt March'],
          studyNotes: [
            'Mahatma Gandhi returned to India in 1915 and led Satyagraha in Champaran (1917), Kheda, and Ahmedabad.',
            'Jallianwala Bagh massacre (13 April 1919) galvanized resistance. In 1930, Gandhi walked 240 miles from Sabarmati to Dandi to break the Salt Law.'
          ],
          revisionPoints: ['1920: Non-Cooperation', '1930: Dandi Salt March', '1929 Lahore Session: Purna Swaraj'],
          practiceQuestions: [
            { question: 'Why did Mahatma Gandhi choose salt as a symbol for Civil Disobedience?', answer: 'Salt was used by rich and poor alike, making the British salt tax a universal symbol of oppression.' },
            { question: 'When was Purna Swaraj (complete independence) declared at Lahore?', answer: 'December 1929 under Jawaharlal Nehru’s presidency.' }
          ],
          quizQuestions: [
            { question: 'In which year did the Jallianwala Bagh tragedy occur in Amritsar?', options: ['1915', '1919', '1922', '1930'], correctIndex: 1, explanation: 'It took place on 13 April 1919.' },
            { question: 'Where did Mahatma Gandhi break the British Salt Law in April 1930?', options: ['Champaran', 'Dandi', 'Chauri Chaura', 'Kheda'], correctIndex: 1, explanation: 'Gandhi marched from Sabarmati Ashram to coastal Dandi.' },
            { question: 'Why was the Non-Cooperation Movement called off in February 1922?', options: ['Salt tax ended', 'Chauri Chaura violence', 'World War II began', 'Simon Commission arrived'], correctIndex: 1, explanation: 'Violence at Chauri Chaura led Gandhi to halt the movement.' },
            { question: 'Who led the Lahore Congress Session of 1929 declaring Purna Swaraj?', options: ['Motilal Nehru', 'Jawaharlal Nehru', 'Subhas Chandra Bose', 'Sardar Patel'], correctIndex: 1, explanation: 'Jawaharlal Nehru presided over the 1929 Lahore session.' },
            { question: 'The Poona Pact (1932) was signed between Mahatma Gandhi and:', options: ['Lord Irwin', 'Dr. B.R. Ambedkar', 'Muhammad Ali Jinnah', 'Lala Lajpat Rai'], correctIndex: 1, explanation: 'Poona Pact provided reserved seats for Depressed Classes within general electorates.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'Resources, Soil Types & Power Sharing',
          topics: ['Alluvial, Black, Red, Laterite soils', 'Federalism & Power Sharing', 'Vertical & horizontal power sharing'],
          summary: 'Examine India’s soil diversity alongside democratic power sharing between Union, State, and Local governments.',
          objectives: ['Match Indian soils to crops', 'Distinguish horizontal vs vertical power sharing'],
          studyNotes: [
            'Horizontal power sharing: Legislature, Executive, Judiciary (checks & balances). Vertical power sharing: Union -> State -> Panchayati Raj.',
            'Alluvial soil (Northern Plains) supports wheat/rice; Black soil supports cotton; Laterite supports tea/coffee/cashew.'
          ],
          revisionPoints: ['Horizontal = checks & balances', 'Vertical = federalism', '73rd/74th Amendments strengthened local government'],
          practiceQuestions: [
            { question: 'Give one prudential reason for power sharing.', answer: 'It reduces the risk of conflict between social groups and ensures political stability.' },
            { question: 'What is Bangar vs Khadar alluvial soil?', answer: 'Bangar is old less-fertile alluvium; Khadar is new, finer, more fertile flood-plain alluvium.' }
          ],
          quizQuestions: [
            { question: 'Power shared among Legislature, Executive, and Judiciary is called:', options: ['Vertical division', 'Horizontal distribution', 'Unitary rule', 'Coalition'], correctIndex: 1, explanation: 'All three organs sit at the same level checking each other.' },
            { question: 'Which newer alluvial soil is more fertile and renewed by floods?', options: ['Bangar', 'Khadar', 'Laterite', 'Arid'], correctIndex: 1, explanation: 'Khadar has finer particles and higher fertility.' },
            { question: 'How many languages are listed in the Eighth Schedule of the Indian Constitution?', options: ['14', '18', '22', '28'], correctIndex: 2, explanation: '22 Scheduled Languages are recognized.' },
            { question: 'Which Constitutional Amendment mandated regular Panchayati Raj elections?', options: ['42nd', '73rd (1992)', '86th', '101st'], correctIndex: 1, explanation: 'The 73rd Amendment empowered rural local bodies.' },
            { question: 'Which soil develops in areas of high temperature and heavy rainfall due to leaching?', options: ['Black soil', 'Laterite soil', 'Alluvial soil', 'Desert soil'], correctIndex: 1, explanation: 'Intense rain leaches away nutrients forming laterite soil.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'Development, Sectors & Money/Credit',
          topics: ['Per Capita Income & HDI', 'Organized vs Unorganized sector', 'Formal vs Informal credit & RBI'],
          summary: 'Compare income vs human development indicators (literacy, health), analyze GDP sectors, and understand RBI’s role in formal banking.',
          objectives: ['Explain why HDI beats income alone', 'Compare formal bank loans vs informal moneylenders'],
          studyNotes: [
            'Per Capita Income = Total Income / Total Population. UNDP uses Human Development Index (HDI): Income + Education + Health (Life Expectancy).',
            'RBI supervises formal banks and mandates priority-sector lending. Collateral is an asset pledged against a loan.'
          ],
          revisionPoints: ['HDI = Income + Health + Education', 'RBI issues currency & supervises banks', 'SHGs empower rural women with low-cost credit'],
          practiceQuestions: [
            { question: 'What is collateral?', answer: 'An asset (land, building, vehicle, deposit) owned by the borrower used as a guarantee until the loan is repaid.' },
            { question: 'Why is formal credit better than informal moneylenders?', answer: 'Banks charge lower, regulated interest rates and follow transparent RBI rules.' }
          ],
          quizQuestions: [
            { question: 'Which organization publishes the Human Development Report (HDI)?', options: ['WTO', 'UNDP', 'RBI', 'IMF'], correctIndex: 1, explanation: 'United Nations Development Programme (UNDP) publishes HDI.' },
            { question: 'In India, who issues currency notes and supervises formal banks?', options: ['SBI', 'Reserve Bank of India (RBI)', 'SEBI', 'NITI Aayog'], correctIndex: 1, explanation: 'RBI is India’s central bank.' },
            { question: 'An asset pledged by a borrower as a guarantee to a lender is:', options: ['Dividend', 'Collateral', 'Barter', 'Subsidy'], correctIndex: 1, explanation: 'Collateral secures the loan.' },
            { question: 'Which problem does the use of money eliminate in a barter system?', options: ['Inflation', 'Double coincidence of wants', 'Taxation', 'Savings'], correctIndex: 1, explanation: 'Money removes the need for both parties to want each other’s exact goods.' },
            { question: 'Self-Help Groups (SHGs) primarily help rural borrowers by:', options: ['Charging 60% interest', 'Pooling small savings and providing collateral-free loans', 'Printing currency', 'Selling imports'], correctIndex: 1, explanation: 'SHGs pool savings to grant affordable group-backed loans.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(10, 'english', 'English', 'Languages', 'lavender', 'Board grammar mastery, analytical paragraphs, formal complaint/enquiry letters.', [
        {
          title: 'Board Grammar Mastery (Editing & Cloze)',
          topics: ['Tense consistency', 'Determiners & Modals', 'Subject-Verb Concord', 'Reported Speech'],
          summary: 'Sharpen accuracy for CBSE Class 10 integrated grammar tasks: gap filling, error-correction, and dialogue reporting.',
          objectives: ['Spot and fix common agreement/tense errors', 'Transform dialogues into reported paragraphs'],
          studyNotes: [
            'Check verb tense continuity across the entire passage before filling blanks.',
            'For dialogue reporting, replace "asked me" with "if/whether" for Yes/No questions and keep statement order (Subject + Verb).'
          ],
          revisionPoints: ['Yes/No reported question -> if/whether', 'Many a + singular noun + singular verb', 'As well as -> verb matches 1st subject'],
          practiceQuestions: [
            { question: 'Fill in: "The captain, along with his players, ___ arrived."', answer: 'has (verb agrees with first subject "captain").' },
            { question: 'Convert: Priya asked Rohit, "Did you submit the assignment?"', answer: 'Priya asked Rohit if he had submitted the assignment.' }
          ],
          quizQuestions: [
            { question: 'Fill in: "The Prime Minister, as well as the cabinet ministers, ___ present."', options: ['were', 'are', 'was', 'have'], correctIndex: 2, explanation: '"as well as" follows the first subject (Prime Minister -> singular).' },
            { question: 'Indirect of: He said to me, "Have you read this book?"', options: ['He asked me if I had read that book.', 'He asked me had I read this book.', 'He told me if I read that book.', 'He asked me if I have read this book.'], correctIndex: 0, explanation: 'Present perfect backshifts to past perfect; "this" becomes "that".' },
            { question: 'Spot the correct sentence:', options: ['One of my friend live in Delhi.', 'One of my friends lives in Delhi.', 'One of my friends live in Delhi.', 'One of my friend lives in Delhi.'], correctIndex: 1, explanation: '"One of + plural noun + singular verb".' },
            { question: 'Fill in: "By next June, she ___ her board exams."', options: ['completes', 'will have completed', 'completed', 'is completing'], correctIndex: 1, explanation: '"By + future time" calls for Future Perfect (will have + V3).' },
            { question: 'Fill in: "Hardly had I stepped out ___ it began to rain."', options: ['than', 'when', 'then', 'while'], correctIndex: 1, explanation: '"Hardly/Scarcely" pairs with "when" (not "than").' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Analytical Paragraph Writing',
          topics: ['Interpreting bar charts, pie charts, tables', 'Comparative trend vocabulary', 'Introduction, Body, Conclusion'],
          summary: 'Transform visual data from charts and tables into crisp, objective 120-word analytical paragraphs for Board exams.',
          objectives: ['Synthesize highs, lows, and trends objectively', 'Avoid personal opinion in data analysis'],
          studyNotes: [
            'Structure: 1-sentence Topic Introduction (what the chart shows) -> Body comparing highest, lowest, and key trends with exact figures -> 1-sentence overall conclusion.',
            'Use objective connectors: "In contrast", "Notably", "Accounted for", "Outperformed".'
          ],
          revisionPoints: ['Stick strictly to given data', 'Quote exact figures/percentages', 'Word limit: ~100–120 words'],
          practiceQuestions: [
            { question: 'Should an analytical paragraph include personal stories or opinions?', answer: 'No, it must remain objective and strictly cite trends from the given data.' },
            { question: 'Name three comparison phrases useful in data analysis.', answer: '"Significantly higher than", "In sharp contrast to", "Accounted for the largest share".' }
          ],
          quizQuestions: [
            { question: 'What is the ideal length of a Class 10 CBSE analytical paragraph?', options: ['20–30 words', '100–120 words', '400–500 words', '10 words'], correctIndex: 1, explanation: 'CBSE specifies 100–120 words.' },
            { question: 'Which tone is appropriate for an analytical paragraph?', options: ['Poetic and emotional', 'Objective and factual', 'Humorous', 'Conversational slang'], correctIndex: 1, explanation: 'Data interpretation requires neutral, factual language.' },
            { question: 'Which section summarizes the overall takeaway without introducing new data?', options: ['Salutation', 'Conclusion sentence', 'Subject line', 'Title only'], correctIndex: 1, explanation: 'The final sentence gives a concise synthesis.' },
            { question: 'When describing a steady upward line on a graph, use:', options: ['Plummeted sharply', 'Rose steadily', 'Fluctuated wildly', 'Remained stagnant'], correctIndex: 1, explanation: '"Rose steadily" accurately describes consistent growth.' },
            { question: 'An analytical paragraph is always written in:', options: ['Multiple short chat bubbles', 'One single cohesive paragraph', 'Bullet list only', 'Dialogue format'], correctIndex: 1, explanation: 'It is written as a single well-structured paragraph.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Formal Letters (Order, Enquiry, Complaint, Editor)',
          topics: ['Sender & Receiver blocks', 'Letter of Enquiry & Placing Order', 'Letter to the Editor'],
          summary: 'Master all four CBSE Class 10 formal letter formats with crisp, purposeful openings and closings.',
          objectives: ['Distinguish Letter to Editor vs Letter of Complaint', 'Include product tables when placing orders'],
          studyNotes: [
            'Sequence: Sender’s Address -> Date -> Receiver’s Designation & Address -> Subject -> Salutation (Sir/Madam) -> Body (3 paragraphs) -> Complimentary Close (Yours sincerely/truly).',
            'In a Letter to the Editor, highlight a public issue and suggest civic remedies ("Through the columns of your esteemed newspaper...").'
          ],
          revisionPoints: ['Never write "Your’s" (no apostrophe!)', 'Include item table for Placing Order', '3 paragraphs: Purpose, Details, Action'],
          practiceQuestions: [
            { question: 'Why is an apostrophe wrong in "Your’s sincerely"?', answer: 'Possessive pronouns like yours, hers, and theirs never take an apostrophe; write "Yours sincerely".' },
            { question: 'What should a Letter of Complaint about a defective product include?', answer: 'Invoice/Bill number, date of purchase, exact defect, and requested replacement/refund.' }
          ],
          quizQuestions: [
            { question: 'Which spelling is grammatically correct in a letter closing?', options: ['Your’s truly', 'Yours’ truly', 'Yours truly', 'You’re truly'], correctIndex: 2, explanation: 'Possessive "Yours" never uses an apostrophe.' },
            { question: 'A Letter to the Editor aims to:', options: ['Order school textbooks', 'Draw public & authority attention to a civic issue', 'Apply for sick leave', 'Complain about a toaster warranty'], correctIndex: 1, explanation: 'Editors publish letters to raise public awareness.' },
            { question: 'When placing an order for sports equipment, the clearest way to list items is:', options: ['Long paragraph', 'A neat table with Item, Brand, Quantity', 'Poem', 'Footnote'], correctIndex: 1, explanation: 'Tabular item lists prevent order errors.' },
            { question: 'Where does the Date appear in modern CBSE formal letters?', options: ['Below signature', 'Between Sender’s Address and Receiver’s Address', 'Inside the subject', 'Top right margin only'], correctIndex: 1, explanation: 'Block format places Date on the left between Sender and Receiver blocks.' },
            { question: 'Which opening line fits a Letter of Enquiry?', options: ['With reference to your advertisement...', 'I am writing to complain bitterly...', 'I want to highlight garbage on roads...', 'Please deliver 10 cricket bats...'], correctIndex: 0, explanation: 'Enquiries ask about courses, prices, or schedules advertised.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(10, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'रचना के आधार पर वाक्य रूपांतरण, वाच्य, पद-परिचय और विज्ञापन/संदेश लेखन।', [
        {
          title: 'पद-परिचय (शब्द से पद बनने की प्रक्रिया)',
          topics: ['संज्ञा, सर्वनाम, विशेषण, क्रिया, अव्यय का परिचय', 'लिंग, वचन, कारक, काल'],
          summary: 'वाक्य में प्रयुक्त प्रत्येक शब्द (पद) का पूर्ण व्याकरणिक परिचय देना सीखें।',
          objectives: ['रेखांकित पद के भेद, लिंग, वचन, कारक और काल बताना'],
          studyNotes: [
            'स्वतंत्र शब्द जब वाक्य में प्रयुक्त होता है, तो वह "पद" कहलाता है। पद-परिचय में संज्ञा/सर्वनाम/विशेषण/क्रिया/अव्यय के साथ उसका लिंग, वचन, कारक, पुरुष या काल बताया जाता है।'
          ],
          revisionPoints: ['वाक्य में प्रयुक्त शब्द = पद', '5 प्रमुख बिंदुओं में परिचय दें'],
          practiceQuestions: [
            { question: '"रोहन ने नई पुस्तक खरीदी।" में "पुस्तक" का पद-परिचय दीजिए।', answer: 'जातिवाचक संज्ञा, स्त्रीलिंग, एकवचन, कर्म कारक।' },
            { question: '"वह धीरे-धीरे चलता है।" में "धीरे-धीरे" क्या है?', answer: 'रीतिवाचक क्रियाविशेषण अव्यय, "चलता है" क्रिया की विशेषता।' }
          ],
          quizQuestions: [
            { question: 'जब कोई शब्द वाक्य में व्याकरणिक नियमों के साथ जुड़ता है, तो वह कहलाता है:', options: ['वर्ण', 'पद', 'प्रत्यय', 'उपसर्ग'], correctIndex: 1, explanation: 'वाक्य में प्रयुक्त सार्थक शब्द "पद" बन जाता है।' },
            { question: '"सुंदर फूल खिले हैं।" में "सुंदर" का सही पद-परिचय है:', options: ['संख्यावाचक विशेषण', 'गुणवाचक विशेषण, पुल्लिंग, बहुवचन, विशेष्य "फूल"', 'भाववाचक संज्ञा', 'क्रियाविशेषण'], correctIndex: 1, explanation: 'सुंदर गुणवाचक विशेषण है जो बहुवचन फूल की विशेषता बताता है।' },
            { question: '"मैं कल जयपुर जाऊँगा।" में "मैं" का पद-परिचय क्या होगा?', options: ['निजवाचक सर्वनाम', 'उत्तम पुरुषवाचक सर्वनाम, एकवचन, कर्ता कारक', 'जातिवाचक संज्ञा', 'अव्यय'], correctIndex: 1, explanation: '"मैं" उत्तम पुरुषवाचक सर्वनाम है।' },
            { question: '"मेज के ऊपर किताब रखी है।" में "के ऊपर" है:', options: ['समुच्चयबोधक', 'संबंधबोधक अव्यय', 'विस्मयादिबोधक', 'विशेषण'], correctIndex: 1, explanation: 'संज्ञा "मेज" का संबंध वाक्य के अन्य भाग से जोड़ रहा है।' },
            { question: '"गीता ने मधुर गीत गाया।" में "गाया" किस काल की क्रिया है?', options: ['वर्तमान काल', 'सामान्य भूतकाल', 'भविष्यत् काल', 'संदिग्ध वर्तमान'], correctIndex: 1, explanation: '"गाया" पूर्ण कार्य (सामान्य भूतकाल) बताता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'वाच्य परिवर्तन और अलंकार अभ्यास',
          topics: ['कर्तृवाच्य से कर्मवाच्य/भाववाच्य', 'श्लेष, उत्प्रेक्षा, मानवीकरण अलंकार'],
          summary: 'बोर्ड परीक्षा के लिए वाच्य रूपांतरण के नियम और मानवीकरण व अतिशयोक्ति अलंकार का अभ्यास करें।',
          objectives: ['काल बदले बिना वाच्य परिवर्तन करना', 'मानवीकरण अलंकार पहचानना'],
          studyNotes: [
            'वाच्य बदलते समय क्रिया का काल कभी नहीं बदलना चाहिए: "वह पत्र लिखती है" -> "उसके द्वारा पत्र लिखा जाता है"।',
            'मानवीकरण अलंकार: जड़ प्रकृति पर मानवीय भावनाओं का आरोप ("मेघ आए बड़े बन-ठन के सँवर के")।'
          ],
          revisionPoints: ['वाच्य परिवर्तन में काल समान रखें', 'प्रकृति में मानवीय क्रिया = मानवीकरण'],
          practiceQuestions: [
            { question: '"कवि ने कविता सुनाई।" को कर्मवाच्य में बदलिए।', answer: 'कवि द्वारा कविता सुनाई गई।' },
            { question: '"मेघ आए बड़े बन-ठन के सँवर के" में कौन-सा अलंकार है?', answer: 'मानवीकरण अलंकार।' }
          ],
          quizQuestions: [
            { question: '"बच्चे पतंग उड़ाते हैं।" का सही कर्मवाच्य रूप है:', options: ['बच्चों द्वारा पतंग उड़ाई जाती है।', 'बच्चों द्वारा पतंग उड़ाई गई।', 'बच्चे से उड़ा नहीं जाता।', 'पतंग बच्चों ने उड़ाई थी।'], correctIndex: 0, explanation: 'वर्तमान काल बनाए रखते हुए "द्वारा + जाती है" का प्रयोग।' },
            { question: '"फूल हँसे कलियाँ मुसकाईं" में कौन-सा अलंकार है?', options: ['यमक', 'श्लेष', 'मानवीकरण', 'द्विगु'], correctIndex: 2, explanation: 'फूलों और कलियों पर हँसने-मुसकाने की मानवीय क्रिया का आरोप है।' },
            { question: 'अकर्मक क्रिया वाले वाक्य का वाच्य परिवर्तन किसमें होता है?', options: ['कर्मवाच्य में', 'भाववाच्य में', 'द्वंद्व में', 'नहीं बदलता'], correctIndex: 1, explanation: 'अकर्मक क्रिया से भाववाच्य बनता है।' },
            { question: '"आओ, अब सोएँ।" को भाववाच्य में बदलिए:', options: ['आओ, अब सोया जाए।', 'हम सो गए।', 'तुम सो जाओ।', 'वे सो रहे हैं।'], correctIndex: 0, explanation: 'भाववाच्य रूप: अब सोया जाए।' },
            { question: 'किस अलंकार में उपमेय और उपमान में अभिन्नता दिखाई जाती है?', options: ['उपमा', 'रूपक', 'अनुप्रास', 'उत्प्रेक्षा'], correctIndex: 1, explanation: 'रूपक अलंकार में दोनों को एक मान लिया जाता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'विज्ञापन, संदेश एवं स्ववृत्त (Bio-data) लेखन',
          topics: ['आकर्षक विज्ञापन के तत्व', 'शुभकामना व शोक संदेश', 'औपचारिक ई-मेल व स्ववृत्त'],
          summary: 'रचनात्मक लेखन कौशल विकसित करें—संक्षिप्त विज्ञापन, संदेश लेखन और औपचारिक ई-मेल प्रारूप सीखें।',
          objectives: ['बॉक्स में 40–50 शब्दों का विज्ञापन बनाना', 'संदेश व ई-मेल के आवश्यक अंग लिखना'],
          studyNotes: [
            'विज्ञापन हमेशा बॉक्स के अंदर आकर्षक शीर्षक, मुख्य विशेषताएँ, छूट/ऑफर और संपर्क सूत्र के साथ 40–50 शब्दों में लिखा जाता है।',
            'संदेश लेखन में "संदेश" शीर्षक, दिनांक, समय, संबोधन, मुख्य संदेश और प्रेषक का नाम होता है।'
          ],
          revisionPoints: ['विज्ञापन = 40 शब्द + बॉक्स + संपर्क', 'ई-मेल में From, To, Subject अनिवार्य'],
          practiceQuestions: [
            { question: 'विज्ञापन लेखन में किन बातों का ध्यान रखना चाहिए?', answer: 'सरल आकर्षक भाषा, कम शब्द, मुख्य लाभ, कीमत/छूट और संपर्क पता।' },
            { question: 'संदेश लेखन में समय और दिनांक कहाँ लिखते हैं?', answer: 'शीर्षक के ठीक नीचे बाईं ओर।' }
          ],
          quizQuestions: [
            { question: 'विज्ञापन लेखन के लिए आदर्श शब्द-सीमा क्या है?', options: ['10 शब्द', '30–40 शब्द', '300 शब्द', '500 शब्द'], correctIndex: 1, explanation: 'विज्ञापन संक्षिप्त व आकर्षक (लगभग 30–40 शब्द) होता है।' },
            { question: 'संदेश लेखन में कौन-सा तत्व आवश्यक है?', options: ['दिनांक, समय और प्रेषक नाम', 'पूरा निबंध', 'अलंकार सूची', 'व्याकरण परिभाषा'], correctIndex: 0, explanation: 'संदेश बॉक्स में दिनांक, समय, मुख्य विषय और नाम होता है।' },
            { question: 'औपचारिक ई-मेल में "Subject" का क्या कार्य है?', options: ['रंग बदलना', 'ई-मेल का मुख्य उद्देश्य एक पंक्ति में बताना', 'फोटो भेजना', 'पासवर्ड लिखना'], correctIndex: 1, explanation: 'Subject प्राप्तकर्ता को विषय की तुरंत जानकारी देता है।' },
            { question: 'नौकरी या आवेदन के साथ भेजा जाने वाला व्यक्तिगत विवरण क्या कहलाता है?', options: ['विज्ञापन', 'स्ववृत्त (Bio-data)', 'तार', 'संदेश'], correctIndex: 1, explanation: 'स्ववृत्त में शिक्षा, योग्यता व अनुभव का क्रमबद्ध ब्यौरा होता है।' },
            { question: 'विज्ञापन के अंत में क्या अवश्य होना चाहिए?', options: ['कहानी', 'संपर्क सूत्र / पता या फोन नंबर', 'पूर्ण विराम नहीं', 'परिभाषा'], correctIndex: 1, explanation: 'ग्राहक संपर्क कर सकें, इसके लिए संपर्क विवरण आवश्यक है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(10, 'it', 'Information Technology (IT)', 'Technology', 'lavender', 'RDBMS & SQL Queries, Digital Documentation Styles, and Workplace Web Safety.', [
        {
          title: 'Relational Database Management System (RDBMS) & SQL',
          topics: ['Primary & Foreign Keys', 'DDL vs DML commands', 'SELECT, WHERE, ORDER BY, INSERT'],
          summary: 'Design multi-table relational databases using Primary and Foreign keys and write clean SQL queries to retrieve and sort records.',
          objectives: ['Distinguish Primary Key and Foreign Key', 'Write SELECT ... WHERE ... ORDER BY queries'],
          studyNotes: [
            'A Relational Database links tables using Primary Keys (unique in parent table) and Foreign Keys (referencing parent PK).',
            'DDL (Data Definition Language): CREATE, ALTER, DROP. DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE.'
          ],
          revisionPoints: ['SELECT * FROM Students WHERE Class = 10;', 'DDL defines structure; DML manipulates rows'],
          practiceQuestions: [
            { question: 'What is a Foreign Key?', answer: 'A column in one table that references the Primary Key of another table to establish a link.' },
            { question: 'Write an SQL query to show all students scoring above 80.', answer: 'SELECT * FROM Students WHERE Marks > 80;' }
          ],
          quizQuestions: [
            { question: 'Which SQL command retrieves data from a database table?', options: ['GET', 'SELECT', 'FETCH', 'READ'], correctIndex: 1, explanation: 'SELECT queries rows from one or more tables.' },
            { question: 'Which SQL clause filters rows based on a condition?', options: ['ORDER BY', 'GROUP BY', 'WHERE', 'FROM'], correctIndex: 2, explanation: 'WHERE specifies the row filtering condition.' },
            { question: 'Which key links a child table back to the Primary Key of a parent table?', options: ['Super Key', 'Foreign Key', 'Candidate Key', 'Composite Key'], correctIndex: 1, explanation: 'Foreign keys enforce referential integrity between tables.' },
            { question: 'Which SQL command belongs to DDL (Data Definition Language)?', options: ['INSERT', 'UPDATE', 'CREATE TABLE', 'DELETE'], correctIndex: 2, explanation: 'CREATE TABLE defines schema structure.' },
            { question: 'To sort query results in descending order of marks, add:', options: ['SORT DESC', 'ORDER BY Marks DESC', 'WHERE DESC', 'FILTER DESC'], correctIndex: 1, explanation: 'ORDER BY ... DESC sorts highest to lowest.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Advanced Documentation: Styles, Templates & TOC',
          topics: ['Paragraph & Page Styles', 'Table of Contents (TOC)', 'Track Changes'],
          summary: 'Format professional multi-chapter documents using reusable Styles, automatic Table of Contents, and collaborative Track Changes.',
          objectives: ['Apply Heading 1–3 styles for automatic TOC', 'Use Templates for consistent layout'],
          studyNotes: [
            'A Style is a saved set of formatting rules (font, size, spacing). Using Heading 1/2/3 styles lets Writer generate a clickable Table of Contents automatically.',
            'Track Changes highlights insertions and deletions for teacher or peer review.'
          ],
          revisionPoints: ['Styles maintain visual consistency', 'TOC relies on Heading styles', 'Template = reusable blueprint'],
          practiceQuestions: [
            { question: 'Why should we use Heading styles instead of manually bolding titles?', answer: 'Styles enable one-click global updates and automatic Table of Contents generation.' },
            { question: 'What is a Document Template?', answer: 'A pre-formatted model document used to create uniform new documents quickly.' }
          ],
          quizQuestions: [
            { question: 'Automatic Table of Contents generation relies on applying:', options: ['Bold and Italic manually', 'Heading styles (Heading 1, 2, 3)', 'Page borders', 'Footnotes'], correctIndex: 1, explanation: 'Headings define the hierarchy for the TOC.' },
            { question: 'Which feature records edits made by reviewers for later acceptance or rejection?', options: ['Mail Merge', 'Track Changes', 'Word Count', 'Drop Cap'], correctIndex: 1, explanation: 'Track Changes logs revisions cleanly.' },
            { question: 'A pre-designed layout file used as a starting pattern is a:', options: ['Macro', 'Template', 'Index', 'Header'], correctIndex: 1, explanation: 'Templates store reusable styling and structure.' },
            { question: 'Which style type controls margins, headers, footers, and orientation?', options: ['Character Style', 'Page Style', 'List Style', 'Frame Style'], correctIndex: 1, explanation: 'Page Styles govern page-level geometry.' },
            { question: 'Cropping an image in a document:', options: ['Deletes the file', 'Trims unwanted outer edges', 'Changes file format', 'Adds a hyperlink'], correctIndex: 1, explanation: 'Cropping removes outer regions of a picture.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Web Applications, Accessibility & Workplace Safety',
          topics: ['Screen readers & sticky keys', 'HTTPS & SSL security', 'Backup & disaster recovery'],
          summary: 'Understand assistive accessibility tools, secure HTTPS web communication, and workplace health & data backup practices.',
          objectives: ['Explain accessibility tools (Sticky Keys, High Contrast)', 'Verify HTTPS security and 3-2-1 backups'],
          studyNotes: [
            'Accessibility features: Sticky Keys (press shortcut keys sequentially instead of simultaneously), Filter Keys, Magnifier, and Screen Readers.',
            'Always verify HTTPS (padlock) before entering credentials, and maintain offline/cloud backups against hardware failure.'
          ],
          revisionPoints: ['HTTPS encrypts web traffic', 'Sticky Keys helps single-finger shortcuts', 'Regular backups prevent data loss'],
          practiceQuestions: [
            { question: 'What does the "S" in HTTPS signify?', answer: 'Secure—communication is encrypted using TLS/SSL.' },
            { question: 'Who benefits from Sticky Keys?', answer: 'Users who find it difficult to hold down two or more keys simultaneously.' }
          ],
          quizQuestions: [
            { question: 'Which accessibility feature lets users press Ctrl, Shift, or Alt one key at a time?', options: ['Filter Keys', 'Sticky Keys', 'Toggle Keys', 'Mouse Keys'], correctIndex: 1, explanation: 'Sticky Keys keeps modifier keys active until the next key press.' },
            { question: 'Which protocol encrypts data between your browser and a website?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], correctIndex: 2, explanation: 'HTTPS uses TLS encryption.' },
            { question: 'What is the best safeguard against accidental deletion or hard-drive failure?', options: ['Deleting browser history', 'Maintaining regular backups', 'Increasing brightness', 'Disabling Wi-Fi'], correctIndex: 1, explanation: 'Backups allow complete data recovery.' },
            { question: 'A small text file stored by a browser to remember login/preferences is a:', options: ['Trojan', 'Cookie', 'Firewall', 'Router'], correctIndex: 1, explanation: 'Cookies store session and preference data.' },
            { question: 'Which workplace practice prevents repetitive strain injury while typing?', options: ['Using wrist support and neutral posture', 'Typing standing on tiptoes', 'Sitting 5 cm from screen', 'Skipping breaks for 6 hours'], correctIndex: 0, explanation: 'Ergonomic posture and regular breaks protect joints and eyes.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  }
];

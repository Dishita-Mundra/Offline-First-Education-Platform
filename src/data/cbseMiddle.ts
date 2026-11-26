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

export const CBSE_MIDDLE_CLASSES: CBSEClassData[] = [
  // ==================== CLASS 6 ====================
  {
    classNumber: 6,
    label: 'Class 6',
    stage: 'Middle (Classes 6–8)',
    subjects: [
      makeSubject(6, 'math', 'Mathematics', 'Mathematics', 'blue', 'Whole numbers, integers, basic geometry, fractions, and ratios.', [
        {
          title: 'Knowing Our Numbers & Whole Numbers',
          topics: ['Indian vs International system', 'Estimation & rounding', 'Whole number properties', 'BODMAS basics'],
          summary: 'Compare large numbers in Indian and International systems and explore closure, commutativity, and associative properties of whole numbers.',
          objectives: ['Write numbers in both systems', 'Apply commutative and distributive properties'],
          studyNotes: [
            '1 Million = 10 Lakhs. International commas separate every 3 digits (1,000,000); Indian commas separate 3 then 2 (10,00,000).',
            'Whole numbers start at 0 (0, 1, 2, 3...). Every natural number is a whole number, but 0 is not a natural number.'
          ],
          revisionPoints: ['1 Million = 10 Lakhs', 'Whole numbers start at 0', 'a × (b + c) = a×b + a×c'],
          practiceQuestions: [
            { question: 'How many lakhs make 1 million?', answer: '10 lakhs.' },
            { question: 'Is 0 the smallest whole number?', answer: 'Yes, 0 is the smallest whole number.' }
          ],
          quizQuestions: [
            { question: 'What is the smallest whole number?', options: ['1', '0', '-1', '10'], correctIndex: 1, explanation: 'Whole numbers begin at 0.' },
            { question: '1 Crore equals how many Millions?', options: ['1 Million', '10 Million', '100 Million', '1000 Million'], correctIndex: 1, explanation: '1,00,00,000 = 10,000,000 = 10 Million.' },
            { question: 'Which property is shown by 15 × (10 + 2) = 15×10 + 15×2?', options: ['Closure', 'Commutative', 'Distributive', 'Identity'], correctIndex: 2, explanation: 'Multiplication distributes over addition.' },
            { question: 'What is the successor of 10,999?', options: ['11,000', '10,998', '11,001', '10,100'], correctIndex: 0, explanation: '10,999 + 1 = 11,000.' },
            { question: 'Division of any whole number by zero is:', options: ['0', '1', 'Not defined', 'The number itself'], correctIndex: 2, explanation: 'Division by zero is undefined in mathematics.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Integers & Number Line',
          topics: ['Positive & negative numbers', 'Ordering integers', 'Adding integers on a number line'],
          summary: 'Represent temperatures below zero, elevations, and debts using negative integers and add/subtract on a number line.',
          objectives: ['Locate integers on a number line', 'Compare negative integers', 'Add positive and negative integers'],
          studyNotes: [
            'Integers include negative numbers (..., -3, -2, -1), zero (0), and positive numbers (1, 2, 3, ...).',
            'On a horizontal number line, numbers increase as you move right. Thus -2 > -5.'
          ],
          revisionPoints: ['0 is neither positive nor negative', 'Moving right adds; moving left subtracts', '-1 is the greatest negative integer'],
          practiceQuestions: [
            { question: 'Which is greater: -8 or -3?', answer: '-3, because it lies to the right of -8 on the number line.' },
            { question: 'Evaluate (-6) + (+10).', answer: '+4.' }
          ],
          quizQuestions: [
            { question: 'Which is the greatest negative integer?', options: ['-100', '-10', '-1', '0'], correctIndex: 2, explanation: '-1 is closest to 0 on the negative side.' },
            { question: 'What is (-7) + (-3)?', options: ['-4', '4', '-10', '10'], correctIndex: 2, explanation: 'Adding two negatives moves further left: -10.' },
            { question: 'Which number is neither positive nor negative?', options: ['1', '-1', '0', '2'], correctIndex: 2, explanation: 'Zero is the origin, neither positive nor negative.' },
            { question: 'What is 5 + (-9)?', options: ['4', '-4', '14', '-14'], correctIndex: 1, explanation: '5 − 9 = -4.' },
            { question: 'A submarine is 250 m below sea level. Written as an integer, it is:', options: ['+250', '-250', '0', '25'], correctIndex: 1, explanation: 'Depth below sea level is represented by a negative sign.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Basic Geometrical Ideas & Ratio',
          topics: ['Point, line, line segment, ray', 'Intersecting & parallel lines', 'Polygons', 'Ratio & proportion intro'],
          summary: 'Distinguish lines, segments, and rays, classify triangles and polygons, and solve simple ratio problems.',
          objectives: ['Differentiate line, ray, and segment', 'Simplify ratios like 12:18'],
          studyNotes: [
            'A line segment has 2 endpoints; a ray has 1 endpoint and extends endlessly in one direction; a line extends endlessly both ways.',
            'Ratio compares two quantities of the same unit by division (e.g., 20 : 30 = 2 : 3).'
          ],
          revisionPoints: ['Segment = fixed length', 'Ray = 1 endpoint', 'Ratio has no units'],
          practiceQuestions: [
            { question: 'Simplify the ratio 24 : 36.', answer: 'Divide both by 12 -> 2 : 3.' },
            { question: 'How many lines can pass through two given distinct points?', answer: 'Only one unique line.' }
          ],
          quizQuestions: [
            { question: 'Which geometrical figure has two fixed endpoints?', options: ['Line', 'Ray', 'Line segment', 'Plane'], correctIndex: 2, explanation: 'A line segment has a definite length between two endpoints.' },
            { question: 'Two lines in a plane that never meet are called:', options: ['Intersecting lines', 'Parallel lines', 'Perpendicular lines', 'Curves'], correctIndex: 1, explanation: 'Parallel lines stay equidistant everywhere.' },
            { question: 'Simplify the ratio 15 : 25:', options: ['5 : 3', '3 : 5', '1 : 5', '3 : 4'], correctIndex: 1, explanation: 'Divide both by 5: 3 : 5.' },
            { question: 'A polygon with 5 sides is called a:', options: ['Quadrilateral', 'Pentagon', 'Hexagon', 'Octagon'], correctIndex: 1, explanation: 'Penta means five.' },
            { question: 'Find the ratio of 50 paise to ₹2:', options: ['25 : 1', '1 : 4', '1 : 2', '50 : 2'], correctIndex: 1, explanation: '₹2 = 200 paise, so 50 : 200 = 1 : 4.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(6, 'science', 'Science', 'Science', 'mint', 'Food & nutrients, sorting materials, living organisms, light, and electricity.', [
        {
          title: 'Components of Food & Balanced Diet',
          topics: ['Carbohydrates, Proteins, Fats, Vitamins, Minerals', 'Deficiency diseases', 'Balanced diet'],
          summary: 'Understand the five essential nutrients, test foods for starch and protein, and prevent deficiency diseases.',
          objectives: ['Match nutrients to body functions', 'Identify deficiency diseases like scurvy and goitre'],
          studyNotes: [
            'Carbohydrates and fats are energy-giving foods; proteins are body-building foods; vitamins and minerals protect against diseases.',
            'Deficiencies: Vitamin A -> night blindness, Vitamin C -> scurvy, Vitamin D -> rickets, Iodine -> goitre, Iron -> anaemia.'
          ],
          revisionPoints: ['Iodine solution turns starch blue-black', 'Protein = growth & repair', 'Roughage helps digestion'],
          practiceQuestions: [
            { question: 'Which test confirms the presence of starch in potato?', answer: 'Iodine test—dilute iodine turns starch blue-black.' },
            { question: 'Which mineral deficiency causes anaemia?', answer: 'Iron deficiency.' }
          ],
          quizQuestions: [
            { question: 'Which nutrient is primarily known as body-building food?', options: ['Carbohydrates', 'Proteins', 'Water', 'Roughage'], correctIndex: 1, explanation: 'Proteins build and repair muscles and tissues.' },
            { question: 'Deficiency of Vitamin C causes:', options: ['Rickets', 'Scurvy', 'Goitre', 'Beriberi'], correctIndex: 1, explanation: 'Scurvy causes bleeding gums due to lack of Vitamin C.' },
            { question: 'Which chemical turns starch blue-black?', options: ['Copper sulphate', 'Iodine solution', 'Lime water', 'Vinegar'], correctIndex: 1, explanation: 'Starch reacts with iodine to form a blue-black complex.' },
            { question: 'Lack of iodine in diet causes:', options: ['Anaemia', 'Goitre', 'Night blindness', 'Scurvy'], correctIndex: 1, explanation: 'Goitre is swelling of the thyroid gland in the neck.' },
            { question: 'Dietary fibre (roughage) helps our body:', options: ['Store fat', 'Get rid of undigested food', 'Build bones', 'Produce starch'], correctIndex: 1, explanation: 'Roughage aids healthy bowel movement.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Sorting Materials & Separation Methods',
          topics: ['Transparent, translucent, opaque', 'Soluble vs insoluble', 'Filtration, evaporation, decantation'],
          summary: 'Group materials by lustre, hardness, solubility, and transparency, and separate mixtures cleanly.',
          objectives: ['Classify materials by light transmission', 'Choose filtration vs evaporation for mixtures'],
          studyNotes: [
            'Transparent objects let light pass clearly (glass); translucent allow partial light (oiled paper); opaque block light completely (wood).',
            'Insoluble solids (sand + water) are separated by sedimentation, decantation, or filtration. Soluble solids (salt + water) are separated by evaporation.'
          ],
          revisionPoints: ['Salt from seawater -> Evaporation', 'Tea leaves from tea -> Filtration', 'Glass = transparent'],
          practiceQuestions: [
            { question: 'How is common salt recovered from sea water?', answer: 'By evaporation.' },
            { question: 'Give one example of a translucent material.', answer: 'Frosted glass or butter paper.' }
          ],
          quizQuestions: [
            { question: 'Which material is completely opaque?', options: ['Clear glass', 'Clean water', 'Wooden door', 'Air'], correctIndex: 2, explanation: 'Light cannot pass through wood.' },
            { question: 'Which method separates dissolved salt from water?', options: ['Sieving', 'Filtration', 'Evaporation', 'Winnowing'], correctIndex: 2, explanation: 'Water evaporates leaving salt crystals behind.' },
            { question: 'Separating heavier grain from lighter husk using wind is:', options: ['Threshing', 'Winnowing', 'Decantation', 'Sieving'], correctIndex: 1, explanation: 'Winnowing uses wind to blow away lighter chaff.' },
            { question: 'Which of these is soluble in water?', options: ['Chalk powder', 'Sand', 'Sugar', 'Sawdust'], correctIndex: 2, explanation: 'Sugar dissolves completely in water.' },
            { question: 'Materials through which objects appear blurred are:', options: ['Transparent', 'Translucent', 'Opaque', 'Magnetic'], correctIndex: 1, explanation: 'Translucent materials scatter part of the light.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Living Organisms, Habitats & Electricity',
          topics: ['Biotic & abiotic components', 'Desert & aquatic adaptations', 'Electric cell & closed circuit', 'Conductors vs insulators'],
          summary: 'Explore how living organisms adapt to habitats and learn how electric cells power closed circuits.',
          objectives: ['Distinguish biotic and abiotic factors', 'Identify conductors vs insulators in a circuit'],
          studyNotes: [
            'A habitat includes biotic (plants, animals) and abiotic (soil, air, water, sunlight) components.',
            'An electric bulb glows only in a complete closed circuit. Metals (copper) are conductors; rubber and plastic are insulators.'
          ],
          revisionPoints: ['Biotic = living, Abiotic = non-living', 'Closed circuit allows current flow', 'Copper = conductor, Rubber = insulator'],
          practiceQuestions: [
            { question: 'Why do desert cacti have spines instead of broad leaves?', answer: 'To reduce water loss through transpiration.' },
            { question: 'Why are electric wires coated with plastic?', answer: 'Plastic is an insulator and prevents electric shocks.' }
          ],
          quizQuestions: [
            { question: 'Which is an abiotic component of a habitat?', options: ['Earthworm', 'Mushroom', 'Sunlight', 'Grass'], correctIndex: 2, explanation: 'Sunlight is non-living (abiotic).' },
            { question: 'Which material is a good conductor of electricity?', options: ['Plastic', 'Copper', 'Rubber', 'Dry wood'], correctIndex: 1, explanation: 'Metals like copper allow electric current to flow easily.' },
            { question: 'An electric cell has how many terminals?', options: ['1', '2 (+ and −)', '3', '4'], correctIndex: 1, explanation: 'Every cell has a positive (+) and negative (−) terminal.' },
            { question: 'The thin wire inside a bulb that glows is called the:', options: ['Switch', 'Filament', 'Socket', 'Insulator'], correctIndex: 1, explanation: 'The tungsten filament heats up and emits light.' },
            { question: 'Streamlined bodies help fish to:', options: ['Breathe air', 'Swim easily with less water resistance', 'Climb rocks', 'Store food'], correctIndex: 1, explanation: 'Streamlined shapes cut through water smoothly.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(6, 'sst', 'Social Science', 'Social Science', 'peach', 'Early civilizations (History), Solar System & Maps (Geography), and Diversity & Local Government (Civics).', [
        {
          title: 'The Earliest Cities (Harappan Civilization)',
          topics: ['Mohenjo-daro & Harappa', 'Great Bath & drainage', 'Seals and crafts'],
          summary: 'Journey back 4,700 years to the Indus Valley cities known for planned streets, baked-brick drains, and granaries.',
          objectives: ['Describe Harappan town planning', 'Understand archaeological evidence'],
          studyNotes: [
            'Harappan cities were divided into a raised Citadel (west) and a Lower Town (east). Houses had covered drains connected to street drains.',
            'Harappans made stone seals with animal carvings, bronze tools, and terracotta toys.'
          ],
          revisionPoints: ['4,700 years ago along Indus river', 'Citadel + Lower Town', 'Advanced covered drainage system'],
          practiceQuestions: [
            { question: 'What was the Great Bath in Mohenjo-daro used for?', answer: 'Likely for special ritual bathing on important occasions.' },
            { question: 'What materials were Harappan houses built with?', answer: 'Baked bricks laid in an interlocking pattern.' }
          ],
          quizQuestions: [
            { question: 'In which Harappan city was the Great Bath discovered?', options: ['Lothal', 'Mohenjo-daro', 'Kalibangan', 'Dholavira'], correctIndex: 1, explanation: 'The Great Bath was excavated at Mohenjo-daro.' },
            { question: 'Which Harappan site in Gujarat was a major dockyard/port?', options: ['Harappa', 'Lothal', 'Rakhigarhi', 'Rupnagar'], correctIndex: 1, explanation: 'Lothal had a brick dockyard for sea trade.' },
            { question: 'What did Harappan cities use to build long-lasting drains and walls?', options: ['Bamboo', 'Baked bricks', 'Ice blocks', 'Plastic'], correctIndex: 1, explanation: 'Kiln-baked bricks made structures durable.' },
            { question: 'What does an archaeologist study?', options: ['Stars only', 'Physical remains from the past', 'Weather forecasts', 'Modern apps'], correctIndex: 1, explanation: 'Archaeologists excavate tools, pots, buildings, and seals.' },
            { question: 'The higher western part of Harappan cities was called the:', options: ['Market', 'Citadel', 'Harbour', 'Village'], correctIndex: 1, explanation: 'The raised platform was the Citadel.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'The Earth in the Solar System & Latitudes',
          topics: ['Eight planets', 'Earth as unique planet', 'Equator, Tropics, Longitudes'],
          summary: 'Explore the Sun, eight planets, and how imaginary lines of latitude and longitude locate any place on Earth.',
          objectives: ['Order the 8 planets from the Sun', 'Distinguish latitudes and longitudes'],
          studyNotes: [
            'Planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.',
            'The Equator (0° latitude) divides Earth into Northern and Southern Hemispheres. Prime Meridian (0° longitude) passes through Greenwich.'
          ],
          revisionPoints: ['8 planets orbit the Sun', '0° Latitude = Equator', '0° Longitude = Prime Meridian'],
          practiceQuestions: [
            { question: 'Why is Earth called the Blue Planet?', answer: 'About two-thirds of Earth’s surface is covered by water.' },
            { question: 'Which is the largest planet in the solar system?', answer: 'Jupiter.' }
          ],
          quizQuestions: [
            { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], correctIndex: 1, explanation: 'Mercury is the innermost planet.' },
            { question: 'What is the 0° line of latitude called?', options: ['Tropic of Cancer', 'Prime Meridian', 'Equator', 'Arctic Circle'], correctIndex: 2, explanation: 'The Equator divides Earth into North and South halves.' },
            { question: 'Which is the largest planet in our Solar System?', options: ['Saturn', 'Earth', 'Jupiter', 'Neptune'], correctIndex: 2, explanation: 'Jupiter is the largest gas giant.' },
            { question: 'A true miniature model of the Earth is called a:', options: ['Atlas', 'Globe', 'Compass', 'Sketch'], correctIndex: 1, explanation: 'A globe accurately shows Earth’s spherical shape.' },
            { question: 'What is the natural satellite of Earth?', options: ['Mars', 'The Moon', 'Polaris', 'Halley'], correctIndex: 1, explanation: 'The Moon orbits Earth.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Diversity, Discrimination & Panchayati Raj',
          topics: ['Cultural diversity in India', 'Equality & Constitution', 'Gram Sabha & Gram Panchayat'],
          summary: 'Celebrate India’s unity in diversity and understand how local self-government works in villages through Gram Panchayat.',
          objectives: ['Understand diversity vs inequality', 'Explain the role of Gram Sabha'],
          studyNotes: [
            'India has rich diversity in languages, food, festivals, and geography. Prejudice and stereotypes lead to unfair discrimination.',
            'Gram Sabha consists of all adults (18+ years) in a village who elect members of the Gram Panchayat for local development.'
          ],
          revisionPoints: ['Unity in Diversity', '18+ citizens form Gram Sabha', 'Sarpanch heads the Gram Panchayat'],
          practiceQuestions: [
            { question: 'Who can be a member of the Gram Sabha?', answer: 'Every adult aged 18 years or older whose name is on the village voter list.' },
            { question: 'Who is the head of a Gram Panchayat?', answer: 'The Sarpanch (Panchayat President).' }
          ],
          quizQuestions: [
            { question: 'What is the minimum age to be a member of the Gram Sabha?', options: ['14 years', '16 years', '18 years', '25 years'], correctIndex: 2, explanation: 'All citizens aged 18 and above registered as voters belong to the Gram Sabha.' },
            { question: 'Judging someone negatively without knowing them is called:', options: ['Diversity', 'Prejudice', 'Cooperation', 'Justice'], correctIndex: 1, explanation: 'Prejudice means pre-judging others unfairly.' },
            { question: 'Who leads the Gram Panchayat?', options: ['Mayor', 'Sarpanch', 'Governor', 'Prime Minister'], correctIndex: 1, explanation: 'The elected head of a Gram Panchayat is the Sarpanch.' },
            { question: 'Panchayati Raj operates at which level?', options: ['Rural / Village level', 'International level', 'Only Metro cities', 'Space stations'], correctIndex: 0, explanation: 'Panchayati Raj is rural local self-government.' },
            { question: 'Which value means treating everyone fairly regardless of background?', options: ['Inequality', 'Equality', 'Stereotype', 'Bias'], correctIndex: 1, explanation: 'The Indian Constitution guarantees equality to all.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(6, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'संधि परिचय, तत्सम-तद्भव, संज्ञा के भेद और अपठित बोध।', [
        {
          title: 'संज्ञा के मुख्य भेद',
          topics: ['व्यक्तिवाचक संज्ञा', 'जातिवाचक संज्ञा', 'भाववाचक संज्ञा'],
          summary: 'व्यक्तिवाचक, जातिवाचक और भाववाचक संज्ञा शब्दों की पहचान व निर्माण सीखें।',
          objectives: ['तीनों संज्ञा भेदों में अंतर समझना', 'भाववाचक संज्ञा बनाना'],
          studyNotes: [
            'व्यक्तिवाचक: विशेष नाम (हिमालय, गंगा, प्रेमचंद)। जातिवाचक: पूरी जाति (पर्वत, नदी, लेखक)। भाववाचक: गुण या भाव (ईमानदारी, बचपन, मिठास)।'
          ],
          revisionPoints: ['विशेष नाम = व्यक्तिवाचक', 'समूह/वर्ग = जातिवाचक', 'भाव/गुण = भाववाचक'],
          practiceQuestions: [
            { question: '"हिमालय" और "पर्वत" में कौन व्यक्तिवाचक है?', answer: 'हिमालय व्यक्तिवाचक है और पर्वत जातिवाचक।' },
            { question: '"मीठा" से भाववाचक संज्ञा बनाइए।', answer: 'मिठास।' }
          ],
          quizQuestions: [
            { question: '"गंगा" किस प्रकार की संज्ञा है?', options: ['जातिवाचक', 'व्यक्तिवाचक', 'भाववाचक', 'सर्वनाम'], correctIndex: 1, explanation: 'गंगा एक विशेष नदी का नाम है।' },
            { question: '"बचपन" कौन-सी संज्ञा है?', options: ['व्यक्तिवाचक', 'जातिवाचक', 'भाववाचक', 'क्रिया'], correctIndex: 2, explanation: 'बचपन एक अवस्था/भाव को दर्शाता है।' },
            { question: 'इनमें से जातिवाचक संज्ञा चुनिए:', options: ['ताजमहल', 'दिल्ली', 'शहर', 'सचिन'], correctIndex: 2, explanation: 'शहर सभी नगरों की जाति का बोध कराता है।' },
            { question: '"ईमानदार" से भाववाचक संज्ञा बनेगी:', options: ['ईमान', 'ईमानदारी', 'बेईमान', 'ईमानदारियाँ'], correctIndex: 1, explanation: 'ईमानदारी गुण/भाव है।' },
            { question: 'किसी विशेष व्यक्ति, स्थान या वस्तु के नाम को कहते हैं:', options: ['जातिवाचक', 'व्यक्तिवाचक', 'भाववाचक', 'विशेषण'], correctIndex: 1, explanation: 'विशेष नाम व्यक्तिवाचक संज्ञा कहलाते हैं।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'तत्सम और तद्भव शब्द',
          topics: ['संस्कृत से आए मूल शब्द', 'परिवर्तित हिन्दी रूप'],
          summary: 'संस्कृत के ज्यों-के-त्यों प्रयुक्त होने वाले तत्सम शब्द और सरल हुए तद्भव शब्दों को पहचानें।',
          objectives: ['तत्सम और तद्भव की परिभाषा समझना', 'सामान्य जोड़े याद करना'],
          studyNotes: [
            'तत्सम शब्द संस्कृत के समान होते हैं (अग्नि, दुग्ध, सूर्य, मयूर)। तद्भव शब्द समय के साथ सरल रूप में आए हैं (आग, दूध, सूरज, मोर)।'
          ],
          revisionPoints: ['अग्नि -> आग', 'दुग्ध -> दूध', 'हस्त -> हाथ'],
          practiceQuestions: [
            { question: '"सूर्य" का तद्भव रूप क्या है?', answer: 'सूरज।' },
            { question: '"दूध" का तत्सम शब्द लिखिए।', answer: 'दुग्ध।' }
          ],
          quizQuestions: [
            { question: '"अग्नि" का तद्भव रूप क्या है?', options: ['पानी', 'आग', 'हवा', 'धुआँ'], correctIndex: 1, explanation: 'संस्कृत शब्द अग्नि का तद्भव रूप आग है।' },
            { question: 'इनमें से तत्सम शब्द कौन-सा है?', options: ['हाथ', 'सूरज', 'दुग्ध', 'मोर'], correctIndex: 2, explanation: 'दुग्ध संस्कृत का तत्सम शब्द है।' },
            { question: '"मयूर" का तद्भव शब्द क्या होगा?', options: ['कबूतर', 'मोर', 'तोता', 'हंस'], correctIndex: 1, explanation: 'मयूर से तद्भव रूप मोर बना।' },
            { question: '"रात्रि" किस श्रेणी का शब्द है?', options: ['तत्सम', 'तद्भव', 'देशज', 'विदेशी'], correctIndex: 0, explanation: 'रात्रि तत्सम है (तद्भव: रात)।' },
            { question: '"हस्त" का तद्भव रूप चुनिए:', options: ['पैर', 'सिर', 'हाथ', 'आँख'], correctIndex: 2, explanation: 'हस्त का तद्भव हाथ होता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'विराम चिह्न और स्वर संधि परिचय',
          topics: ['अल्पविराम, योजक, उद्धरण चिह्न', 'दीर्घ संधि परिचय'],
          summary: 'विराम चिह्नों का सटीक प्रयोग करें और दो स्वरों के मेल से बनने वाली दीर्घ संधि को समझें।',
          objectives: ['प्रमुख विराम चिह्नों की पहचान', 'विद्या + आलय = विद्यालय जैसी संधि करना'],
          studyNotes: [
            'दो निकटवर्ती वर्णों के मेल से होने वाले परिवर्तन को संधि कहते हैं: विद्या + आलय = विद्यालय; हिम + आलय = हिमालय; सूर्य + उदय = सूर्योदय।'
          ],
          revisionPoints: ['अ/आ + अ/आ = आ (दीर्घ संधि)', 'योजक चिह्न (-) शब्दों को जोड़ता है'],
          practiceQuestions: [
            { question: 'पुस्तक + आलय की संधि कीजिए।', answer: 'पुस्तकालय।' },
            { question: 'दो शब्दों को जोड़ने वाला छोटा चिह्न (-) क्या कहलाता है?', answer: 'योजक चिह्न।' }
          ],
          quizQuestions: [
            { question: '"विद्या + आलय" की सही संधि क्या है?', options: ['विदयालय', 'विद्यालय', 'विद्याल्य', 'विद्यलय'], correctIndex: 1, explanation: 'आ + आ मिलकर आ बनता है -> विद्यालय।' },
            { question: 'माता-पिता के बीच लगा (-) चिह्न क्या कहलाता है?', options: ['पूर्ण विराम', 'योजक चिह्न', 'प्रश्नवाचक', 'विस्मयादिबोधक'], correctIndex: 1, explanation: '(-) को योजक चिह्न कहते हैं।' },
            { question: '"हिमालय" का सही संधि-विच्छेद चुनिए:', options: ['हिमा + लय', 'हिम + आलय', 'हि + मालय', 'हिम + अल्य'], correctIndex: 1, explanation: 'हिम + आलय = हिमालय।' },
            { question: 'किसी के कहे गए शब्दों को ज्यों-का-त्यों लिखने के लिए प्रयोग होता है:', options: ['लाघव चिह्न', 'उद्धरण चिह्न (" ")', 'अल्पविराम', 'पूर्ण विराम'], correctIndex: 1, explanation: 'उद्धरण चिह्न (" ") संवाद या कथन को दर्शाता है।' },
            { question: '"सूर्य + उदय" की संधि क्या होगी?', options: ['सूर्यदय', 'सूर्योदय', 'सूर्यादय', 'सुर्योदय'], correctIndex: 1, explanation: 'अ + उ मिलकर ओ बनते हैं -> सूर्योदय।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(6, 'sanskrit', 'Sanskrit (संस्कृतम् - Optional)', 'Languages', 'lavender', 'संस्कृत शब्द-परिचय, लट् लकार (वर्तमान काल) और संख्या ज्ञान।', [
        {
          title: 'शब्द-परिचयः (अकारान्त पुल्लिंग एवं आकारान्त स्त्रीलिंग)',
          topics: ['बालकः, बालकौ, बालकाः', 'बालिका, बालिके, बालिकाः', 'एषः / एषा'],
          summary: 'संस्कृत में तीन वचनों (एकवचन, द्विवचन, बहुवचन) और पुल्लिंग-स्त्रीलिंग शब्दों की प्रारंभिक पहचान सीखें।',
          objectives: ['एकवचन, द्विवचन, बहुवचन पहचानना', 'एषः और एषा का प्रयोग'],
          studyNotes: [
            'संस्कृत में तीन वचन होते हैं: एकवचन (1), द्विवचन (2), बहुवचन (3 या अधिक)।',
            'पुल्लिंग: चषकः (1 गिलास), चषकौ (2 गिलास), चषकाः (अनेक गिलास)। स्त्रीलिंग: बालिका, बालिके, बालिकाः।'
          ],
          revisionPoints: ['3 वचन: एक, द्वि, बहु', 'एषः = यह (पुल्लिंग)', 'एषा = यह (स्त्रीलिंग)'],
          practiceQuestions: [
            { question: '"बालकः" का द्विवचन रूप क्या होगा?', answer: 'बालकौ।' },
            { question: 'संस्कृत में कितने वचन होते हैं?', answer: 'तीन (एकवचन, द्विवचन, बहुवचन)।' }
          ],
          quizQuestions: [
            { question: 'संस्कृत में कितने वचन होते हैं?', options: ['दो', 'तीन', 'चार', 'पाँच'], correctIndex: 1, explanation: 'एकवचन, द्विवचन और बहुवचन—कुल तीन वचन।' },
            { question: '"अश्वः" का बहुवचन रूप क्या है?', options: ['अश्वौ', 'अश्वाः', 'अश्वे', 'अश्वम्'], correctIndex: 1, explanation: 'अकारान्त पुल्लिंग का प्रथमा बहुवचन अश्वाः होता है।' },
            { question: '"बालिका" किस लिंग का शब्द है?', options: ['पुल्लिंग', 'स्त्रीलिंग', 'नपुंसकलिंग', 'अव्यय'], correctIndex: 1, explanation: 'बालिका आकारान्त स्त्रीलिंग शब्द है।' },
            { question: '"एषः कः?" किस लिंग के लिए प्रयोग होता है?', options: ['स्त्रीलिंग', 'पुल्लिंग', 'नपुंसकलिंग', 'सभी'], correctIndex: 1, explanation: 'एषः पुल्लिंग सर्वनाम है।' },
            { question: '"पुष्पम्" किस लिंग का उदाहरण है?', options: ['पुल्लिंग', 'स्त्रीलिंग', 'नपुंसकलिंग', 'क्रिया'], correctIndex: 2, explanation: 'पुष्पम्, फलम् आदि नपुंसकलिंग शब्द हैं।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'लट् लकार (वर्तमान काल - क्रिया प्रयोग)',
          topics: ['पठति, पठतः, पठन्ति', 'प्रथम, मध्यम, उत्तम पुरुष'],
          summary: 'कर्ता के वचन और पुरुष के अनुसार लट् लकार की क्रियाओं (पठति, लिखति, गच्छति) का सही प्रयोग करें।',
          objectives: ['तीनों पुरुषों के प्रत्यय समझना', 'कर्ता-क्रिया मेल बिठाना'],
          studyNotes: [
            'प्रथम पुरुष: सः पठति (वह पढ़ता है), तौ पठतः (वे दोनों पढ़ते हैं), ते पठन्ति (वे सब पढ़ते हैं)।',
            'उत्तम पुरुष: अहम् पठामि (मैं पढ़ता हूँ), वयम् पठामः (हम सब पढ़ते हैं)।'
          ],
          revisionPoints: ['ति, तः, न्ति (प्रथम पुरुष)', 'मि, वः, मः (उत्तम पुरुष)'],
          practiceQuestions: [
            { question: '"सः" के साथ "गम्" धातु का लट् लकार रूप क्या होगा?', answer: 'सः गच्छति।' },
            { question: '"अहम् लिखामि" का हिन्दी अर्थ बताइए।', answer: 'मैं लिखता हूँ।' }
          ],
          quizQuestions: [
            { question: '"सः ___" (पठ् धातु) में सही क्रिया रूप चुनिए:', options: ['पठन्ति', 'पठतः', 'पठति', 'पठामि'], correctIndex: 2, explanation: 'सः (एकवचन प्रथम पुरुष) के साथ पठति लगता है।' },
            { question: '"अहम्" के साथ हमेशा किस पुरुष की क्रिया आती है?', options: ['प्रथम पुरुष', 'मध्यम पुरुष', 'उत्तम पुरुष', 'कोई नहीं'], correctIndex: 2, explanation: 'अहम्, आवाम्, वयम् उत्तम पुरुष के कर्ता हैं।' },
            { question: '"बालकाः क्रीडन्ति" में "क्रीडन्ति" किस वचन में है?', options: ['एकवचन', 'द्विवचन', 'बहुवचन', 'द्विलिंग'], correctIndex: 2, explanation: 'अन्तः प्रत्यय "न्ति" बहुवचन का सूचक है।' },
            { question: 'त्वम् के साथ सही क्रिया रूप है:', options: ['पठति', 'पठसि', 'पठामि', 'पठन्ति'], correctIndex: 1, explanation: 'मध्यम पुरुष एकवचन में "सि" लगता है: त्वम् पठसि।' },
            { question: 'लट् लकार किस काल को दर्शाता है?', options: ['भूतकाल', 'भविष्यत् काल', 'वर्तमान काल', 'आज्ञार्थक'], correctIndex: 2, explanation: 'लट् लकार वर्तमान काल के लिए प्रयुक्त होता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'संस्कृत संख्याः (1 से 20) एवं अव्यय पदानि',
          topics: ['एकः, द्वौ, त्रयः... विंशतिः', 'अत्र, तत्र, सर्वत्र, कदा'],
          summary: 'संस्कृत में 1 से 20 तक की गिनती और अव्यय शब्दों (अत्र, तत्र, यदा, कदा) का अभ्यास करें।',
          objectives: ['1 से 20 संख्या शब्द पहचानना', 'अव्यय शब्दों का अर्थ बताना'],
          studyNotes: [
            'संस्कृत संख्याएँ: एकम् (1), द्वे (2), त्रीणि (3), चत्वारि (4), पञ्च (5), षट् (6), सप्त (7), अष्ट (8), नव (9), दश (10), विंशतिः (20)।',
            'अव्यय वे शब्द हैं जो लिंग या वचन से कभी नहीं बदलते: अत्र (यहाँ), तत्र (वहाँ), सर्वत्र (सब जगह)।'
          ],
          revisionPoints: ['पञ्च = 5, दश = 10, विंशतिः = 20', 'अत्र = यहाँ, तत्र = वहाँ'],
          practiceQuestions: [
            { question: '10 और 20 को संस्कृत में क्या कहते हैं?', answer: 'दश (10) और विंशतिः (20)।' },
            { question: '"सर्वत्र" का हिन्दी अर्थ क्या है?', answer: 'सब जगह।' }
          ],
          quizQuestions: [
            { question: 'संस्कृत में "दस" को क्या कहते हैं?', options: ['पञ्च', 'अष्ट', 'दश', 'विंशतिः'], correctIndex: 2, explanation: '10 = दश।' },
            { question: '"अत्र" अव्यय का क्या अर्थ है?', options: ['वहाँ', 'यहाँ', 'कहाँ', 'कब'], correctIndex: 1, explanation: 'अत्र का अर्थ "यहाँ" होता है।' },
            { question: '"विंशतिः" किस संख्या को दर्शाता है?', options: ['12', '15', '20', '30'], correctIndex: 2, explanation: 'विंशतिः = 20।' },
            { question: 'अव्यय शब्दों का रूप वचन बदलने पर:', options: ['बदल जाता है', 'कभी नहीं बदलता', 'केवल स्त्रीलिंग में बदलता है', 'मिट जाता है'], correctIndex: 1, explanation: 'अव्यय सदा एकसमान रहते हैं।' },
            { question: '"पञ्च" का अर्थ कौन-सा अंक है?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'पञ्च = 5।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(6, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Flowcharts & algorithms, HTML structure basics, and spreadsheet charts.', [
        {
          title: 'Algorithms and Flowcharts',
          topics: ['Step-by-step problem solving', 'Flowchart symbols (Oval, Parallelogram, Rectangle, Diamond)'],
          summary: 'Break everyday and math problems into clear step-by-step algorithms and draw standard flowcharts.',
          objectives: ['Write simple algorithms', 'Match flowchart shapes to Start/Stop, Input/Output, Process, Decision'],
          studyNotes: [
            'An algorithm is a finite, step-by-step set of instructions to solve a problem.',
            'Flowchart symbols: Oval = Start/Stop, Parallelogram = Input/Output, Rectangle = Process, Diamond = Decision (Yes/No).'
          ],
          revisionPoints: ['Oval = Start/End', 'Diamond = Decision', 'Arrow = Flow direction'],
          practiceQuestions: [
            { question: 'Which shape represents a Yes/No condition in a flowchart?', answer: 'Diamond (Decision box).' },
            { question: 'What is an algorithm?', answer: 'A step-by-step procedure to solve a task.' }
          ],
          quizQuestions: [
            { question: 'Which flowchart symbol is used for Start and Stop?', options: ['Rectangle', 'Diamond', 'Oval / Terminator', 'Parallelogram'], correctIndex: 2, explanation: 'Ovals mark the start and end of a flowchart.' },
            { question: 'Which symbol shows a calculation or processing step?', options: ['Rectangle', 'Oval', 'Diamond', 'Circle'], correctIndex: 0, explanation: 'Rectangles represent processing steps.' },
            { question: 'Which box asks a Yes/No decision question?', options: ['Parallelogram', 'Diamond', 'Rectangle', 'Arrow'], correctIndex: 1, explanation: 'Diamond boxes branch based on a condition.' },
            { question: 'Input and Output operations use which shape?', options: ['Parallelogram', 'Square', 'Triangle', 'Oval'], correctIndex: 0, explanation: 'Parallelograms represent input/output.' },
            { question: 'A finite sequence of well-defined steps to solve a problem is:', options: ['Hardware', 'Algorithm', 'Monitor', 'Bug'], correctIndex: 1, explanation: 'Algorithms define logical steps.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Introduction to HTML5 Web Pages',
          topics: ['HTML tags (<head>, <body>, <h1>, <p>)', 'Creating a webpage'],
          summary: 'Build your first structured webpage using standard HTML tags like headings, paragraphs, and line breaks.',
          objectives: ['Write valid opening & closing HTML tags', 'Structure head and body sections'],
          studyNotes: [
            'HTML stands for HyperText Markup Language. Most tags come in pairs like <h1>Title</h1> and <p>Text</p>.',
            '<br> creates a line break without needing a closing tag.'
          ],
          revisionPoints: ['HTML = HyperText Markup Language', '<h1> is largest heading', '<p> creates a paragraph'],
          practiceQuestions: [
            { question: 'What does HTML stand for?', answer: 'HyperText Markup Language.' },
            { question: 'Which tag gives the largest heading?', answer: '<h1>.' }
          ],
          quizQuestions: [
            { question: 'What does HTML stand for?', options: ['High Text Machine Language', 'HyperText Markup Language', 'Hyper Tool Multi Language', 'Home Text Markup Link'], correctIndex: 1, explanation: 'HTML is HyperText Markup Language.' },
            { question: 'Which heading tag renders the largest title?', options: ['<h6>', '<h3>', '<h1>', '<p>'], correctIndex: 2, explanation: '<h1> is the top-level largest heading.' },
            { question: 'Which tag holds the visible content of a webpage?', options: ['<head>', '<body>', '<title>', '<meta>'], correctIndex: 1, explanation: 'Visible webpage content goes inside <body>.' },
            { question: 'Which is an empty (self-closing) tag for a line break?', options: ['<p>', '<br>', '<h1>', '<div>'], correctIndex: 1, explanation: '<br> inserts a single line break.' },
            { question: 'HTML files are saved with the extension:', options: ['.docx', '.html', '.xlsx', '.mp3'], correctIndex: 1, explanation: 'Web pages use .html or .htm.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Charts & Sorting in Spreadsheets',
          topics: ['Sorting A–Z / High–Low', 'Column & Pie charts', 'AVERAGE, MIN, MAX functions'],
          summary: 'Analyze class marks and survey data using AVERAGE, MIN, MAX formulas and visual bar/pie charts.',
          objectives: ['Use AVERAGE, MIN, MAX', 'Choose column vs pie chart'],
          studyNotes: [
            '=AVERAGE(B2:B6) finds the mean; =MAX(...) finds the highest value; =MIN(...) finds the lowest.',
            'Column charts compare categories side by side; Pie charts show parts of a 100% whole.'
          ],
          revisionPoints: ['=AVERAGE() computes mean', 'Pie chart shows percentages of a whole'],
          practiceQuestions: [
            { question: 'Which function finds the highest score in cells C2:C10?', answer: '=MAX(C2:C10).' },
            { question: 'Which chart best compares monthly rainfall across 6 months?', answer: 'A Column or Bar chart.' }
          ],
          quizQuestions: [
            { question: 'Which formula finds the highest mark in A1:A10?', options: ['=HIGH(A1:A10)', '=MAX(A1:A10)', '=TOP(A1:A10)', '=SUM(A1:A10)'], correctIndex: 1, explanation: 'MAX returns the largest value in a range.' },
            { question: 'Which chart looks like a divided circle showing parts of a whole?', options: ['Line chart', 'Pie chart', 'Scatter plot', 'Bar chart'], correctIndex: 1, explanation: 'Pie charts show proportions of a total.' },
            { question: 'To find the mean of B1:B5, type:', options: ['=MEAN(B1:B5)', '=AVERAGE(B1:B5)', '=MID(B1:B5)', '=SUM(B1:B5)'], correctIndex: 1, explanation: 'AVERAGE calculates arithmetic mean.' },
            { question: 'Sorting marks from highest to lowest is called:', options: ['Ascending order', 'Descending order', 'Filtering', 'Merging'], correctIndex: 1, explanation: 'Descending goes from largest to smallest.' },
            { question: 'Which function returns the smallest number in a range?', options: ['=LOW()', '=MIN()', '=LESS()', '=SUB()'], correctIndex: 1, explanation: 'MIN returns the minimum value.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 7 ====================
  {
    classNumber: 7,
    label: 'Class 7',
    stage: 'Middle (Classes 6–8)',
    subjects: [
      makeSubject(7, 'math', 'Mathematics', 'Mathematics', 'blue', 'Integers, fractions & decimals, algebraic expressions, triangles, and percentages.', [
        {
          title: 'Integers: Multiplication & Division',
          topics: ['Sign rules (+ × − = −)', 'Additive & multiplicative identity', 'Distributive property'],
          summary: 'Master operations on positive and negative integers and apply sign rules accurately in multi-step expressions.',
          objectives: ['Multiply and divide integers with correct signs', 'Use distributive property to simplify mental math'],
          studyNotes: [
            'Same signs give positive: (+)×(+) = (+) and (−)×(−) = (+). Opposite signs give negative: (+)×(−) = (−).',
            'Zero is the additive identity (a + 0 = a). One is the multiplicative identity (a × 1 = a).'
          ],
          revisionPoints: ['(−) × (−) = (+)', '(−) × (+) = (−)', 'a ÷ 0 is not defined'],
          practiceQuestions: [
            { question: 'Evaluate (-5) × (-4) × (-2).', answer: '20 × (-2) = -40 (three negatives give negative).' },
            { question: 'Evaluate (-48) ÷ 6.', answer: '-8.' }
          ],
          quizQuestions: [
            { question: 'What is (-6) × (-7)?', options: ['-42', '42', '-13', '13'], correctIndex: 1, explanation: 'Product of two negative integers is positive (+42).' },
            { question: 'What is (-36) ÷ (-9)?', options: ['-4', '4', '-27', '27'], correctIndex: 1, explanation: 'Dividing two negatives gives a positive quotient (+4).' },
            { question: 'What is (-1) multiplied by itself 5 times?', options: ['1', '-1', '5', '-5'], correctIndex: 1, explanation: 'An odd number of negative factors yields a negative product (-1).' },
            { question: 'Which is the additive inverse of -19?', options: ['-19', '0', '19', '1/19'], correctIndex: 2, explanation: '-19 + 19 = 0.' },
            { question: 'Evaluate 18 × (-5) + 18 × 5:', options: ['180', '-180', '0', '90'], correctIndex: 2, explanation: '18 × (-5 + 5) = 18 × 0 = 0.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Fractions, Decimals & Linear Equations',
          topics: ['Dividing fractions', 'Multiplying decimals', 'Balancing simple equations'],
          summary: 'Multiply and divide fractions and decimals, and solve single-variable linear equations by balancing both sides.',
          objectives: ['Divide fractions using reciprocals', 'Solve equations like 3x + 5 = 20'],
          studyNotes: [
            'To divide by a fraction, multiply by its reciprocal: (3/4) ÷ (2/5) = (3/4) × (5/2) = 15/8.',
            'In a linear equation, moving a term across "=" changes its sign (transposition).'
          ],
          revisionPoints: ['a/b ÷ c/d = a/b × d/c', 'Count total decimal places when multiplying', 'Transposing + becomes −'],
          practiceQuestions: [
            { question: 'Solve 4x − 7 = 13.', answer: '4x = 20 -> x = 5.' },
            { question: 'Multiply 0.3 × 0.04.', answer: '0.012 (3 decimal places total).' }
          ],
          quizQuestions: [
            { question: 'Solve for x: 2x + 6 = 18', options: ['4', '5', '6', '12'], correctIndex: 2, explanation: '2x = 12, so x = 6.' },
            { question: 'What is (2/5) ÷ (4/5)?', options: ['8/25', '1/2', '2', '4/2'], correctIndex: 1, explanation: '(2/5) × (5/4) = 10/20 = 1/2.' },
            { question: 'What is 0.4 × 0.2?', options: ['0.8', '0.08', '0.008', '8.0'], correctIndex: 1, explanation: '4 × 2 = 8 with 2 decimal places = 0.08.' },
            { question: 'If x/3 = 7, what is x?', options: ['10', '4', '21', '7/3'], correctIndex: 2, explanation: 'x = 7 × 3 = 21.' },
            { question: 'Write an equation for: "5 added to twice a number y gives 17."', options: ['5y + 2 = 17', '2y + 5 = 17', 'y + 5 = 17', '2(y+5) = 17'], correctIndex: 1, explanation: 'Twice y is 2y; adding 5 gives 2y + 5 = 17.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Algebraic Expressions & Triangles',
          topics: ['Terms, coefficients, like terms', 'Angle sum property of triangle', 'Pythagoras property intro'],
          summary: 'Simplify algebraic expressions by combining like terms, and apply the 180° angle sum and Pythagoras properties of triangles.',
          objectives: ['Identify coefficients and like terms', 'Verify sum of triangle angles = 180°', 'Use a² + b² = c² for right triangles'],
          studyNotes: [
            'Like terms have identical variable parts (e.g., 5x² and -2x²). Only like terms can be added or subtracted.',
            'The sum of the three interior angles of any triangle is always 180°.'
          ],
          revisionPoints: ['Angle sum of triangle = 180°', 'Exterior angle = sum of 2 interior opposite angles', 'Right triangle: h² = p² + b²'],
          practiceQuestions: [
            { question: 'Two angles of a triangle are 50° and 65°. Find the third angle.', answer: '180° − (50° + 65°) = 65°.' },
            { question: 'Simplify 7x + 3y − 2x + 5y.', answer: '5x + 8y.' }
          ],
          quizQuestions: [
            { question: 'What is the sum of all interior angles of a triangle?', options: ['90°', '180°', '270°', '360°'], correctIndex: 1, explanation: 'Every triangle’s three interior angles sum to 180°.' },
            { question: 'What is the coefficient of x in -7xy?', options: ['7', '-7', '-7y', 'y'], correctIndex: 2, explanation: 'Everything multiplying x is -7y (numerical coefficient is -7).' },
            { question: 'In a right triangle with legs 3 cm and 4 cm, the hypotenuse is:', options: ['5 cm', '6 cm', '7 cm', '12 cm'], correctIndex: 0, explanation: '3² + 4² = 9 + 16 = 25 = 5².' },
            { question: 'Which pair are like terms?', options: ['3x and 3y', '5ab and -2ba', '4x and 4x²', '7 and 7x'], correctIndex: 1, explanation: 'ab and ba have the same variables to the same powers.' },
            { question: 'A triangle with all three sides equal has each angle equal to:', options: ['45°', '60°', '90°', '120°'], correctIndex: 1, explanation: '180° ÷ 3 = 60° (equilateral triangle).' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(7, 'science', 'Science', 'Science', 'mint', 'Nutrition in plants, heat, acids & bases, respiration, and motion.', [
        {
          title: 'Nutrition in Plants & Photosynthesis',
          topics: ['Autotrophs vs heterotrophs', 'Photosynthesis equation', 'Symbiotic & insectivorous plants'],
          summary: 'Understand how green plants synthesize carbohydrates using sunlight and chlorophyll, and explore parasitic and symbiotic modes.',
          objectives: ['Write the word equation for photosynthesis', 'Explain role of stomata and Rhizobium'],
          studyNotes: [
            'Photosynthesis: Carbon dioxide + Water —(Sunlight / Chlorophyll)→ Carbohydrate (Glucose) + Oxygen.',
            'Stomata are tiny pores on leaf undersides for gas exchange. Rhizobium bacteria in leguminous roots fix atmospheric nitrogen.'
          ],
          revisionPoints: ['CO2 + H2O -> Glucose + O2', 'Cuscuta = parasite', 'Pitcher plant traps insects for nitrogen'],
          practiceQuestions: [
            { question: 'Why do pitcher plants trap insects even though they are green?', answer: 'They grow in nitrogen-poor soil and digest insects to get nitrogen.' },
            { question: 'What is lichen an example of?', answer: 'Symbiosis between an alga (makes food) and a fungus (provides shelter & water).' }
          ],
          quizQuestions: [
            { question: 'Which gas is released during photosynthesis?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Methane'], correctIndex: 2, explanation: 'Plants take in CO2 and release Oxygen.' },
            { question: 'Tiny pores on leaves surrounded by guard cells are:', options: ['Chloroplasts', 'Stomata', 'Villi', 'Roots'], correctIndex: 1, explanation: 'Stomata regulate gas exchange and transpiration.' },
            { question: 'Cuscuta (Amarbel) is an example of a:', options: ['Autotroph', 'Parasite', 'Saprotroph', 'Symbiont'], correctIndex: 1, explanation: 'Cuscuta lacks chlorophyll and takes food from a host plant.' },
            { question: 'Which organism fixes nitrogen in pea plant root nodules?', options: ['Amoeba', 'Rhizobium', 'Yeast', 'Mushroom'], correctIndex: 1, explanation: 'Rhizobium bacteria convert air nitrogen into usable soil forms.' },
            { question: 'Fungi growing on moist bread obtain nutrients as:', options: ['Autotrophs', 'Saprotrophs', 'Insectivores', 'Herbivores'], correctIndex: 1, explanation: 'Saprotrophs feed on dead and decaying organic matter.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Acids, Bases and Physical/Chemical Changes',
          topics: ['Natural indicators (Litmus, Turmeric, China rose)', 'Neutralization reaction', 'Rusting & crystallization'],
          summary: 'Test acids and bases using indicators, understand neutralization, and separate reversible physical changes from chemical reactions.',
          objectives: ['Predict litmus color changes', 'Distinguish physical vs chemical changes'],
          studyNotes: [
            'Acids taste sour and turn blue litmus RED. Bases taste bitter, feel soapy, and turn red litmus BLUE.',
            'Acid + Base -> Salt + Water + Heat (Neutralization). Chemical changes produce new substances (rusting, burning).'
          ],
          revisionPoints: ['Acid: Blue -> Red', 'Base: Red -> Blue', 'Galvanization prevents rusting by zinc coating'],
          practiceQuestions: [
            { question: 'How does turmeric paste react to soap solution?', answer: 'Soap is basic, so yellow turmeric turns reddish-brown.' },
            { question: 'Why is melting ice a physical change?', answer: 'No new substance is formed; it remains water and can be refrozen.' }
          ],
          quizQuestions: [
            { question: 'Acids turn blue litmus paper:', options: ['Green', 'Red', 'Yellow', 'Colorless'], correctIndex: 1, explanation: 'Acids turn blue litmus red.' },
            { question: 'What are the products of a neutralization reaction?', options: ['Acid and Gas', 'Salt and Water', 'Sugar and Oxygen', 'Rust and Ash'], correctIndex: 1, explanation: 'Acid + Base -> Salt + Water.' },
            { question: 'Which of these is a chemical change?', options: ['Cutting paper', 'Melting wax', 'Rusting of iron', 'Boiling water'], correctIndex: 2, explanation: 'Rust is a new substance (iron oxide).' },
            { question: 'Coating iron with zinc to stop rusting is called:', options: ['Crystallization', 'Galvanization', 'Evaporation', 'Neutralization'], correctIndex: 1, explanation: 'Galvanization protects iron from air and moisture.' },
            { question: 'Which acid is present in lemon juice?', options: ['Acetic acid', 'Citric acid', 'Lactic acid', 'Formic acid'], correctIndex: 1, explanation: 'Citrus fruits contain citric acid.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Heat, Motion & Time',
          topics: ['Conduction, Convection, Radiation', 'Clinical vs laboratory thermometer', 'Speed = Distance / Time'],
          summary: 'Understand how heat travels through solids, fluids, and vacuum, and calculate speed from distance-time graphs.',
          objectives: ['Compare conduction, convection, radiation', 'Compute Speed = Distance ÷ Time'],
          studyNotes: [
            'Conduction occurs in solids (metals). Convection occurs in liquids and gases (sea/land breeze). Radiation needs no medium (Sun to Earth).',
            'Speed = Total Distance ÷ Total Time. Standard SI unit is metre per second (m/s).'
          ],
          revisionPoints: ['Normal human body temp = 37°C', 'Speed = Distance / Time', 'A straight-line distance-time graph = uniform speed'],
          practiceQuestions: [
            { question: 'A car travels 150 km in 3 hours. What is its speed?', answer: '150 ÷ 3 = 50 km/h.' },
            { question: 'How does heat reach Earth from the Sun through empty space?', answer: 'By radiation.' }
          ],
          quizQuestions: [
            { question: 'What is normal human body temperature in Celsius?', options: ['35°C', '37°C', '40°C', '98.6°C'], correctIndex: 1, explanation: '37°C (or 98.6°F) is normal human body temperature.' },
            { question: 'Heat from the Sun reaches Earth primarily by:', options: ['Conduction', 'Convection', 'Radiation', 'Evaporation'], correctIndex: 2, explanation: 'Radiation requires no material medium.' },
            { question: 'What is the SI unit of speed?', options: ['km/h', 'm/s', 'cm/min', 'm/h'], correctIndex: 1, explanation: 'Metre per second (m/s) is the basic SI unit.' },
            { question: 'A bus covers 240 km in 4 hours. Its speed is:', options: ['40 km/h', '50 km/h', '60 km/h', '80 km/h'], correctIndex: 2, explanation: '240 ÷ 4 = 60 km/h.' },
            { question: 'Which instrument measures distance travelled by a vehicle?', options: ['Speedometer', 'Odometer', 'Thermometer', 'Barometer'], correctIndex: 1, explanation: 'Odometer records distance; speedometer shows instantaneous speed.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(7, 'sst', 'Social Science', 'Social Science', 'peach', 'Medieval kingdoms, Atmosphere & Water (Geography), and Equality & State Government (Civics).', [
        {
          title: 'The Delhi Sultans & The Mughals',
          topics: ['Slave, Khalji, Tughluq dynasties', 'Akbar’s administrative policies', 'Mansabdari system'],
          summary: 'Trace the transformation of Delhi into an imperial capital and examine Mughal administration under Akbar.',
          objectives: ['Identify key Delhi Sultanate dynasties', 'Explain Sulh-i-kul and Mansabdari'],
          studyNotes: [
            'Razia Sultan became the first woman ruler of the Delhi Sultanate in 1236.',
            'Akbar promoted Sulh-i-kul ("universal peace") and organized officers through the Mansabdari ranking system (Zat & Sawar).'
          ],
          revisionPoints: ['Razia Sultan (1236)', 'Mansab = rank/position', 'Sulh-i-kul = universal peace'],
          practiceQuestions: [
            { question: 'What did the term "Zat" indicate in the Mansabdari system?', answer: 'The personal rank and salary of a Mughal noble/official.' },
            { question: 'Who wrote Akbar Nama?', answer: 'Abul Fazl.' }
          ],
          quizQuestions: [
            { question: 'Who was the only woman ruler of the Delhi Sultanate?', options: ['Nur Jahan', 'Razia Sultan', 'Mumtaz Mahal', 'Rudrama Devi'], correctIndex: 1, explanation: 'Razia Sultan ruled Delhi from 1236 to 1240.' },
            { question: 'What does "Sulh-i-kul" mean?', options: ['Tax collection', 'Universal peace and tolerance', 'Military drill', 'Fort building'], correctIndex: 1, explanation: 'Akbar championed universal peace across faiths.' },
            { question: 'Who wrote the three-volume history "Akbar Nama"?', options: ['Birbal', 'Abul Fazl', 'Tansen', 'Todar Mal'], correctIndex: 1, explanation: 'Abul Fazl was Akbar’s court historian.' },
            { question: 'Who introduced the token copper currency in Delhi Sultanate?', options: ['Alauddin Khalji', 'Muhammad Tughluq', 'Iltutmish', 'Babur'], correctIndex: 1, explanation: 'Muhammad bin Tughluq experimented with token brass/copper currency.' },
            { question: 'In the Mansabdari system, "Sawar" denoted:', options: ['Foot soldiers', 'Cavalrymen maintained', 'Land area', 'Grain tax'], correctIndex: 1, explanation: 'Sawar indicated the number of cavalrymen a mansabdar maintained.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'Inside Our Earth & Atmosphere',
          topics: ['Crust, Mantle, Core', 'Igneous, Sedimentary, Metamorphic rocks', 'Layers of atmosphere'],
          summary: 'Explore Earth’s concentric layers, the rock cycle, and the five atmospheric layers protecting life.',
          objectives: ['Compare Crust, Mantle, Core', 'Classify the three rock types', 'Name atmospheric layers'],
          studyNotes: [
            'Earth has 3 layers: thin outer Crust (sial/sima), middle Mantle (2900 km), and inner molten/solid Core (nife: nickel & iron).',
            'Atmospheric layers upward: Troposphere (weather happens here), Stratosphere (ozone layer), Mesosphere, Thermosphere, Exosphere.'
          ],
          revisionPoints: ['Crust -> Mantle -> Core', 'Troposphere = weather layer', 'Stratosphere = Ozone layer'],
          practiceQuestions: [
            { question: 'Which gas makes up 78% of Earth’s atmosphere?', answer: 'Nitrogen (78%), followed by Oxygen (21%).' },
            { question: 'How are igneous rocks formed?', answer: 'By cooling and solidification of molten magma or lava.' }
          ],
          quizQuestions: [
            { question: 'Which is the thinnest outermost layer of the Earth?', options: ['Mantle', 'Core', 'Crust', 'Magma'], correctIndex: 2, explanation: 'The Crust forms Earth’s thin outer shell.' },
            { question: 'In which atmospheric layer do rain, clouds, and weather occur?', options: ['Stratosphere', 'Troposphere', 'Mesosphere', 'Exosphere'], correctIndex: 1, explanation: 'Troposphere is the lowest layer holding most air and water vapour.' },
            { question: 'The ozone layer that shields us from UV rays lies in the:', options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'], correctIndex: 1, explanation: 'Ozone is concentrated in the Stratosphere.' },
            { question: 'Limestone turning into marble under heat and pressure forms a:', options: ['Igneous rock', 'Metamorphic rock', 'Fossil', 'Sandstone'], correctIndex: 1, explanation: 'Heat and pressure transform rocks into metamorphic rocks.' },
            { question: 'The innermost Core (NiFe) is rich in:', options: ['Silicon and Gold', 'Nickel and Iron', 'Calcium and Salt', 'Carbon and Tin'], correctIndex: 1, explanation: 'Ni = Nickel, Fe = Ferrous (Iron).' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'How State Government Works & Media',
          topics: ['MLAs and Legislative Assembly', 'Governor & Chief Minister', 'Role of independent media'],
          summary: 'Understand how MLAs are elected from constituencies to form the State Government and why unbiased media matters in democracy.',
          objectives: ['Explain MLA election & majority party', 'Analyze media accountability'],
          studyNotes: [
            'Each state is divided into constituencies. Voters elect one MLA (Member of Legislative Assembly) per constituency.',
            'The party winning more than half the seats forms the ruling government, led by the Chief Minister.'
          ],
          revisionPoints: ['MLA = Member of Legislative Assembly', 'Majority > 50% seats', 'Independent media checks government'],
          practiceQuestions: [
            { question: 'Who appoints the Chief Minister of a state?', answer: 'The Governor appoints the leader of the majority party/coalition.' },
            { question: 'What is a coalition government?', answer: 'When two or more parties join together to achieve a majority.' }
          ],
          quizQuestions: [
            { question: 'What does MLA stand for?', options: ['Master of Local Administration', 'Member of Legislative Assembly', 'Minister of Law Affairs', 'Member of Lok Adalat'], correctIndex: 1, explanation: 'Elected state representatives are MLAs.' },
            { question: 'Where do MLAs debate state laws and budgets?', options: ['Supreme Court', 'Vidhan Sabha (Legislative Assembly)', 'Gram Sabha', 'Post Office'], correctIndex: 1, explanation: 'State legislatures meet in the Vidhan Sabha.' },
            { question: 'Who is the constitutional head of a State?', options: ['Mayor', 'Governor', 'Sarpanch', 'District Collector'], correctIndex: 1, explanation: 'The Governor is the state’s constitutional head.' },
            { question: 'Parties that do not form the government sit in the:', options: ['Cabinet', 'Opposition', 'Judiciary', 'Press'], correctIndex: 1, explanation: 'The Opposition questions and checks ruling policies.' },
            { question: 'Why is balanced reporting important in media?', options: ['To hide facts', 'So citizens form informed opinions', 'To sell more ads', 'To repeat rumours'], correctIndex: 1, explanation: 'Democracy relies on accurate, balanced information.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(7, 'english', 'English', 'Languages', 'lavender', 'Active & passive voice, direct & indirect speech, clauses, and formal writing.', [
        {
          title: 'Active and Passive Voice',
          topics: ['Subject-Object swap', 'Using "by" + past participle', 'Tense transformations'],
          summary: 'Convert sentences smoothly between Active and Passive voice while keeping the tense accurate.',
          objectives: ['Identify active vs passive voice', 'Convert simple present and past sentences to passive'],
          studyNotes: [
            'Active: Subject performs action ("Aarav painted a landscape"). Passive: Object becomes focus ("A landscape was painted by Aarav").',
            'Passive always uses a form of "be" + V3 (past participle).'
          ],
          revisionPoints: ['Passive = be + V3', 'Keep tense unchanged', 'Object -> Subject'],
          practiceQuestions: [
            { question: 'Change to Passive: "She writes a poem."', answer: 'A poem is written by her.' },
            { question: 'Change to Active: "The match was won by our team."', answer: 'Our team won the match.' }
          ],
          quizQuestions: [
            { question: 'Change to Passive: "The gardener waters the plants."', options: ['The plants watered the gardener.', 'The plants are watered by the gardener.', 'The plants were watered by the gardener.', 'The plants is watered.'], correctIndex: 1, explanation: 'Simple present passive: are + past participle (watered).' },
            { question: 'Which sentence is in Passive voice?', options: ['Rohan kicked the ball.', 'The letter was delivered today.', 'Birds build nests.', 'We watched a film.'], correctIndex: 1, explanation: 'The subject (letter) receives the action (was delivered).' },
            { question: 'Change to Passive: "She baked a cake."', options: ['A cake is baked by her.', 'A cake was baked by her.', 'A cake has baked by her.', 'She was baking a cake.'], correctIndex: 1, explanation: 'Simple past -> was + V3 (baked).' },
            { question: 'Which verb form is ALWAYS used in passive voice?', options: ['V1 (Base)', 'V2 (Past)', 'V3 (Past Participle)', 'V-ing'], correctIndex: 2, explanation: 'Passive voice requires past participle (V3).' },
            { question: 'Change to Active: "A song is sung by Priya."', options: ['Priya sang a song.', 'Priya sings a song.', 'Priya will sing a song.', 'Priya is singing a song.'], correctIndex: 1, explanation: '"is sung" is simple present -> Priya sings a song.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Direct and Indirect (Reported) Speech',
          topics: ['Reporting statements', 'Tense backshift', 'Pronoun & time-word changes'],
          summary: 'Report what someone else said without quotation marks by adjusting pronouns, tense, and time words.',
          objectives: ['Convert quoted speech to reported speech', 'Shift today->that day, now->then'],
          studyNotes: [
            'Direct: Aman said, "I am happy today." Indirect: Aman said that he was happy that day.',
            'Universal truths stay in present tense: The teacher said, "The Earth is round" -> The teacher said that the Earth is round.'
          ],
          revisionPoints: ['now -> then', 'today -> that day', 'tomorrow -> the next day'],
          practiceQuestions: [
            { question: 'Convert: "Riya said, \'I like painting.\'"', answer: 'Riya said that she liked painting.' },
            { question: 'Does a universal truth change tense in reported speech?', answer: 'No, it remains in simple present.' }
          ],
          quizQuestions: [
            { question: 'Indirect speech of: He said, "I am tired."', options: ['He said that he is tired.', 'He said that he was tired.', 'He said I was tired.', 'He says he was tired.'], correctIndex: 1, explanation: '"am" backshifts to "was" and "I" changes to "he".' },
            { question: 'In indirect speech, "tomorrow" changes to:', options: ['yesterday', 'that day', 'the next day', 'now'], correctIndex: 2, explanation: 'Tomorrow shifts to "the next day" or "the following day".' },
            { question: 'Indirect of: She said, "The sun rises in the east."', options: ['She said that the sun rose in the east.', 'She said that the sun rises in the east.', 'She said the sun will rise.', 'She asked if sun rises.'], correctIndex: 1, explanation: 'Universal truths keep simple present tense.' },
            { question: 'Indirect of: "Where do you live?" he asked me.', options: ['He asked me where did I live.', 'He asked me where I lived.', 'He said where I live.', 'He asked where do I live.'], correctIndex: 1, explanation: 'Reported questions use statement word order (where I lived).' },
            { question: '"here" in direct speech usually becomes ___ in indirect speech.', options: ['near', 'there', 'where', 'this'], correctIndex: 1, explanation: 'Here shifts to there.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Phrases, Clauses & Notice Writing',
          topics: ['Noun, adjective, adverb phrases', 'Independent vs dependent clauses', 'School Notice format'],
          summary: 'Distinguish phrases from clauses and draft crisp, formal school notices.',
          objectives: ['Identify finite verbs in clauses', 'Write notices within 50 words with all 5 Ws'],
          studyNotes: [
            'A phrase lacks a subject-verb pair (in the morning). A clause contains a subject and a finite verb (when the bell rang).',
            'A school notice sits inside a box with School Name, NOTICE, Date, Title, Body (What, When, Where), and Issuing Authority.'
          ],
          revisionPoints: ['Clause has Subject + Verb', 'Notice word limit ~50 words', 'Include Date, Venue, Time'],
          practiceQuestions: [
            { question: 'Is "under the banyan tree" a phrase or a clause?', answer: 'A phrase (no finite verb).' },
            { question: 'What 3 details must every event notice include?', answer: 'Date, Time, and Venue.' }
          ],
          quizQuestions: [
            { question: 'Which group of words is a clause?', options: ['On the wooden table', 'Because she worked hard', 'A basket of fresh mangoes', 'In the blue sky'], correctIndex: 1, explanation: '"Because she worked hard" has subject (she) + verb (worked).' },
            { question: 'A formal school notice must include:', options: ['Emoji stickers', 'Date, venue, and time', 'Personal jokes', 'Home address'], correctIndex: 1, explanation: 'Notices concisely inform readers of date, time, and venue.' },
            { question: 'Which conjunction introduces a dependent clause?', options: ['Although', 'Table', 'Quickly', 'Under'], correctIndex: 0, explanation: 'Subordinating conjunctions like "although" start dependent clauses.' },
            { question: 'Identify the phrase: "The boy with the red cap won."', options: ['The boy won', 'with the red cap', 'boy won', 'none'], correctIndex: 1, explanation: '"with the red cap" is a prepositional phrase.' },
            { question: 'A notice is always enclosed inside a:', options: ['Circle', 'Rectangular box', 'Triangle', 'Cloud'], correctIndex: 1, explanation: 'CBSE formatting places notices inside a neat box.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(7, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'समास परिचय, अव्यय, अलंकार प्रारंभिक परिचय और निबंध लेखन।', [
        {
          title: 'समास परिचय (द्वंद्व, द्विगु, तत्पुरुष)',
          topics: ['समास और समास-विग्रह', 'द्वंद्व और द्विगु समास'],
          summary: 'दो या अधिक शब्दों के मेल से नए संक्षिप्त शब्द बनाने की प्रक्रिया (समास) को समझें।',
          objectives: ['समस्तपद और विग्रह पहचानना', 'द्विगु व द्वंद्व समास में अंतर करना'],
          studyNotes: [
            'द्विगु समास में पहला पद संख्यावाची होता है: चौराहा (चार राहों का समूह), त्रिभुज (तीन भुजाओं का समूह)।',
            'द्वंद्व समास में दोनों पद प्रधान होते हैं और बीच में "और/या" आता है: माता-पिता (माता और पिता)।'
          ],
          revisionPoints: ['संख्या पहला पद = द्विगु', 'दोनों पद प्रधान = द्वंद्व'],
          practiceQuestions: [
            { question: '"त्रिलोक" में कौन-सा समास है?', answer: 'द्विगु समास (तीन लोकों का समाहार)।' },
            { question: '"दिन-रात" का समास-विग्रह लिखिए।', answer: 'दिन और रात (द्वंद्व समास)।' }
          ],
          quizQuestions: [
            { question: '"चौराहा" में कौन-सा समास है?', options: ['द्वंद्व', 'द्विगु', 'कर्मधारय', 'अव्ययीभाव'], correctIndex: 1, explanation: 'प्रथम पद "चौ" (चार) संख्यावाचक होने से द्विगु समास है।' },
            { question: '"माता-पिता" किस समास का उदाहरण है?', options: ['द्विगु', 'तत्पुरुष', 'द्वंद्व', 'बहुव्रीहि'], correctIndex: 2, explanation: 'माता और पिता दोनों पद प्रधान हैं—द्वंद्व समास।' },
            { question: '"राजपुत्र" (राजा का पुत्र) में कौन-सा समास है?', options: ['तत्पुरुष', 'द्विगु', 'द्वंद्व', 'अव्ययीभाव'], correctIndex: 0, explanation: 'कारक चिह्न "का" का लोप होने से तत्पुरुष समास है।' },
            { question: 'द्विगु समास का प्रथम पद हमेशा होता है:', options: ['क्रिया', 'संख्यावाचक', 'सर्वनाम', 'अव्यय'], correctIndex: 1, explanation: 'द्विगु का पहला पद संख्या बताता है।' },
            { question: '"नवरत्न" का समास विग्रह है:', options: ['नौ रत्न और सोना', 'नौ रत्नों का समूह', 'नया रत्न', 'रत्न के बिना'], correctIndex: 1, explanation: 'नव अर्थात नौ रत्नों का समूह।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'अविकारी शब्द (अव्यय)',
          topics: ['क्रियाविशेषण', 'संबंधबोधक', 'समुच्चयबोधक', 'विस्मयादिबोधक'],
          summary: 'लिंग, वचन और कारक से अपरिवर्तित रहने वाले अविकारी शब्दों के चार भेद सीखें।',
          objectives: ['अव्यय के भेद पहचानना', 'वाक्यों में सही समुच्चयबोधक लगाना'],
          studyNotes: [
            'क्रियाविशेषण क्रिया की विशेषता बताते हैं (धीरे-धीरे, कल)। समुच्चयबोधक वाक्यों को जोड़ते हैं (और, परंतु, इसलिए)।'
          ],
          revisionPoints: ['अव्यय = अपरिवर्तनीय', 'वाह!, अरे! = विस्मयादिबोधक'],
          practiceQuestions: [
            { question: '"कछुआ धीरे-धीरे चलता है।" में क्रियाविशेषण क्या है?', answer: 'धीरे-धीरे।' },
            { question: 'शोक या आश्चर्य दिखाने वाले शब्द क्या कहलाते हैं?', answer: 'विस्मयादिबोधक अव्यय।' }
          ],
          quizQuestions: [
            { question: '"अरे! तुम कब आए?" में "अरे!" किस प्रकार का शब्द है?', options: ['संबंधबोधक', 'समुच्चयबोधक', 'विस्मयादिबोधक', 'क्रियाविशेषण'], correctIndex: 2, explanation: 'आश्चर्य प्रकट करने के कारण विस्मयादिबोधक है।' },
            { question: 'इनमें से क्रियाविशेषण चुनिए: "वह जोर से हँसा।"', options: ['वह', 'हँसा', 'जोर से', 'कोई नहीं'], correctIndex: 2, explanation: '"जोर से" हँसने की रीति बताता है।' },
            { question: 'दो वाक्यों को जोड़ने वाले "लेकिन, क्योंकि" शब्द हैं:', options: ['समुच्चयबोधक', 'विस्मयादिबोधक', 'संज्ञा', 'विशेषण'], correctIndex: 0, explanation: 'योजक शब्दों को समुच्चयबोधक कहते हैं।' },
            { question: '"घर के सामने बगीचा है।" में "के सामने" क्या है?', options: ['संबंधबोधक', 'क्रिया', 'सर्वनाम', 'काल'], correctIndex: 0, explanation: 'संज्ञा का संबंध अन्य शब्द से जोड़ने वाला अव्यय संबंधबोधक है।' },
            { question: 'अव्यय शब्द किससे प्रभावित नहीं होते?', options: ['अर्थ से', 'लिंग, वचन और कारक से', 'ध्वनि से', 'लेखन से'], correctIndex: 1, explanation: 'ये लिंग, वचन व कारक बदलने पर भी एक जैसे रहते हैं।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'अनुप्रास व उपमा अलंकार और अनुच्छेद लेखन',
          topics: ['अलंकार का अर्थ', 'अनुप्रास व उपमा', 'प्रभावशाली अनुच्छेद रचना'],
          summary: 'कविता की शोभा बढ़ाने वाले अनुप्रास व उपमा अलंकार को पहचानें और सुसंगत अनुच्छेद लिखें।',
          objectives: ['अनुप्रास में वर्णों की आवृत्ति पहचानना', 'उपमा में तुलना समझना'],
          studyNotes: [
            'अनुप्रास अलंकार: एक ही वर्ण की बार-बार आवृत्ति ("चारु चंद्र की चंचल किरणें")। उपमा अलंकार: सा, सी, सम, सरिस के द्वारा दो वस्तुओं की तुलना ("चाँद-सा सुंदर मुख")।'
          ],
          revisionPoints: ['वर्ण आवृत्ति = अनुप्रास', 'तुलना (सा/सी/सम) = उपमा'],
          practiceQuestions: [
            { question: '"रघुपति राघव राजा राम" में कौन-सा अलंकार है?', answer: 'अनुप्रास अलंकार ("र" वर्ण की आवृत्ति)।' },
            { question: '"पीपर पात सरिस मन डोला" में अलंकार पहचानिए।', answer: 'उपमा अलंकार।' }
          ],
          quizQuestions: [
            { question: '"तरनि तनूजा तट तमाल तरुवर बहु छाए" में कौन-सा अलंकार है?', options: ['उपमा', 'अनुप्रास', 'रूपक', 'यमक'], correctIndex: 1, explanation: 'यहाँ "त" वर्ण की बार-बार आवृत्ति हुई है।' },
            { question: 'जहाँ एक वस्तु की तुलना दूसरी प्रसिद्ध वस्तु से "सा, सी, सम" द्वारा की जाए:', options: ['अनुप्रास', 'उपमा', 'श्लेष', 'अतिशयोक्ति'], correctIndex: 1, explanation: 'समानता दर्शाने वाला अलंकार उपमा है।' },
            { question: 'अलंकार का शाब्दिक अर्थ क्या है?', options: ['कहानी', 'आभूषण / गहना', 'व्याकरण', 'नियम'], correctIndex: 1, explanation: 'अलंकार काव्य की सुंदरता बढ़ाने वाले आभूषण हैं।' },
            { question: '"कनक-कनक ते सौ गुनी" में कौन-सा शब्द दो भिन्न अर्थ रखता है?', options: ['सौ', 'कनक (सोना/धतूरा)', 'ते', 'गुनी'], correctIndex: 1, explanation: 'कनक के दो अर्थ होने से यहाँ यमक अलंकार है।' },
            { question: 'एक अच्छे अनुच्छेद में मुख्य विचार होने चाहिए:', options: ['बिखरे हुए', 'क्रमबद्ध और एक ही विषय पर केंद्रित', 'अधूरे वाक्य', 'केवल प्रश्न'], correctIndex: 1, explanation: 'अनुच्छेद एक मुख्य विषय पर केंद्रित व क्रमबद्ध होता है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(7, 'sanskrit', 'Sanskrit (संस्कृतम् - Optional)', 'Languages', 'lavender', 'लङ् लकार (भूतकाल), लृट् लकार (भविष्यत्) और सुभाषितानि।', [
        {
          title: 'लङ् लकारः (भूतकालः)',
          topics: ['अ + धातु रूप (अपठत्, अगच्छत्)', 'सुभाषितानि का भावार्थ'],
          summary: 'संस्कृत में भूतकाल (बीते हुए समय) की क्रियाएँ बनाने हेतु धातु से पहले "अ" लगाकर रूप लिखना सीखें।',
          objectives: ['लङ् लकार के रूप पहचानना', 'भूतकाल में सरल वाक्य बनाना'],
          studyNotes: [
            'लङ् लकार में धातु के आगे "अ" जुड़ता है: सः अपठत् (उसने पढ़ा), तौ अपठताम् (उन दोनों ने पढ़ा), ते अपठन् (उन सबने पढ़ा)।'
          ],
          revisionPoints: ['अ + धातु = लङ् लकार', 'अहम् अपठम् = मैंने पढ़ा'],
          practiceQuestions: [
            { question: '"गम्" धातु का लङ् लकार प्रथम पुरुष एकवचन रूप लिखिए।', answer: 'अगच्छत्।' },
            { question: '"सत्यमेव जयते" का क्या अर्थ है?', answer: 'सत्य की ही जीत होती है।' }
          ],
          quizQuestions: [
            { question: 'लङ् लकार किस काल के लिए प्रयोग होता है?', options: ['वर्तमान काल', 'भूतकाल', 'भविष्यत् काल', 'आज्ञार्थक'], correctIndex: 1, explanation: 'लङ् लकार भूतकाल (Past Tense) दर्शाता है।' },
            { question: '"बालकः पाठम् ___" (पठ् - लङ् लकार):', options: ['पठति', 'पठिष्यति', 'अपठत्', 'पठतु'], correctIndex: 2, explanation: 'एकवचन प्रथम पुरुष भूतकाल: अपठत्।' },
            { question: '"ते विद्यालयम् अगच्छन्" में "अगच्छन्" किस वचन में है?', options: ['एकवचन', 'द्विवचन', 'बहुवचन', 'उत्तम पुरुष'], correctIndex: 2, explanation: 'ते (वे सब) के साथ बहुवचन अगच्छन् प्रयुक्त हुआ।' },
            { question: 'अहम् के साथ लङ् लकार में सही रूप होगा:', options: ['अपठत्', 'अपठम्', 'अपठः', 'अपठन्'], correctIndex: 1, explanation: 'उत्तम पुरुष एकवचन में "अम्" लगता है: अपठम्।' },
            { question: '"पृथिव्यां त्रीणि रत्नानि" श्लोक में कौन तीन रत्न बताए गए हैं?', options: ['सोना, चाँदी, हीरा', 'जलम्, अन्नम्, सुभाषितम्', 'पुस्तक, कलम, घर', 'सूर्य, चंद्र, तारे'], correctIndex: 1, explanation: 'सुभाषित श्लोक के अनुसार जल, अन्न और मधुर वचन ही सच्चे रत्न हैं।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'लृट् लकारः (भविष्यत् कालः)',
          topics: ['पठिष्यति, गमिष्यति, लेखिष्यति', 'भविष्यत् काल वाक्य निर्माण'],
          summary: 'आने वाले समय (भविष्यत् काल) के कार्यों को व्यक्त करने हेतु लृट् लकार के रूप सीखें।',
          objectives: ['"स्य/इष्य" प्रत्यय पहचानना', 'वर्तमान से भविष्यत् रूप बदलना'],
          studyNotes: [
            'लृट् लकार में धातु में "इष्यति/स्यति" जुड़ता है: पठिष्यति (पढ़ेगा), गमिष्यति (जाएगा), दास्यति (देगा)।'
          ],
          revisionPoints: ['श्वः = आने वाला कल', 'ह्यः = बीता हुआ कल', 'अद्य = आज'],
          practiceQuestions: [
            { question: '"श्वः" और "ह्यः" का अर्थ बताइए।', answer: 'श्वः = आने वाला कल; ह्यः = बीता हुआ कल।' },
            { question: '"अहम् श्वः ग्रामम् ___" (गम्):', answer: 'गमिष्यामि।' }
          ],
          quizQuestions: [
            { question: '"श्वः" अव्यय का प्रयोग किस काल के साथ होता है?', options: ['भूतकाल', 'भविष्यत् काल (लृट्)', 'केवल वर्तमान', 'कोई नहीं'], correctIndex: 1, explanation: 'श्वः (आने वाला कल) भविष्यत् काल का सूचक है।' },
            { question: '"पठ्" धातु का लृट् लकार प्रथम पुरुष एकवचन है:', options: ['पठति', 'अपठत्', 'पठिष्यति', 'पठतु'], correctIndex: 2, explanation: 'पठिष्यति = पढ़ेगा।' },
            { question: '"गम्" धातु लृट् लकार में कैसे चलती है?', options: ['गच्छिष्यति', 'गमिष्यति', 'अगच्छत्', 'गच्छति'], correctIndex: 1, explanation: 'गम् से गमिष्यति रूप बनता है।' },
            { question: '"ह्यः" का हिन्दी अर्थ क्या है?', options: ['आज', 'बीता हुआ कल', 'आने वाला कल', 'अभी'], correctIndex: 1, explanation: 'ह्यः = Yesterday।' },
            { question: '"वयम् क्रीडिष्यामः" का अर्थ है:', options: ['हम खेले थे', 'हम खेलते हैं', 'हम सब खेलेंगे', 'वे खेलेंगे'], correctIndex: 2, explanation: 'वयम् + लृट् लकार = हम सब खेलेंगे।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'प्रत्ययाः (क्त्वा एवं तुमुन्)',
          topics: ['पठित्वा (पढ़कर)', 'पठितुम् (पढ़ने के लिए)'],
          summary: 'धातुओं में क्त्वा (करके) और तुमुन् (के लिए) प्रत्यय जोड़कर सुंदर संयुक्त वाक्य बनाना सीखें।',
          objectives: ['क्त्वा और तुमुन् प्रत्यय अलग करना', 'अर्थ के अनुसार सही प्रत्यय चुनना'],
          studyNotes: [
            'क्त्वा (त्वा शेष) = करके: पठ् + क्त्वा = पठित्वा (पढ़कर), गम् + क्त्वा = गत्वा (जाकर)।',
            'तुमुन् (तुम् शेष) = के लिए: पठ् + तुमुन् = पठितुम् (पढ़ने के लिए), खाद् + तुमुन् = खादितुम् (खाने के लिए)।'
          ],
          revisionPoints: ['क्त्वा = करके', 'तुमुन् = के लिए'],
          practiceQuestions: [
            { question: '"हस् + क्त्वा" से कौन-सा शब्द बनेगा?', answer: 'हसित्वा (हँसकर)।' },
            { question: '"क्रीडितुम्" में कौन-सा प्रत्यय है?', answer: 'तुमुन् प्रत्यय (खेलने के लिए)।' }
          ],
          quizQuestions: [
            { question: '"पठ् + क्त्वा" का शुद्ध रूप क्या होगा?', options: ['पठितुम्', 'पठित्वा', 'पठन्', 'पठितः'], correctIndex: 1, explanation: 'क्त्वा प्रत्यय जुड़ने पर "पठित्वा" (पढ़कर) बनता है।' },
            { question: '"गन्तुम्" शब्द में कौन-सा प्रत्यय है?', options: ['क्त्वा', 'तुमुन्', 'ल्यप्', 'क्त'], correctIndex: 1, explanation: 'गम् + तुमुन् = गन्तुम् (जाने के लिए)।' },
            { question: '"खादित्वा" का हिन्दी अर्थ है:', options: ['खाने के लिए', 'खाकर', 'खाता है', 'खाएगा'], correctIndex: 1, explanation: 'क्त्वा का अर्थ "करके" होता है।' },
            { question: '"क्रीड् + तुमुन्" से कौन-सा पद बनेगा?', options: ['क्रीडित्वा', 'क्रीडितुम्', 'क्रीडति', 'क्रीडन्'], correctIndex: 1, explanation: 'खेलने के लिए = क्रीडितुम्।' },
            { question: '"गत्वा" में मूल धातु और प्रत्यय हैं:', options: ['गच्छ् + त्वा', 'गम् + क्त्वा', 'गम् + तुमुन्', 'गा + क्त्वा'], correctIndex: 1, explanation: 'गम् धातु में क्त्वा लगने से गत्वा बनता है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(7, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Binary number system, Python intro basics, and cyber ethics.', [
        {
          title: 'Binary & Number Systems',
          topics: ['Decimal (Base 10) vs Binary (Base 2)', 'Converting decimal to binary'],
          summary: 'Understand why computers only speak in 0s and 1s (Binary) and convert small decimal numbers to binary.',
          objectives: ['Explain Base 2 vs Base 10', 'Convert numbers 0–31 between decimal and binary'],
          studyNotes: [
            'Decimal uses 10 digits (0–9). Binary uses only 2 bits (0 and 1).',
            'Divide a decimal number repeatedly by 2 and read remainders bottom-to-top to get Binary (e.g., 10 in decimal = 1010 in binary).'
          ],
          revisionPoints: ['Binary base = 2', 'Decimal base = 10', '10₁₀ = 1010₂'],
          practiceQuestions: [
            { question: 'Convert decimal 13 to binary.', answer: '1101₂ (8 + 4 + 0 + 1).' },
            { question: 'Convert binary 1011₂ to decimal.', answer: '8 + 0 + 2 + 1 = 11.' }
          ],
          quizQuestions: [
            { question: 'What is the base of the Binary number system?', options: ['8', '10', '2', '16'], correctIndex: 2, explanation: 'Binary uses two digits: 0 and 1.' },
            { question: 'What is decimal 5 written in binary?', options: ['100', '101', '110', '111'], correctIndex: 1, explanation: '4 + 0 + 1 = 101₂.' },
            { question: 'What is binary 1000₂ in decimal?', options: ['4', '6', '8', '10'], correctIndex: 2, explanation: '1 × 2³ = 8.' },
            { question: 'A single binary digit (0 or 1) is called a:', options: ['Byte', 'Bit', 'Nibble', 'Word'], correctIndex: 1, explanation: 'Bit stands for Binary Digit.' },
            { question: '4 bits together form a:', options: ['Byte', 'Nibble', 'Kilobyte', 'Word'], correctIndex: 1, explanation: 'Half a byte (4 bits) is a nibble.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Python Basics: Variables & Print',
          topics: ['print() function', 'Variables and data types (int, str, float)', 'input()'],
          summary: 'Write your first Python statements using print(), variables, arithmetic operators, and user input.',
          objectives: ['Store values in valid Python variables', 'Perform +, -, *, / operations'],
          studyNotes: [
            'In Python, variables do not need explicit type declarations: name = "Asha", age = 12.',
            'print("Hello", name) displays output. # starts a single-line comment.'
          ],
          revisionPoints: ['# = comment', 'str = text in quotes', 'int = whole number'],
          practiceQuestions: [
            { question: 'What is the output of print(3 * 4 + 2) in Python?', answer: '14.' },
            { question: 'Can a Python variable name start with a digit like 2score?', answer: 'No, variable names must start with a letter or underscore (_).' }
          ],
          quizQuestions: [
            { question: 'Which Python function displays text on the screen?', options: ['show()', 'echo()', 'print()', 'write()'], correctIndex: 2, explanation: 'print() outputs values to the console.' },
            { question: 'Which symbol starts a comment in Python?', options: ['//', '/*', '#', '--'], correctIndex: 2, explanation: 'Python comments begin with #.' },
            { question: 'What is the data type of "Indo American"?', options: ['int', 'float', 'str', 'bool'], correctIndex: 2, explanation: 'Text inside quotes is a string (str).' },
            { question: 'Which is a valid Python variable name?', options: ['1st_mark', 'student_age', 'my-name', 'for'], correctIndex: 1, explanation: 'student_age uses letters and underscore, not reserved keywords.' },
            { question: 'What does 10 // 3 evaluate to in Python?', options: ['3.33', '3', '1', '30'], correctIndex: 1, explanation: '// is integer (floor) division, giving 3.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Computer Viruses & Cyber Ethics',
          topics: ['Malware, Virus, Trojan, Phishing', 'Antivirus protection', 'Respecting copyright'],
          summary: 'Protect devices against viruses and phishing scams while practicing honest digital citizenship.',
          objectives: ['Identify phishing warning signs', 'Explain antivirus and software updates'],
          studyNotes: [
            'Phishing tricks users via fake emails or links into revealing passwords or bank details.',
            'Keep antivirus active, avoid pirated downloads, and credit authors when using images or articles.'
          ],
          revisionPoints: ['Never click suspicious prize links', 'Use two-factor authentication', 'Plagiarism = copying without credit'],
          practiceQuestions: [
            { question: 'What is Phishing?', answer: 'A cyber scam using fake messages to steal sensitive info like passwords.' },
            { question: 'Why should we install OS updates?', answer: 'Updates patch security vulnerabilities.' }
          ],
          quizQuestions: [
            { question: 'Sending fake emails to steal passwords is known as:', options: ['Coding', 'Phishing', 'Debugging', 'Browsing'], correctIndex: 1, explanation: 'Phishing lures users to fake login pages.' },
            { question: 'Copying someone else’s essay without credit is:', options: ['Encryption', 'Plagiarism', 'Compression', 'Indexing'], correctIndex: 1, explanation: 'Plagiarism is uncredited copying.' },
            { question: 'Which software scans and removes malicious programs?', options: ['Spreadsheet', 'Antivirus', 'Media player', 'Paint'], correctIndex: 1, explanation: 'Antivirus tools detect and quarantine malware.' },
            { question: 'A malicious program disguised as a useful free game is a:', options: ['Firewall', 'Trojan Horse', 'Browser', 'Compiler'], correctIndex: 1, explanation: 'Trojans masquerade as legitimate software.' },
            { question: 'What adds a second verification step (like an OTP) to login?', options: ['Single password', 'Two-Factor Authentication (2FA)', 'Guest mode', 'Incognito'], correctIndex: 1, explanation: '2FA protects accounts even if a password leaks.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 8 ====================
  {
    classNumber: 8,
    label: 'Class 8',
    stage: 'Middle (Classes 6–8)',
    subjects: [
      makeSubject(8, 'math', 'Mathematics', 'Mathematics', 'blue', 'Rational numbers, linear equations, algebraic identities, mensuration, and exponents.', [
        {
          title: 'Rational Numbers & Linear Equations',
          topics: ['p/q form (q ≠ 0)', 'Additive & multiplicative inverse', 'Equations with variables on both sides'],
          summary: 'Work with positive and negative rational numbers and solve linear equations where variables appear on both sides.',
          objectives: ['Define rational numbers', 'Solve 5x − 3 = 2x + 9'],
          studyNotes: [
            'Any number expressible as p/q where p, q are integers and q ≠ 0 is a rational number.',
            'To solve linear equations with variables on both sides, group variable terms on LHS and constants on RHS.'
          ],
          revisionPoints: ['q can never be 0', 'Additive inverse of a/b is -a/b', 'Multiplicative inverse (reciprocal) of a/b is b/a'],
          practiceQuestions: [
            { question: 'Solve 5x − 3 = 2x + 9.', answer: '3x = 12 -> x = 4.' },
            { question: 'Find the reciprocal of -3/8.', answer: '-8/3.' }
          ],
          quizQuestions: [
            { question: 'In rational number p/q, which condition must hold?', options: ['p = 0', 'q = 0', 'q ≠ 0', 'p > q'], correctIndex: 2, explanation: 'Denominator q cannot be zero.' },
            { question: 'Solve: 7x − 9 = 16', options: ['x = 1', 'x = 25/7', 'x = 7', 'x = 5'], correctIndex: 1, explanation: '7x = 25 -> x = 25/7.' },
            { question: 'What is the multiplicative inverse of -5/9?', options: ['5/9', '-9/5', '9/5', '0'], correctIndex: 1, explanation: '(-5/9) × (-9/5) = 1.' },
            { question: 'Solve: 4z + 3 = 6 + 2z', options: ['z = 3/2', 'z = 3', 'z = 2', 'z = 9/2'], correctIndex: 0, explanation: '2z = 3 -> z = 3/2.' },
            { question: 'How many rational numbers exist between any two rational numbers?', options: ['Only 1', '10', 'Infinitely many', 'None'], correctIndex: 2, explanation: 'Rational numbers are dense—infinitely many lie between any two.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Algebraic Identities & Factorisation',
          topics: ['(a+b)² = a² + 2ab + b²', '(a−b)² = a² − 2ab + b²', 'a² − b² = (a+b)(a−b)'],
          summary: 'Expand algebraic products rapidly using standard identities and factorize quadratic expressions.',
          objectives: ['Apply all 3 standard algebraic identities', 'Factorize expressions by taking common factors & splitting'],
          studyNotes: [
            '(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; (a + b)(a − b) = a² − b².',
            'Example: 103² = (100 + 3)² = 10000 + 600 + 9 = 10609.'
          ],
          revisionPoints: ['(a+b)² = a² + 2ab + b²', 'a² − b² = (a+b)(a−b)', 'Always factor out GCF first'],
          practiceQuestions: [
            { question: 'Evaluate 98² using an identity.', answer: '(100 − 2)² = 10000 − 400 + 4 = 9604.' },
            { question: 'Factorize 49x² − 36.', answer: '(7x + 6)(7x − 6).' }
          ],
          quizQuestions: [
            { question: 'Expand (x + 5)²:', options: ['x² + 25', 'x² + 5x + 25', 'x² + 10x + 25', 'x² − 10x + 25'], correctIndex: 2, explanation: 'x² + 2(x)(5) + 5² = x² + 10x + 25.' },
            { question: 'Factorize x² − 81:', options: ['(x − 9)²', '(x + 9)(x − 9)', '(x + 81)(x − 1)', '(x + 9)²'], correctIndex: 1, explanation: 'Difference of squares: x² − 9² = (x+9)(x−9).' },
            { question: 'Evaluate 51² − 49²:', options: ['2', '100', '200', '400'], correctIndex: 2, explanation: '(51 + 49)(51 − 49) = 100 × 2 = 200.' },
            { question: 'Factorize x² + 7x + 12:', options: ['(x+3)(x+4)', '(x+2)(x+6)', '(x+1)(x+12)', '(x−3)(x−4)'], correctIndex: 0, explanation: '3 + 4 = 7 and 3 × 4 = 12.' },
            { question: 'What is (2a − 3b)²?', options: ['4a² − 9b²', '4a² − 12ab + 9b²', '4a² + 12ab + 9b²', '2a² − 6ab + 3b²'], correctIndex: 1, explanation: '(2a)² − 2(2a)(3b) + (3b)² = 4a² − 12ab + 9b².' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Exponents, Squares & Mensuration',
          topics: ['Laws of exponents & negative powers', 'Pythagorean triplets', 'Surface area & volume of cylinder'],
          summary: 'Simplify powers with negative exponents and calculate surface area and volume of cubes, cuboids, and cylinders.',
          objectives: ['Apply a⁻ᵐ = 1/aᵐ', 'Compute cylinder CSA = 2πrh and Volume = πr²h'],
          studyNotes: [
            'Laws: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ.',
            'Cylinder: Curved Surface Area = 2πrh; Total Surface Area = 2πr(r + h); Volume = πr²h.'
          ],
          revisionPoints: ['a⁰ = 1', 'Cylinder Volume = πr²h', '1 m³ = 1000 litres'],
          practiceQuestions: [
            { question: 'Simplify 2⁻³ × 2⁵.', answer: '2⁻³⁺⁵ = 2² = 4.' },
            { question: 'Find the volume of a cylinder with r = 7 cm, h = 10 cm (π = 22/7).', answer: '(22/7) × 7 × 7 × 10 = 1540 cm³.' }
          ],
          quizQuestions: [
            { question: 'What is the value of (5⁰ + 3⁰) × 2⁰?', options: ['0', '1', '2', '8'], correctIndex: 2, explanation: '(1 + 1) × 1 = 2.' },
            { question: 'Simplify 3⁻²:', options: ['-9', '-6', '1/9', '9'], correctIndex: 2, explanation: '3⁻² = 1/3² = 1/9.' },
            { question: 'What is the formula for the volume of a cylinder?', options: ['2πrh', 'πr²h', '2πr²', 'πrh'], correctIndex: 1, explanation: 'Base area (πr²) × height (h).' },
            { question: 'How many litres fit in 1 cubic metre (1 m³)?', options: ['10 L', '100 L', '1000 L', '10000 L'], correctIndex: 2, explanation: '1 m³ = 1000 litres.' },
            { question: 'Write 0.000045 in standard scientific form:', options: ['4.5 × 10⁻⁵', '4.5 × 10⁵', '45 × 10⁻⁶', '0.45 × 10⁻⁴'], correctIndex: 0, explanation: 'Move decimal 5 places right -> 4.5 × 10⁻⁵.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(8, 'science', 'Science', 'Science', 'mint', 'Force & pressure, sound, reproduction in animals, microorganisms, and light.', [
        {
          title: 'Force, Pressure and Friction',
          topics: ['Contact & non-contact forces', 'Pressure = Force / Area', 'Atmospheric pressure', 'Rolling vs sliding friction'],
          summary: 'Understand how force changes motion or shape, why sharp knives exert more pressure, and how friction helps and hinders motion.',
          objectives: ['Calculate Pressure = F / A', 'Distinguish contact and non-contact forces', 'Compare static, sliding, and rolling friction'],
          studyNotes: [
            'Force is a push or pull measured in Newtons (N). Non-contact forces include gravity, electrostatic, and magnetic forces.',
            'Pressure = Force / Area (SI unit: Pascal, Pa). Smaller contact area creates larger pressure (sharp knife, pointed nail).',
            'Rolling friction < Sliding friction < Static friction.'
          ],
          revisionPoints: ['P = F / A (Pascal)', 'Rolling friction is smallest', 'Lubricants reduce friction'],
          practiceQuestions: [
            { question: 'Why do school bags have wide straps?', answer: 'Wide straps increase contact area, reducing pressure on the shoulders.' },
            { question: 'A force of 100 N acts on an area of 2 m². Find the pressure.', answer: '100 / 2 = 50 Pa.' }
          ],
          quizQuestions: [
            { question: 'What is the SI unit of pressure?', options: ['Newton', 'Pascal', 'Joule', 'Watt'], correctIndex: 1, explanation: 'Pressure is N/m², called Pascal (Pa).' },
            { question: 'Which is a non-contact force?', options: ['Friction', 'Muscular force', 'Gravitational force', 'Tension'], correctIndex: 2, explanation: 'Gravity acts across space without physical contact.' },
            { question: 'Why do porters place a round cloth on their head when carrying heavy loads?', options: ['To look taller', 'To increase area and reduce pressure', 'To reduce weight', 'To increase friction'], correctIndex: 1, explanation: 'Larger contact area decreases pressure on the head.' },
            { question: 'Which type of friction is the smallest?', options: ['Static friction', 'Sliding friction', 'Rolling friction', 'Limiting friction'], correctIndex: 2, explanation: 'Ball bearings convert sliding into rolling friction.' },
            { question: 'If force is 60 N over 3 m², the pressure is:', options: ['180 Pa', '20 Pa', '30 Pa', '63 Pa'], correctIndex: 1, explanation: 'P = F/A = 60/3 = 20 Pa.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Sound: Vibrations, Pitch & Noise',
          topics: ['Sound needs a medium', 'Amplitude & loudness', 'Frequency (Hz) & pitch', 'Audible range (20 Hz – 20,000 Hz)'],
          summary: 'Explore how vibrating objects produce sound, what controls loudness and pitch, and how to curb noise pollution.',
          objectives: ['Relate amplitude to loudness and frequency to pitch', 'State human audible range'],
          studyNotes: [
            'Sound is produced by vibrating bodies and travels fastest in solids, slower in liquids, slowest in gases, and CANNOT travel in vacuum.',
            'Frequency (Hz) = oscillations per second; higher frequency = higher pitch (shrill voice). Amplitude determines loudness (decibels, dB).'
          ],
          revisionPoints: ['Audible range: 20 Hz to 20,000 Hz', 'Sound cannot travel in vacuum', 'Frequency -> Pitch; Amplitude -> Loudness'],
          practiceQuestions: [
            { question: 'Why can astronauts not hear each other directly on the Moon?', answer: 'The Moon has no atmosphere (vacuum), and sound needs a medium to travel.' },
            { question: 'A pendulum oscillates 40 times in 4 seconds. Find its frequency.', answer: '40 / 4 = 10 Hz.' }
          ],
          quizQuestions: [
            { question: 'Through which medium can sound NOT travel?', options: ['Steel', 'Water', 'Air', 'Vacuum'], correctIndex: 3, explanation: 'Sound requires particles of a medium to propagate.' },
            { question: 'What is the unit of frequency?', options: ['Decibel', 'Hertz (Hz)', 'Metre', 'Newton'], correctIndex: 1, explanation: '1 Hertz = 1 oscillation per second.' },
            { question: 'Loudness of a sound depends on its:', options: ['Frequency', 'Amplitude', 'Speed', 'Medium only'], correctIndex: 1, explanation: 'Larger vibration amplitude produces louder sound.' },
            { question: 'What is the audible frequency range for human ears?', options: ['1 Hz to 100 Hz', '20 Hz to 20,000 Hz', '100 Hz to 50,000 Hz', 'Above 20,000 Hz'], correctIndex: 1, explanation: 'Humans hear between 20 Hz and 20 kHz.' },
            { question: 'Which part vibrates inside the human voice box (larynx)?', options: ['Eardrum', 'Vocal cords', 'Tongue', 'Teeth'], correctIndex: 1, explanation: 'Air passes through stretched vocal cords making them vibrate.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Reproduction in Animals & Microorganisms',
          topics: ['Sexual vs asexual reproduction', 'Budding & binary fission', 'Useful vs harmful microbes'],
          summary: 'Compare sexual reproduction (internal/external fertilization) with asexual budding and fission, and study friendly vs harmful microbes.',
          objectives: ['Distinguish oviparous and viviparous animals', 'Give examples of budding (Hydra) and fission (Amoeba)'],
          studyNotes: [
            'Egg-laying animals are oviparous (hen, frog); animals giving birth to young ones are viviparous (humans, dogs).',
            'Hydra reproduces asexually by budding; Amoeba divides by binary fission.',
            'Lactobacillus turns milk into curd; Yeast helps bake bread; Alexander Fleming discovered Penicillin.'
          ],
          revisionPoints: ['Hydra -> Budding', 'Amoeba -> Binary fission', 'Lactobacillus -> Curd'],
          practiceQuestions: [
            { question: 'What is metamorphosis?', answer: 'Drastic transformation from larva to adult through distinct stages (e.g., tadpole to frog).' },
            { question: 'Name the bacterium that converts milk into curd.', answer: 'Lactobacillus.' }
          ],
          quizQuestions: [
            { question: 'How does Amoeba reproduce?', options: ['Budding', 'Binary fission', 'Seed dispersal', 'Spore formation'], correctIndex: 1, explanation: 'A single Amoeba cell splits into two daughter cells.' },
            { question: 'External fertilization commonly occurs in:', options: ['Humans', 'Cows', 'Frogs and fish', 'Birds'], correctIndex: 2, explanation: 'Frogs release eggs and sperm into water.' },
            { question: 'Which microorganism is used in baking fluffy bread?', options: ['Amoeba', 'Yeast', 'Plasmodium', 'Paramecium'], correctIndex: 1, explanation: 'Yeast respires and releases CO2 bubbles that make dough rise.' },
            { question: 'Which disease is caused by a virus?', options: ['Typhoid', 'Polio / Influenza', 'Malaria', 'Ringworm'], correctIndex: 1, explanation: 'Polio and common flu are viral diseases.' },
            { question: 'Who discovered the antibiotic Penicillin?', options: ['Louis Pasteur', 'Alexander Fleming', 'Edward Jenner', 'Robert Hooke'], correctIndex: 1, explanation: 'Alexander Fleming discovered Penicillin in 1928.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(8, 'sst', 'Social Science', 'Social Science', 'peach', 'The Revolt of 1857, Resources & Agriculture, and Indian Constitution & Parliament.', [
        {
          title: 'When People Rebel: The Revolt of 1857',
          topics: ['Causes of discontent', 'Mangal Pandey & Meerut', 'Leaders (Rani Lakshmibai, Kunwar Singh, Bahadur Shah Zafar)'],
          summary: 'Examine why sepoys, peasants, and rulers rose together against the British East India Company in 1857.',
          objectives: ['Identify political, economic, and military causes of 1857', 'Trace major centres of the uprising'],
          studyNotes: [
            'Policies like Doctrine of Lapse angered rulers; heavy taxes burdened peasants; greased cartridges triggered the Meerut sepoy mutiny on 10 May 1857.',
            'After 1858, rule passed directly from the East India Company to the British Crown.'
          ],
          revisionPoints: ['10 May 1857: Meerut outbreak', 'Leaders: Rani Lakshmibai (Jhansi), Tantia Tope, Kunwar Singh', '1858 Act transferred power to Crown'],
          practiceQuestions: [
            { question: 'Who was proclaimed the symbolic leader of the 1857 uprising in Delhi?', answer: 'Bahadur Shah Zafar.' },
            { question: 'Name two major changes introduced by the British after 1858.', answer: 'British Crown took over rule directly, and rulers were assured their territory would not be annexed under Doctrine of Lapse.' }
          ],
          quizQuestions: [
            { question: 'Where did the sepoy uprising of May 1857 begin?', options: ['Pune', 'Meerut', 'Madras', 'Surat'], correctIndex: 1, explanation: 'Sepoys revolted in Meerut on 10 May 1857 and marched to Delhi.' },
            { question: 'Who led the revolt in Jhansi?', options: ['Begum Hazrat Mahal', 'Rani Lakshmibai', 'Sarojini Naidu', 'Ahilyabai Holkar'], correctIndex: 1, explanation: 'Rani Lakshmibai bravely defended Jhansi.' },
            { question: 'Who led the uprising in Bihar (Jagdishpur)?', options: ['Nana Saheb', 'Kunwar Singh', 'Birjis Qadr', 'Mangal Pandey'], correctIndex: 1, explanation: 'Veer Kunwar Singh organized resistance in Bihar.' },
            { question: 'Which policy annexed kingdoms without a natural male heir?', options: ['Permanent Settlement', 'Doctrine of Lapse', 'Subsidiary Alliance', 'Rowlatt Act'], correctIndex: 1, explanation: 'Lord Dalhousie’s Doctrine of Lapse annexed Satara, Jhansi, and Nagpur.' },
            { question: 'After 1858, the Governor-General of India was given the title:', options: ['President', 'Viceroy', 'Sarpanch', 'Chancellor'], correctIndex: 1, explanation: 'The Governor-General became Viceroy, representative of the Crown.' }
          ],
          diagramType: 'history-timeline'
        },
        {
          title: 'Resources, Land, Soil & Agriculture',
          topics: ['Natural vs Human-made resources', 'Soil conservation', 'Kharif & Rabi crops'],
          summary: 'Understand sustainable resource conservation and India’s major farming seasons and crop patterns.',
          objectives: ['Classify renewable vs non-renewable resources', 'Distinguish Kharif and Rabi crops'],
          studyNotes: [
            'Sustainable development balances present resource needs while preserving them for future generations.',
            'Kharif crops (monsoon: rice, maize, cotton) vs Rabi crops (winter: wheat, mustard, gram).'
          ],
          revisionPoints: ['Rice = Kharif (monsoon)', 'Wheat = Rabi (winter)', 'Contour ploughing prevents soil erosion'],
          practiceQuestions: [
            { question: 'Name two methods to prevent soil erosion on hill slopes.', answer: 'Terrace farming and contour ploughing.' },
            { question: 'Give two examples of Rabi crops.', answer: 'Wheat and mustard.' }
          ],
          quizQuestions: [
            { question: 'Which farming method cuts flat steps on steep hill slopes to stop soil erosion?', options: ['Shifting cultivation', 'Terrace farming', 'Overgrazing', 'Mining'], correctIndex: 1, explanation: 'Terraces slow water runoff on slopes.' },
            { question: 'Which is a major Kharif crop grown in the rainy season?', options: ['Wheat', 'Rice (Paddy)', 'Mustard', 'Barley'], correctIndex: 1, explanation: 'Rice needs abundant monsoon water.' },
            { question: 'Using resources carefully and giving them time to renew is:', options: ['Exploitation', 'Resource conservation', 'Deforestation', 'Urbanization'], correctIndex: 1, explanation: 'Conservation prevents depletion.' },
            { question: 'Golden fibre refers to which crop?', options: ['Cotton', 'Jute', 'Silk', 'Wool'], correctIndex: 1, explanation: 'Jute is known as the golden fibre.' },
            { question: 'Which soil type is famous for growing cotton in the Deccan plateau?', options: ['Desert sand', 'Black (Regur) soil', 'Peat soil', 'Mountain gravel'], correctIndex: 1, explanation: 'Black soil retains moisture ideal for cotton.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'The Indian Constitution & Parliament',
          topics: ['Key features of Constitution', 'Fundamental Rights', 'Lok Sabha & Rajya Sabha'],
          summary: 'Explore the ideals of our Constitution, Fundamental Rights, and how Parliament makes national laws.',
          objectives: ['List the 6 Fundamental Rights', 'Compare Lok Sabha and Rajya Sabha'],
          studyNotes: [
            'Key features: Federalism, Parliamentary form, Separation of Powers, Fundamental Rights, Secularism.',
            'Indian Parliament has the President, Lok Sabha (House of the People, 5-year term), and Rajya Sabha (Council of States, permanent house).'
          ],
          revisionPoints: ['Dr. B.R. Ambedkar = Father of Indian Constitution', '6 Fundamental Rights', 'Lok Sabha = Lower House'],
          practiceQuestions: [
            { question: 'What is meant by Secularism in the Indian Constitution?', answer: 'The State does not officially promote any one religion and treats all faiths equally.' },
            { question: 'Which House of Parliament is directly elected by citizens?', answer: 'The Lok Sabha.' }
          ],
          quizQuestions: [
            { question: 'Who was the Chairman of the Drafting Committee of the Indian Constitution?', options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Sardar Patel', 'Subhas Chandra Bose'], correctIndex: 1, explanation: 'Dr. B.R. Ambedkar chaired the Drafting Committee.' },
            { question: 'Which House of Parliament is also called the House of the People?', options: ['Rajya Sabha', 'Lok Sabha', 'Vidhan Parishad', 'Supreme Court'], correctIndex: 1, explanation: 'Lok Sabha members are directly elected by the people.' },
            { question: 'Right to Free and Compulsory Education (ages 6–14) falls under:', options: ['Right to Freedom / Education (Art 21A)', 'Right to Property', 'Right to Tax', 'Directive Principle only'], correctIndex: 0, explanation: 'Article 21A makes elementary education a Fundamental Right.' },
            { question: 'Dividing powers among Legislature, Executive, and Judiciary is:', options: ['Federalism', 'Separation of Powers', 'Monarchy', 'Dictatorship'], correctIndex: 1, explanation: 'Separation of powers ensures checks and balances.' },
            { question: 'The Indian Constitution came into effect on:', options: ['15 August 1947', '26 January 1950', '2 October 1948', '26 November 1949'], correctIndex: 1, explanation: '26 January 1950 is celebrated as Republic Day.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(8, 'english', 'English', 'Languages', 'lavender', 'Conditionals, modals, determiners, synthesis of sentences, and formal letters.', [
        {
          title: 'Determiners & Modals',
          topics: ['Few, a few, little, a little', 'Each, every, either, neither', 'Modals of obligation & probability'],
          summary: 'Master subtle determiners like few/a few and little/a little, and express deduction and duty with modals.',
          objectives: ['Choose few vs little based on countability', 'Distinguish a few vs few'],
          studyNotes: [
            '"Few" (countable) and "little" (uncountable) mean hardly any (negative sense). "A few" and "a little" mean some (positive sense).'
          ],
          revisionPoints: ['few -> countable; little -> uncountable', 'a few = some; few = almost none'],
          practiceQuestions: [
            { question: 'Fill in: "There is ___ milk left, enough for one cup of tea."', answer: 'a little.' },
            { question: 'Fill in: "___ student must carry an ID card."', answer: 'Every (or Each).' }
          ],
          quizQuestions: [
            { question: 'Fill in: "___ knowledge is a dangerous thing."', options: ['A few', 'A little', 'Few', 'Many'], correctIndex: 1, explanation: 'Knowledge is uncountable; "a little" means some.' },
            { question: 'Fill in: "He has ___ friends, so he feels lonely."', options: ['a few', 'few', 'a little', 'much'], correctIndex: 1, explanation: '"few" emphasizes hardly any.' },
            { question: 'Fill in: "___ of the two answers is correct."', options: ['All', 'Neither', 'Few', 'Many'], correctIndex: 1, explanation: '"Neither" refers to none of two.' },
            { question: 'Which modal expresses past habit?', options: ['Used to', 'May', 'Must', 'Shall'], correctIndex: 0, explanation: '"Used to" expresses a discontinued past habit.' },
            { question: 'Fill in: "You ___ leave early if you finish your exam."', options: ['may', 'ought', 'dare', 'used'], correctIndex: 0, explanation: '"may" grants permission.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Conditionals & Non-Finite Verbs',
          topics: ['Zero, First, Second Conditionals', 'Infinitives, Gerunds, Participles'],
          summary: 'Build cause-and-effect "If" sentences and use infinitives (to + verb) and gerunds (verb + -ing as noun).',
          objectives: ['Construct Type 1 and Type 2 conditionals', 'Identify gerunds vs participles'],
          studyNotes: [
            'First Conditional (real possibility): If + simple present, will + base verb ("If it rains, we will stay inside").',
            'Gerund acts as a noun ("Swimming is healthy"); Infinitive uses "to + V1" ("I love to read").'
          ],
          revisionPoints: ['If + present -> will + V1', 'Gerund = V-ing used as noun'],
          practiceQuestions: [
            { question: 'Complete: "If you study hard, you ___ (pass) easily."', answer: 'will pass.' },
            { question: 'Identify the gerund: "Reading widens our imagination."', answer: 'Reading.' }
          ],
          quizQuestions: [
            { question: 'Complete: "If she runs fast, she ___ the train."', options: ['caught', 'will catch', 'would caught', 'catching'], correctIndex: 1, explanation: 'First conditional pairs simple present with "will + verb".' },
            { question: 'In "Painting is my favourite hobby", "Painting" is a:', options: ['Gerund', 'Past participle', 'Modal', 'Preposition'], correctIndex: 0, explanation: 'It acts as the subject noun.' },
            { question: 'Complete Second Conditional: "If I were a bird, I ___ fly."', options: ['will', 'would', 'shall', 'can'], correctIndex: 1, explanation: 'Hypothetical present uses "were ... would".' },
            { question: 'Choose the infinitive in "He wants to become an engineer."', options: ['wants', 'to become', 'engineer', 'an'], correctIndex: 1, explanation: '"to + base verb" is an infinitive.' },
            { question: 'Zero conditional expresses:', options: ['Past regrets', 'Scientific facts / general truths', 'Wishes', 'Future guesses'], correctIndex: 1, explanation: 'If you heat ice, it melts.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Figures of Speech & Formal Letter Writing',
          topics: ['Simile, Metaphor, Personification, Alliteration', 'Letter to the Editor / Principal'],
          summary: 'Recognize poetic figures of speech in literature and write well-structured formal letters.',
          objectives: ['Tell Simile apart from Metaphor', 'Format formal letter blocks accurately'],
          studyNotes: [
            'Simile compares using "like" or "as" ("brave as a lion"). Metaphor compares directly ("He is a shining star"). Personification gives human traits to non-humans ("The wind whispered").'
          ],
          revisionPoints: ['Simile uses like/as', 'Metaphor = direct comparison', 'Formal letter includes Subject line'],
          practiceQuestions: [
            { question: 'Identify the figure of speech: "The classroom was a zoo."', answer: 'Metaphor.' },
            { question: 'Identify: "The leaves danced in the breeze."', answer: 'Personification.' }
          ],
          quizQuestions: [
            { question: '"Her smile is as bright as the sun" is an example of:', options: ['Metaphor', 'Simile', 'Personification', 'Irony'], correctIndex: 1, explanation: 'Uses "as ... as" comparison -> Simile.' },
            { question: '"Time is a thief" is a:', options: ['Simile', 'Metaphor', 'Alliteration', 'Oxymoron'], correctIndex: 1, explanation: 'Direct comparison without like/as -> Metaphor.' },
            { question: '"Peter Piper picked a peck" demonstrates:', options: ['Alliteration', 'Personification', 'Metaphor', 'Hyperbole'], correctIndex: 0, explanation: 'Repetition of initial consonant sound /p/.' },
            { question: 'In a formal letter, where does the "Subject" line appear?', options: ['After signature', 'Between salutation/receiver address and body', 'At the bottom', 'Nowhere'], correctIndex: 1, explanation: 'Subject summarizes the letter purpose before the body.' },
            { question: '"The stars winked at us" uses:', options: ['Simile', 'Personification', 'Alliteration', 'Onomatopoeia'], correctIndex: 1, explanation: 'Winking is a human action attributed to stars.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(8, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'वाक्य के भेद, पद-परिचय परिचय, संधि एवं औपचारिक लेखन।', [
        {
          title: 'रचना के आधार पर वाक्य के भेद',
          topics: ['सरल वाक्य', 'संयुक्त वाक्य', 'मिश्र वाक्य'],
          summary: 'सरल, संयुक्त और मिश्र वाक्यों की संरचना समझें और वाक्य रूपांतरण करें।',
          objectives: ['तीनों वाक्य भेद पहचानना', 'योजक शब्दों से संयुक्त व मिश्र पहचानना'],
          studyNotes: [
            'सरल वाक्य: एक उद्देश्य, एक विधेय ("राम पुस्तक पढ़ता है")। संयुक्त वाक्य: दो स्वतंत्र उपवाक्य "और, परंतु, इसलिए" से जुड़े हों। मिश्र वाक्य: एक प्रधान और एक आश्रित उपवाक्य ("जब... तब", "कि", "जैसा... वैसा")।'
          ],
          revisionPoints: ['और, किंतु = संयुक्त', 'कि, जो, जब = मिश्र'],
          practiceQuestions: [
            { question: '"सूरज निकला और अंधेरा भाग गया।" किस प्रकार का वाक्य है?', answer: 'संयुक्त वाक्य।' },
            { question: '"मैं जानता हूँ कि तुम ईमानदार हो।" वाक्य भेद बताइए।', answer: 'मिश्र वाक्य।' }
          ],
          quizQuestions: [
            { question: '"वह आया और चला गया।" रचना की दृष्टि से कौन-सा वाक्य है?', options: ['सरल', 'संयुक्त', 'मिश्र', 'आज्ञावाचक'], correctIndex: 1, explanation: 'दो स्वतंत्र वाक्य "और" से जुड़े हैं—संयुक्त वाक्य।' },
            { question: '"जैसे ही घंटी बजी, बच्चे बाहर आ गए।" यह वाक्य है:', options: ['सरल', 'संयुक्त', 'मिश्र', 'इच्छावाचक'], correctIndex: 2, explanation: 'एक प्रधान और एक आश्रित उपवाक्य होने से मिश्र वाक्य है।' },
            { question: 'जिस वाक्य में एक ही मुख्य क्रिया हो, उसे कहते हैं:', options: ['सरल वाक्य', 'मिश्र वाक्य', 'संयुक्त वाक्य', 'जटिल वाक्य'], correctIndex: 0, explanation: 'सरल वाक्य में एक ही समापिका क्रिया होती है।' },
            { question: 'कौन-सा योजक संयुक्त वाक्य बनाता है?', options: ['क्योंकि', 'परंतु / लेकिन', 'यद्यपि', 'जबकि'], correctIndex: 1, explanation: '"परंतु" समानाधिकरण योजक है।' },
            { question: '"मेहनत करने वाले छात्र सफल होते हैं।" यह वाक्य है:', options: ['संयुक्त', 'मिश्र', 'सरल', 'निषेधवाचक'], correctIndex: 2, explanation: 'इसमें एक ही मुख्य क्रिया "होते हैं" है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'संधि (गुण एवं यण संधि)',
          topics: ['गुण संधि (अ+इ=ए, अ+उ=ओ)', 'यण संधि (इ+अ=य, उ+अ=व)'],
          summary: 'स्वर संधि के प्रमुख भेदों—गुण संधि और यण संधि—के नियम एवं संधि-विच्छेद का अभ्यास करें।',
          objectives: ['गुण और यण संधि पहचानना', 'सही संधि-विच्छेद करना'],
          studyNotes: [
            'गुण संधि: देव + इंद्र = देवेंद्र, महा + उदय = महोदय, महा + ऋषि = महर्षि।',
            'यण संधि: अति + अधिक = अत्यधिक, सु + आगत = स्वागत, प्रति + एक = प्रत्येक।'
          ],
          revisionPoints: ['ए, ओ, अर् = गुण संधि', 'य्, व् से पहले आधा अक्षर = यण संधि'],
          practiceQuestions: [
            { question: '"स्वागत" का संधि-विच्छेद लिखिए।', answer: 'सु + आगत (यण संधि)।' },
            { question: '"महेश" में कौन-सी संधि है?', answer: 'गुण संधि (महा + ईश)।' }
          ],
          quizQuestions: [
            { question: '"स्वागत" का सही संधि-विच्छेद क्या है?', options: ['स्व + आगत', 'सु + आगत', 'सा + गत', 'सु + गत'], correctIndex: 1, explanation: 'उ + आ = वा (यण संधि)।' },
            { question: '"पर + उपकार" से कौन-सा शब्द बनेगा?', options: ['परउपकार', 'परोपकार', 'परूपकार', 'परोपकर'], correctIndex: 1, explanation: 'अ + उ = ओ (गुण संधि) -> परोपकार।' },
            { question: '"प्रत्येक" में कौन-सी संधि है?', options: ['दीर्घ', 'गुण', 'यण', 'वृद्धि'], correctIndex: 2, explanation: 'प्रति + एक = प्रत्येक (यण संधि)।' },
            { question: '"नरेंद्र" का संधि-विच्छेद चुनिए:', options: ['नरे + इंद्र', 'नर + इंद्र', 'नरा + इंद्र', 'नर + ईंद्र'], correctIndex: 1, explanation: 'नर + इंद्र = नरेंद्र (अ + इ = ए)।' },
            { question: '"अत्यधिक" में संधि-विच्छेद है:', options: ['अत्य + अधिक', 'अति + अधिक', 'अती + अधिक', 'अत + अधिक'], correctIndex: 1, explanation: 'इ + अ = य -> अत्यधिक।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'वाच्य परिचय और संवाद/सूचना लेखन',
          topics: ['कर्तृवाच्य, कर्मवाच्य, भाववाच्य', 'सूचना लेखन प्रारूप'],
          summary: 'क्रिया का मुख्य विषय कर्ता, कर्म या भाव है—इसे वाच्य से समझें और विद्यालय सूचना लेखन सीखें।',
          objectives: ['तीनों वाच्यों में अंतर पहचानना', 'स्पष्ट सूचना लेखन तैयार करना'],
          studyNotes: [
            'कर्तृवाच्य: कर्ता प्रधान ("बालक पत्र लिखता है")। कर्मवाच्य: कर्म प्रधान ("बालक द्वारा पत्र लिखा जाता है")। भाववाच्य: भाव प्रधान ("मुझसे चला नहीं जाता")।'
          ],
          revisionPoints: ['से / के द्वारा + सकर्मक = कर्मवाच्य', 'असमर्थता (नहीं जाता) = भाववाच्य'],
          practiceQuestions: [
            { question: '"मुझसे दौड़ा नहीं जाता।" कौन-सा वाच्य है?', answer: 'भाववाच्य।' },
            { question: '"पक्षी आकाश में उड़ते हैं।" वाच्य बताइए।', answer: 'कर्तृवाच्य।' }
          ],
          quizQuestions: [
            { question: 'वाच्य के कितने भेद होते हैं?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'कर्तृवाच्य, कर्मवाच्य और भाववाच्य।' },
            { question: '"रमेश द्वारा पुस्तक पढ़ी गई।" कौन-सा वाच्य है?', options: ['कर्तृवाच्य', 'कर्मवाच्य', 'भाववाच्य', 'कोई नहीं'], correctIndex: 1, explanation: 'यहाँ कर्म (पुस्तक) की प्रधानता है।' },
            { question: '"बच्चे से चला नहीं जाता।" में कौन-सा वाच्य है?', options: ['कर्तृवाच्य', 'कर्मवाच्य', 'भाववाच्य', 'मिश्र'], correctIndex: 2, explanation: 'अकर्मक क्रिया व असमर्थता भाव होने से भाववाच्य है।' },
            { question: 'सूचना लेखन में शब्द सीमा सामान्यतः होती है:', options: ['500 शब्द', '40–50 शब्द', '5 शब्द', '300 शब्द'], correctIndex: 1, explanation: 'सूचना संक्षिप्त (40–50 शब्द) होती है।' },
            { question: '"राम ने रावण को मारा।" किस वाच्य में है?', options: ['कर्मवाच्य', 'भाववाच्य', 'कर्तृवाच्य', 'संयुक्त'], correctIndex: 2, explanation: 'कर्ता राम की प्रधानता होने से कर्तृवाच्य है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(8, 'sanskrit', 'Sanskrit (संस्कृतम् - Optional)', 'Languages', 'lavender', 'लोट् लकार, सन्धिः और नीतिश्लोकाः।', [
        {
          title: 'लोट् लकारः (आज्ञार्थकः) एवं विधिलिङ् लकारः',
          topics: ['पठतु, पठताम्, पठन्तु', 'पठेत्, पठेताम्, पठेयुः'],
          summary: 'आज्ञा देने (लोट् लकार) और चाहिए अर्थ (विधिलिङ् लकार) में संस्कृत वाक्यों का निर्माण करें।',
          objectives: ['लोट् व विधिलिङ् प्रत्यय पहचानना', 'सही आज्ञावाचक वाक्य चुनना'],
          studyNotes: [
            'लोट् लकार (आज्ञा): सत्यं वद (सत्य बोलो), धर्मं चर (धर्म का आचरण करो), सः पठतु (वह पढ़े)।',
            'विधिलिङ् (चाहिए): छात्रः पठेत् (छात्र को पढ़ना चाहिए)।'
          ],
          revisionPoints: ['तु, ताम्, अन्तु = लोट् लकार', 'एत्, एताम्, एयुः = विधिलिङ्'],
          practiceQuestions: [
            { question: '"सदा सत्यं वद" में "वद" किस लकार में है?', answer: 'लोट् लकार (मध्यम पुरुष एकवचन)।' },
            { question: '"अहम् सदा सत्यं वदेयम्" किस लकार में है?', answer: 'विधिलिङ् लकार।' }
          ],
          quizQuestions: [
            { question: 'आज्ञा या आशीर्वाद देने के लिए किस लकार का प्रयोग होता है?', options: ['लङ् लकार', 'लोट् लकार', 'लृट् लकार', 'लट् लकार'], correctIndex: 1, explanation: 'लोट् लकार आज्ञार्थक होता है।' },
            { question: '"चाहिए" अर्थ में कौन-सा लकार प्रयुक्त होता है?', options: ['विधिलिङ्', 'लृट्', 'लङ्', 'लट्'], correctIndex: 0, explanation: 'विधिलिङ् लकार प्रेरणा/चाहिए अर्थ में आता है।' },
            { question: '"छात्राः पाठं ___" (पठ् - लोट् लकार):', options: ['पठतु', 'पठन्तु', 'पठेत्', 'अपठत्'], correctIndex: 1, explanation: 'बहुवचन प्रथम पुरुष: पठन्तु।' },
            { question: '"त्वम् जलम् पिब" में "पिब" किस पुरुष में है?', options: ['प्रथम', 'मध्यम', 'उत्तम', 'सभी'], correctIndex: 1, explanation: 'त्वम् मध्यम पुरुष एकवचन है।' },
            { question: '"सः प्रातः उत्तिष्ठेत्" किस लकार का उदाहरण है?', options: ['लट्', 'लोट्', 'विधिलिङ्', 'लृट्'], correctIndex: 2, explanation: 'उत्तिष्ठेत् विधिलिङ् लकार का रूप है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'सन्धिः एवं उपपद विभक्तिः',
          topics: ['अच् सन्धि अभ्यास', 'सह तृतीया, नमः चतुर्थी, परितः द्वितीया'],
          summary: 'विशेष अव्यय पदों (सह, नमः, विना, परितः) के साथ लगने वाली उपपद विभक्तियों का सही प्रयोग सीखें।',
          objectives: ['सह के साथ तृतीया व नमः के साथ चतुर्थी लगाना'],
          studyNotes: [
            'उपपद विभक्ति नियम: "सह" (साथ) योग में तृतीया (रामेण सह सीता गच्छति); "नमः" योग में चतुर्थी (गुरवे नमः); "उभयतः/परितः" योग में द्वितीया (ग्रामं परितः वृक्षाः सन्ति)।'
          ],
          revisionPoints: ['सह -> तृतीया', 'नमः -> चतुर्थी', 'परितः -> द्वितीया'],
          practiceQuestions: [
            { question: '"___ नमः" (गणेश) में सही रूप लिखिए।', answer: 'गणेशाय नमः (चतुर्थी विभक्ति)।' },
            { question: '"जनकेन सह बालकः गच्छति" में तृतीया विभक्ति क्यों है?', answer: '"सह" अव्यय के योग से।' }
          ],
          quizQuestions: [
            { question: '"नमः" शब्द के योग में कौन-सी विभक्ति लगती है?', options: ['द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी'], correctIndex: 2, explanation: 'नमः स्वस्ति स्वाहा सूत्र से चतुर्थी विभक्ति होती है।' },
            { question: '"___ सह छात्रः पठति" (मित्र):', options: ['मित्राय', 'मित्रेण', 'मित्रस्य', 'मित्रम्'], correctIndex: 1, explanation: '"सह" के योग में तृतीया (मित्रेण) लगती है।' },
            { question: '"विद्यालयं ___ वृक्षाः सन्ति" (चारों ओर):', options: ['परितः', 'सह', 'नमः', 'अधः'], correctIndex: 0, explanation: 'परितः का अर्थ चारों ओर है (द्वितीया विभक्ति)।' },
            { question: '"बहिः" (बाहर) के योग में कौन-सी विभक्ति आती है?', options: ['पञ्चमी', 'द्वितीया', 'प्रथमा', 'सप्तमी'], correctIndex: 0, explanation: 'बहिः योगे पञ्चमी (ग्रामात् बहिः)।' },
            { question: '"श्री सूर्याय नमः" में "सूर्याय" किस विभक्ति में है?', options: ['तृतीया', 'चतुर्थी', 'षष्ठी', 'सप्तमी'], correctIndex: 1, explanation: 'सूर्याय चतुर्थी एकवचन है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'कथा-पठनम् एवं नीतिश्लोकाः',
          topics: ['अभिवादनशीलस्य नित्यम्...', 'अहम् अस्मि भारतजनता'],
          summary: 'प्राचीन संस्कृत नीति श्लोकों से विनम्रता, परिश्रम और भारत की सांस्कृतिक एकता के मूल्यों को आत्मसात करें।',
          objectives: ['श्लोकों का अन्वय और भावार्थ समझना'],
          studyNotes: [
            'विद्या ददाति विनयम् (विद्या विनम्रता देती है)। आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः (आलस्य मनुष्य का सबसे बड़ा शत्रु है)।'
          ],
          revisionPoints: ['रिपुः = शत्रु', 'विनयः = विनम्रता', 'उद्यमेन हि सिध्यन्ति कार्याणि'],
          practiceQuestions: [
            { question: 'मनुष्य के शरीर में स्थित सबसे बड़ा शत्रु कौन है?', answer: 'आलस्य (आलस्यम्)।' },
            { question: 'विद्या हमें क्या देती है?', answer: 'विनम्रता (विनयम्)।' }
          ],
          quizQuestions: [
            { question: '"उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः" का क्या अर्थ है?', options: ['केवल सोचने से काम बनते हैं', 'परिश्रम से ही कार्य सिद्ध होते हैं', 'आलस्य अच्छा है', 'धन ही सब कुछ है'], correctIndex: 1, explanation: 'उद्यम (परिश्रम) से सफलता मिलती है, केवल इच्छा से नहीं।' },
            { question: '"रिपुः" शब्द का पर्यायवाची क्या है?', options: ['मित्रम्', 'शत्रुः', 'बंधुः', 'पुत्रः'], correctIndex: 1, explanation: 'रिपु का अर्थ शत्रु होता है।' },
            { question: '"विद्या ददाति ___" रिक्त स्थान पूरा कीजिए:', options: ['धनम्', 'विनयम्', 'बलम्', 'क्रोधम्'], correctIndex: 1, explanation: 'विद्या विनम्रता प्रदान करती है।' },
            { question: '"वसुधैव कुटुम्बकम्" का भावार्थ है:', options: ['घर छोटा है', 'संपूर्ण पृथ्वी ही एक परिवार है', 'केवल अपना गाँव', 'धन संग्रह'], correctIndex: 1, explanation: 'वसुधा + एव = पूरी धरती ही परिवार है।' },
            { question: '"अतिथि देवो भव" भारतीय संस्कृति का कौन-सा मूल्य बताता है?', options: ['आतिथ्य सत्कार', 'क्रोध', 'ईर्ष्या', 'लोभ'], correctIndex: 0, explanation: 'अतिथि को देवता के समान सम्मान देना।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(8, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Computer networks, Python loops & lists, and AI & databases intro.', [
        {
          title: 'Computer Networks & Topologies',
          topics: ['LAN, MAN, WAN', 'Router, Switch, Modem', 'Star, Bus, Ring topologies'],
          summary: 'Understand how computers connect across rooms, cities, and continents using LAN/WAN networks and topologies.',
          objectives: ['Compare LAN, MAN, WAN', 'Identify Star and Mesh topologies'],
          studyNotes: [
            'LAN (Local Area Network) connects a building/school; MAN spans a city; WAN (Wide Area Network) spans countries (the Internet).',
            'In Star topology, every node connects to a central Hub or Switch.'
          ],
          revisionPoints: ['LAN < MAN < WAN', 'Internet = largest WAN', 'Star topology uses central Switch/Hub'],
          practiceQuestions: [
            { question: 'Which network type connects computers inside one school lab?', answer: 'LAN (Local Area Network).' },
            { question: 'What is a major advantage of Star topology?', answer: 'If one cable fails, other computers keep working normally.' }
          ],
          quizQuestions: [
            { question: 'Which network covers the smallest geographical area?', options: ['WAN', 'MAN', 'LAN', 'Internet'], correctIndex: 2, explanation: 'LAN connects devices within a home, office, or school.' },
            { question: 'In which topology do all nodes connect to a central switch?', options: ['Ring', 'Bus', 'Star', 'Tree'], correctIndex: 2, explanation: 'Star topology radiates from a central hub/switch.' },
            { question: 'The global Internet is an example of a:', options: ['PAN', 'LAN', 'WAN', 'CAN'], correctIndex: 2, explanation: 'Internet is a worldwide Wide Area Network.' },
            { question: 'Which device converts digital signals to analog for telephone lines and vice versa?', options: ['Repeater', 'Modem', 'Scanner', 'Plotter'], correctIndex: 1, explanation: 'Modem stands for Modulator-Demodulator.' },
            { question: 'Bluetooth connecting headphones to a phone forms a:', options: ['PAN (Personal Area Network)', 'WAN', 'MAN', 'Satellite link'], correctIndex: 0, explanation: 'Short-range personal connections form a PAN.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Python Conditionals & Loops',
          topics: ['if / elif / else', 'for and while loops', 'range() function'],
          summary: 'Make Python programs make smart decisions with if/else and repeat tasks automatically using for and while loops.',
          objectives: ['Write indented if/else blocks', 'Use for i in range(n) loops'],
          studyNotes: [
            'Python uses indentation (4 spaces) to group code inside if, for, and while blocks.',
            'range(5) produces numbers 0, 1, 2, 3, 4.'
          ],
          revisionPoints: ['== checks equality; = assigns', 'Indentation is mandatory in Python', 'range(1, 6) gives 1 to 5'],
          practiceQuestions: [
            { question: 'What numbers does range(2, 6) generate?', answer: '2, 3, 4, 5.' },
            { question: 'What operator checks if two numbers are equal in Python?', answer: '== (double equals).' }
          ],
          quizQuestions: [
            { question: 'Which keyword checks an additional condition after "if" in Python?', options: ['elseif', 'elif', 'otherwise', 'next'], correctIndex: 1, explanation: 'Python uses "elif" for else-if branches.' },
            { question: 'What numbers are printed by: for i in range(3): print(i)?', options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '1, 2'], correctIndex: 1, explanation: 'range(3) starts at 0 and stops before 3.' },
            { question: 'How does Python mark blocks inside loops and conditionals?', options: ['Curly braces {}', 'Indentation (spaces)', 'Semicolons ;', 'Parentheses ()'], correctIndex: 1, explanation: 'Indentation defines block scope in Python.' },
            { question: 'Which loop keeps running as long as a condition stays True?', options: ['if loop', 'while loop', 'def loop', 'try loop'], correctIndex: 1, explanation: 'A while loop repeats while its condition is True.' },
            { question: 'Which operator means "not equal to" in Python?', options: ['<>', '!=', '==', '=/='], correctIndex: 1, explanation: '!= checks inequality.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Introduction to Databases & Artificial Intelligence',
          topics: ['Tables, records, primary key', 'What is AI?', 'Everyday AI applications'],
          summary: 'Learn how databases store structured records with primary keys and how AI systems recognize patterns and assist humans.',
          objectives: ['Define Table, Field, Record, Primary Key', 'Identify real-world AI uses and ethics'],
          studyNotes: [
            'In a database table, each row is a Record, each column is a Field, and a Primary Key uniquely identifies every record (e.g., Student Roll ID).',
            'Artificial Intelligence enables machines to learn from data, understand speech/images, and assist in healthcare, farming, and education.'
          ],
          revisionPoints: ['Primary Key = unique, non-null ID', 'Row = Record; Column = Field', 'AI learns patterns from data'],
          practiceQuestions: [
            { question: 'Why can "Student Name" NOT be a good Primary Key?', answer: 'Two students can have the exact same name.' },
            { question: 'Give two real-life applications of AI.', answer: 'Voice assistants and medical X-ray image screening.' }
          ],
          quizQuestions: [
            { question: 'Which key uniquely identifies every row in a database table?', options: ['Foreign Key', 'Primary Key', 'Shift Key', 'Public Key'], correctIndex: 1, explanation: 'A Primary Key must be unique and never null.' },
            { question: 'In a database table, a single horizontal row is called a:', options: ['Field', 'Record', 'Column', 'Query'], correctIndex: 1, explanation: 'Rows are records; columns are fields.' },
            { question: 'Which language is standard for querying relational databases?', options: ['HTML', 'SQL', 'CSS', 'XML'], correctIndex: 1, explanation: 'SQL (Structured Query Language) queries relational databases.' },
            { question: 'Teaching a computer to recognize handwritten digits using examples is:', options: ['Machine Learning', 'Hardware assembly', 'Word processing', 'Defragmentation'], correctIndex: 0, explanation: 'Machine Learning learns patterns from training data.' },
            { question: 'Which principle ensures AI systems treat all users fairly?', options: ['High resolution', 'Ethical AI / Unbiased data', 'Faster CPU', 'Dark mode'], correctIndex: 1, explanation: 'Balanced, unbiased training data ensures fairness.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  }
];

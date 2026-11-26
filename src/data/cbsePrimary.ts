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
  const subjectId = `c${classNumber}-${slug}`;
  return {
    id: subjectId,
    classNumber,
    name,
    hindiName,
    category,
    accentTint,
    description,
    chapters: buildChapters(classNumber, slug, name, chapters),
  };
}

export const CBSE_PRIMARY_CLASSES: CBSEClassData[] = [
  // ==================== CLASS 1 ====================
  {
    classNumber: 1,
    label: 'Class 1',
    stage: 'Primary (Classes 1–5)',
    subjects: [
      makeSubject(1, 'math', 'Mathematics', 'Mathematics', 'blue', 'Foundational counting, addition, subtraction, and basic shapes for everyday observation.', [
        {
          title: 'Numbers from 1 to 20',
          topics: ['Counting objects', 'Number names', 'Before and after', 'Comparing quantities'],
          summary: 'Learn to count everyday objects from 1 to 20, read and write numerals, and compare bigger and smaller groups.',
          objectives: ['Count collections up to 20 accurately', 'Match numerals with number names', 'Identify numbers that come just before and after'],
          studyNotes: [
            'Numbers help us count toys, fruits, pencils, and steps. Starting from 1, each next number is 1 more than the previous number.',
            'Zero (0) means nothing is left in a group—for example, 0 apples on an empty plate.',
            'Ten ones make one bundle of 10. Numbers from 11 to 19 are made of one ten and extra ones (e.g., 14 = 10 + 4).'
          ],
          revisionPoints: ['10 + 1 = 11, 10 + 5 = 15, 10 + 9 = 19', '0 represents an empty set', 'Greater number lies further to the right on a number line'],
          hindiSummary: '1 से 20 तक गिनती, संख्याओं के नाम और छोटे-बड़े समूहों की तुलना करना सीखें।',
          practiceQuestions: [
            { question: 'How many tens and ones are in 16?', answer: '16 has 1 ten and 6 ones (10 + 6).' },
            { question: 'Which number comes just before 12?', answer: '11 comes just before 12.' }
          ],
          quizQuestions: [
            { question: 'Which number comes right after 14?', options: ['13', '15', '16', '12'], correctIndex: 1, explanation: 'Counting forward from 14 gives 15.' },
            { question: 'How many ones make 1 ten?', options: ['5', '8', '10', '20'], correctIndex: 2, explanation: 'A bundle of 10 single units makes 1 ten.' },
            { question: 'Which number represents an empty basket of mangoes?', options: ['1', '0', '10', '2'], correctIndex: 1, explanation: 'Zero (0) stands for none or nothing.' },
            { question: 'What is 10 + 7?', options: ['16', '17', '18', '71'], correctIndex: 1, explanation: 'One ten and 7 ones combine to make 17.' },
            { question: 'Which is the largest number among 9, 13, 7, 11?', options: ['9', '11', '13', '7'], correctIndex: 2, explanation: '13 has 1 ten and 3 ones, which is more than 11, 9, and 7.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Addition and Subtraction Basics',
          topics: ['Putting together', 'Taking away', 'Using fingers and number line', 'Zero property'],
          summary: 'Understand addition as putting groups together and subtraction as taking away from a group using visual stories.',
          objectives: ['Add two single-digit numbers cleanly', 'Subtract by crossing out objects', 'Understand adding or subtracting zero'],
          studyNotes: [
            'Addition (+) means combining two or more groups to find the total sum.',
            'Subtraction (−) means taking some items away from a bigger group to find how many are left.',
            'Adding 0 to any number keeps the number unchanged (e.g., 6 + 0 = 6).'
          ],
          revisionPoints: ['+ is the plus sign for addition', '− is the minus sign for subtraction', 'Order does not change sum: 3 + 4 = 4 + 3'],
          hindiSummary: 'जोड़ (+) का अर्थ वस्तुओं को मिलाना है और घटाव (−) का अर्थ समूह में से कुछ निकालना है।',
          practiceQuestions: [
            { question: 'Riya has 4 red balls and 3 blue balls. How many balls in total?', answer: '4 + 3 = 7 balls.' },
            { question: 'There are 8 birds on a tree. 2 fly away. How many remain?', answer: '8 − 2 = 6 birds remain.' }
          ],
          quizQuestions: [
            { question: 'What is 5 + 4?', options: ['8', '9', '10', '7'], correctIndex: 1, explanation: 'Counting 4 steps forward from 5 gives 9.' },
            { question: 'What is 9 − 3?', options: ['5', '6', '7', '4'], correctIndex: 1, explanation: 'Taking 3 away from 9 leaves 6.' },
            { question: 'What do you get when you add 0 to 8?', options: ['0', '7', '8', '9'], correctIndex: 2, explanation: 'Adding zero adds nothing, so 8 + 0 = 8.' },
            { question: 'Aman had 7 pencils and gave 7 away. How many are left?', options: ['1', '7', '0', '14'], correctIndex: 2, explanation: '7 − 7 = 0 pencils left.' },
            { question: 'Which pair adds up to 10?', options: ['6 + 3', '5 + 4', '7 + 3', '8 + 1'], correctIndex: 2, explanation: '7 + 3 = 10.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Shapes and Spatial Sense',
          topics: ['Circle, square, triangle, rectangle', 'Rolling and sliding', 'Inside and outside', 'Top and bottom'],
          summary: 'Explore flat and solid shapes around home and school and learn positional words like inside, outside, above, and below.',
          objectives: ['Recognize circle, square, triangle, and rectangle', 'Distinguish objects that roll from objects that slide', 'Use spatial words accurately'],
          studyNotes: [
            'A circle is round with no corners (like a coin or bangle). A triangle has 3 sides and 3 corners.',
            'A square has 4 equal sides and 4 corners. A rectangle has 4 sides where opposite sides are equal.',
            'Round objects like a ball roll smoothly, while flat-bottomed boxes slide.'
          ],
          revisionPoints: ['Triangle = 3 sides', 'Square = 4 equal sides', 'Sphere rolls; cube slides'],
          hindiSummary: 'गोला, वर्ग, त्रिभुज और आयत की पहचान तथा लुढ़कने व खिसकने वाली वस्तुओं की समझ।',
          practiceQuestions: [
            { question: 'Name one object that both rolls and slides.', answer: 'A cylindrical pencil or bottle rolls on its curved side and slides on its flat base.' },
            { question: 'How many corners does a rectangle have?', answer: 'A rectangle has 4 corners.' }
          ],
          quizQuestions: [
            { question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'Tri means three; a triangle always has 3 straight sides.' },
            { question: 'Which shape has 4 equal sides?', options: ['Circle', 'Triangle', 'Square', 'Oval'], correctIndex: 2, explanation: 'All four sides of a square are equal in length.' },
            { question: 'Which object will roll easily on a slope?', options: ['Brick', 'Football', 'Book', 'Lunchbox'], correctIndex: 1, explanation: 'A football is round and rolls smoothly.' },
            { question: 'Which shape has zero corners?', options: ['Square', 'Rectangle', 'Circle', 'Triangle'], correctIndex: 2, explanation: 'A circle is curved all around with no sharp corners.' },
            { question: 'A notebook page is shaped like a:', options: ['Circle', 'Rectangle', 'Triangle', 'Sphere'], correctIndex: 1, explanation: 'Opposite sides of a notebook page are equal, forming a rectangle.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(1, 'english', 'English', 'Languages', 'lavender', 'Phonics, everyday vocabulary, naming words, and simple sentence formation.', [
        {
          title: 'Vowels, Consonants & Phonics',
          topics: ['Alphabet order', 'Five vowels (a, e, i, o, u)', 'Short vowel words', 'Rhyming sounds'],
          summary: 'Master the 26 letters of the English alphabet, recognize the 5 vowels, and blend sounds to read simple CVC words.',
          objectives: ['Identify vowels and consonants', 'Form 3-letter rhyming words', 'Arrange letters in A–Z sequence'],
          studyNotes: [
            'The English alphabet has 26 letters: 5 vowels (a, e, i, o, u) and 21 consonants.',
            'Rhyming words end with the same sound, such as cat, bat, mat, and hat.',
            'Every English word needs a vowel sound to be spoken smoothly.'
          ],
          revisionPoints: ['Vowels: A, E, I, O, U', '21 Consonants', 'Rhyming words share ending sounds'],
          practiceQuestions: [
            { question: 'Write two words that rhyme with "sun".', answer: 'Fun and run rhyme with sun.' },
            { question: 'Circle the vowels in the word "apple".', answer: 'a and e are the vowels in apple.' }
          ],
          quizQuestions: [
            { question: 'How many vowels are in the English alphabet?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'The five vowels are a, e, i, o, and u.' },
            { question: 'Which word rhymes with "pen"?', options: ['pin', 'hen', 'pan', 'pot'], correctIndex: 1, explanation: 'Pen and hen share the "-en" ending sound.' },
            { question: 'Which letter comes between G and I?', options: ['F', 'H', 'J', 'K'], correctIndex: 1, explanation: 'The alphabet sequence is G, H, I.' },
            { question: 'Which of these starts with a vowel?', options: ['Ball', 'Dog', 'Owl', 'Kite'], correctIndex: 2, explanation: 'Owl starts with the vowel O.' },
            { question: 'How many total letters are in the English alphabet?', options: ['24', '25', '26', '28'], correctIndex: 2, explanation: 'There are 26 letters from A to Z.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Naming Words (Nouns)',
          topics: ['Person, place, animal, thing', 'Singular and plural (-s)', 'Capital letters for names'],
          summary: 'Discover that everything we see around us has a name, and learn how to group naming words into people, places, animals, and things.',
          objectives: ['Identify naming words in sentences', 'Classify nouns into 4 groups', 'Form simple plurals by adding -s'],
          studyNotes: [
            'A naming word (noun) is the name of a person, place, animal, or thing.',
            'One item is singular (book); more than one is plural (books).',
            'Special names of people or cities always start with a capital letter (e.g., Meera, Delhi).'
          ],
          revisionPoints: ['Person: teacher, doctor', 'Place: school, park', 'Add -s for many plurals'],
          practiceQuestions: [
            { question: 'Pick the naming words: "The dog sits on the mat."', answer: 'dog (animal) and mat (thing).' },
            { question: 'What is the plural of "apple"?', answer: 'apples.' }
          ],
          quizQuestions: [
            { question: 'Which word is the name of a place?', options: ['Pencil', 'Garden', 'Rabbit', 'Jump'], correctIndex: 1, explanation: 'A garden is a place.' },
            { question: 'What is the plural of "chair"?', options: ['chair', 'chaires', 'chairs', 'chairing'], correctIndex: 2, explanation: 'Add -s to make chair plural: chairs.' },
            { question: 'Find the naming word in: "Rohan eats a mango."', options: ['eats', 'a', 'mango', 'fast'], correctIndex: 2, explanation: 'Mango is a thing (fruit) and Rohan is a person.' },
            { question: 'Which word is an animal naming word?', options: ['Table', 'Elephant', 'School', 'Blue'], correctIndex: 1, explanation: 'Elephant is an animal.' },
            { question: 'Which naming word must start with a capital letter?', options: ['tree', 'river', 'india', 'shoe'], correctIndex: 2, explanation: 'India is the special name of a country.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Action Words & Simple Sentences',
          topics: ['Everyday verbs', 'This and That', 'Sentence structure with full stop'],
          summary: 'Use action words like run, read, eat, and play to build clear, complete sentences ending with a full stop.',
          objectives: ['Recognize action words', 'Use This (near) and That (far)', 'Begin sentences with a capital letter'],
          studyNotes: [
            'Action words (verbs) tell us what a person or animal is doing, like jump, write, sing, or sleep.',
            'Use "This" for something near you and "That" for something far away.',
            'A sentence always starts with a capital letter and ends with a full stop (.).'
          ],
          revisionPoints: ['Action = doing word', 'This = near, That = far', 'Capital letter + Full stop'],
          practiceQuestions: [
            { question: 'Underline the action word: "Birds fly in the sky."', answer: 'fly.' },
            { question: 'Fill in: ___ is my book right here in my hand.', answer: 'This.' }
          ],
          quizQuestions: [
            { question: 'Which word is an action word?', options: ['Book', 'Swim', 'Red', 'Chair'], correctIndex: 1, explanation: 'Swim describes an action someone does.' },
            { question: 'We use "That" for an object that is:', options: ['In our hand', 'Far away', 'Very small', 'Inside our bag'], correctIndex: 1, explanation: 'That points to a single object at a distance.' },
            { question: 'How does a simple telling sentence end?', options: ['Comma', 'Full stop (.)', 'Exclamation only', 'Nothing'], correctIndex: 1, explanation: 'A statement ends with a full stop.' },
            { question: 'Choose the correct sentence:', options: ['the cat runs.', 'The cat runs.', 'The cat runs', 'the Cat Runs'], correctIndex: 1, explanation: 'Starts with a capital T and ends with a full stop.' },
            { question: 'Identify the action word in: "Ananya drinks milk."', options: ['Ananya', 'drinks', 'milk', 'none'], correctIndex: 1, explanation: 'Drinks tells us what Ananya is doing.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(1, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'स्वर, व्यंजन, मात्राएँ और सरल शब्द निर्माण।', [
        {
          title: 'स्वर और व्यंजन (वर्णमाला)',
          topics: ['अ से अः तक स्वर', 'क से ज्ञ तक व्यंजन', 'अक्षर पहचान'],
          summary: 'हिन्दी वर्णमाला के सभी स्वरों और व्यंजनों की सही ध्वनि और क्रम को समझें।',
          objectives: ['स्वर और व्यंजन में अंतर पहचानना', 'अक्षरों को सही क्रम में पढ़ना', 'प्रथम अक्षर से शब्द जोड़ना'],
          studyNotes: [
            'हिन्दी वर्णमाला में अ से औ तक प्रमुख स्वर होते हैं जो बिना किसी अन्य वर्ण की सहायता के बोले जाते हैं।',
            'क से ह तक व्यंजन स्वरों की सहायता से बोले जाते हैं।',
            'वर्णमाला के सही अभ्यास से हम सरल शब्द आसानी से पढ़ सकते हैं।'
          ],
          revisionPoints: ['स्वर: अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ', 'अं अनुस्वार और अः विसर्ग कहलाते हैं', 'वर्णों के मेल से शब्द बनते हैं'],
          practiceQuestions: [
            { question: '"अ" और "क" में से स्वर कौन है?', answer: '"अ" स्वर है और "क" व्यंजन है।' },
            { question: 'क वर्ग के पाँच व्यंजन लिखिए।', answer: 'क, ख, ग, घ, ङ।' }
          ],
          quizQuestions: [
            { question: 'इनमें से कौन-सा वर्ण स्वर है?', options: ['क', 'म', 'इ', 'प'], correctIndex: 2, explanation: '"इ" एक स्वर है, बाकी व्यंजन हैं।' },
            { question: 'हिन्दी वर्णमाला में "ग" किस अक्षर के बाद आता है?', options: ['क', 'ख', 'घ', 'च'], correctIndex: 1, explanation: 'क वर्ग का क्रम क, ख, ग, घ, ङ है।' },
            { question: '"आम" शब्द का पहला अक्षर क्या है?', options: ['अ', 'आ', 'म', 'इ'], correctIndex: 1, explanation: '"आम" आ स्वर से शुरू होता है।' },
            { question: 'इनमें से कौन-सा व्यंजन है?', options: ['उ', 'ए', 'त', 'ओ'], correctIndex: 2, explanation: '"त" त वर्ग का पहला व्यंजन है।' },
            { question: 'अक्षरों के सही मेल से क्या बनता है?', options: ['अंक', 'शब्द', 'रंग', 'चित्र'], correctIndex: 1, explanation: 'दो या अधिक वर्णों के सार्थक मेल से शब्द बनता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'मात्राओं का ज्ञान (आ, इ, ई)',
          topics: ['आ (ा) की मात्रा', 'इ (ि) और ई (ी) की मात्रा', 'मात्रा लगाकर शब्द बनाना'],
          summary: 'व्यंजनों पर आ, इ और ई की मात्रा लगाकर नए और सार्थक शब्द बनाना सीखें।',
          objectives: ['मात्रा चिह्नों को पहचानना', 'छोटी इ और बड़ी ई की ध्वनि समझना', 'चित्र देखकर मात्रा वाले शब्द लिखना'],
          studyNotes: [
            'व्यंजन के बाद लगने वाली आ की मात्रा (ा) ध्वनि को लंबा करती है, जैसे: क + ा + म = काम।',
            'इ की मात्रा (ि) अक्षर के आगे लगती है (दिन, किताब), जबकि ई की मात्रा (ी) अक्षर के पीछे लगती है (नीला, खीर)।'
          ],
          revisionPoints: ['ा = आ की मात्रा', 'ि = छोटी इ की मात्रा', 'ी = बड़ी ई की मात्रा'],
          practiceQuestions: [
            { question: '"म" और "ल" में आ की मात्रा लगाकर शब्द बनाइए।', answer: 'माला।' },
            { question: 'छोटी इ की मात्रा वाले दो शब्द लिखिए।', answer: 'दिन, हिरन।' }
          ],
          quizQuestions: [
            { question: '"ताला" शब्द में किस स्वर की मात्रा लगी है?', options: ['इ', 'उ', 'आ', 'ए'], correctIndex: 2, explanation: 'त और ल दोनों में आ (ा) की मात्रा लगी है।' },
            { question: 'छोटी इ (ि) की मात्रा अक्षर के किस ओर लगती है?', options: ['पीछे', 'आगे (बाएँ)', 'नीचे', 'ऊपर'], correctIndex: 1, explanation: 'छोटी इ की मात्रा हमेशा अक्षर के आगे लगती है।' },
            { question: 'कौन-सा शब्द बड़ी ई (ी) की मात्रा का है?', options: ['किताब', 'चिड़िया', 'मछली', 'गिलास'], correctIndex: 2, explanation: 'मछली में "ल" पर बड़ी ई (ी) की मात्रा है।' },
            { question: 'र + ा + ज + ा से कौन-सा शब्द बनेगा?', options: ['रजा', 'राजा', 'राज', 'रजी'], correctIndex: 1, explanation: 'र+ा = रा और ज+ा = जा, मिलकर राजा बनता है।' },
            { question: '"दिल" शब्द में किसकी मात्रा है?', options: ['आ', 'इ', 'ई', 'उ'], correctIndex: 1, explanation: 'द पर छोटी इ (ि) की मात्रा है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'दो और तीन अक्षर वाले सरल शब्द',
          topics: ['अमात्रिक शब्द', 'फलों और जानवरों के नाम', 'सरल वाक्य पठन'],
          summary: 'बिना मात्रा के दो और तीन अक्षर वाले सरल शब्द तथा दैनिक जीवन के वाक्य पढ़ना सीखें।',
          objectives: ['अमात्रिक शब्दों का शुद्ध उच्चारण', 'सरल वाक्य बनाना', 'पर्यावरण से जुड़े शब्द सीखना'],
          studyNotes: [
            'दो अक्षर के शब्द: घर, जल, फल, नल, बस।',
            'तीन अक्षर के शब्द: कमल, मटर, सड़क, कलम।',
            'वाक्य पूरा होने पर हिन्दी में पूर्ण विराम (।) लगाते हैं।'
          ],
          revisionPoints: ['घर चल।', 'जल भर।', 'पूर्ण विराम (।) वाक्य के अंत में आता है'],
          practiceQuestions: [
            { question: 'क, म, ल को जोड़कर कौन-सा शब्द बनता है?', answer: 'कमल (एक फूल का नाम)।' },
            { question: 'दो अक्षर के तीन शब्द बताइए।', answer: 'घर, जल, फल।' }
          ],
          quizQuestions: [
            { question: 'क + ल + म से कौन-सा शब्द बनेगा?', options: ['कमल', 'कलम', 'मकल', 'लमक'], correctIndex: 1, explanation: 'क, ल और म के क्रम से "कलम" शब्द बनता है।' },
            { question: 'इनमें से कौन-सा दो अक्षर वाला शब्द है?', options: ['मटर', 'नमक', 'फल', 'सड़क'], correctIndex: 2, explanation: 'फल में दो अक्षर (फ + ल) हैं।' },
            { question: 'हिन्दी वाक्य के अंत में क्या लगाते हैं?', options: ['?', '। (पूर्ण विराम)', ',', ';'], correctIndex: 1, explanation: 'हिन्दी के साधारण वाक्य के अंत में खड़ी पाई (।) पूर्ण विराम होता है।' },
            { question: '"कमल" किसका नाम है?', options: ['फल', 'फूल', 'पक्षी', 'रंग'], correctIndex: 1, explanation: 'कमल एक सुंदर फूल है।' },
            { question: 'सही वाक्य चुनिए:', options: ['घर जल भर।', 'नल पर जल भर।', 'कमल बस चल।', 'फल सड़क पर।'], correctIndex: 1, explanation: '"नल पर जल भर।" एक सार्थक वाक्य है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(1, 'evs', 'Environmental Studies (EVS)', 'EVS', 'mint', 'My body, family, good habits, plants, and animals in our surroundings.', [
        {
          title: 'My Body and Five Senses',
          topics: ['Body parts', 'Five sense organs', 'Keeping clean'],
          summary: 'Learn the names and uses of external body parts and discover how our five sense organs help us experience the world.',
          objectives: ['Identify major body parts', 'Match each sense organ with its function', 'Practice daily hygiene habits'],
          studyNotes: [
            'Our body has five sense organs: Eyes (see), Ears (hear), Nose (smell), Tongue (taste), and Skin (feel/touch).',
            'Hands help us write, hold, and eat; legs help us walk, run, and jump.',
            'Brushing teeth twice a day and washing hands before meals keep germs away.'
          ],
          revisionPoints: ['5 Sense Organs: Eyes, Ears, Nose, Tongue, Skin', 'Wash hands with soap', 'Sleep 8–9 hours daily'],
          hindiSummary: 'हमारे शरीर के पाँच ज्ञानेंद्रियाँ—आँख, कान, नाक, जीभ और त्वचा—हमें देखने, सुनने, सूँघने, चखने और महसूस करने में मदद करती हैं।',
          practiceQuestions: [
            { question: 'Which sense organ tells us if milk is hot or cold?', answer: 'Skin (sense of touch).' },
            { question: 'Name two good hygiene habits.', answer: 'Brushing teeth twice daily and washing hands before eating.' }
          ],
          quizQuestions: [
            { question: 'How many sense organs do we have?', options: ['3', '4', '5', '6'], correctIndex: 2, explanation: 'Humans have five sense organs: eyes, ears, nose, tongue, and skin.' },
            { question: 'Which organ helps us hear music?', options: ['Nose', 'Ears', 'Tongue', 'Skin'], correctIndex: 1, explanation: 'Ears detect sound waves so we can hear.' },
            { question: 'Which sense organ helps us taste sweet mangoes?', options: ['Eyes', 'Tongue', 'Nose', 'Ears'], correctIndex: 1, explanation: 'Taste buds on our tongue detect sweet, salty, sour, and bitter tastes.' },
            { question: 'When should we wash our hands with soap?', options: ['Never', 'Before and after meals', 'Once a week', 'Only at night'], correctIndex: 1, explanation: 'Washing hands before and after meals prevents illness.' },
            { question: 'Our skin helps us:', options: ['See colors', 'Feel hot and cold', 'Smell flowers', 'Hear bells'], correctIndex: 1, explanation: 'Skin gives us the sense of touch and temperature.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'My Family, Home & Food',
          topics: ['Nuclear and joint family', 'Rooms in a house', 'Healthy food habits'],
          summary: 'Understand how family members care for each other, why we need a house, and how healthy food gives us energy.',
          objectives: ['Distinguish small and big families', 'Identify purpose of rooms in a home', 'Recognize healthy vs junk foods'],
          studyNotes: [
            'Parents and children living together make a small (nuclear) family. Grandparents, uncles, aunts, and cousins together form a joint family.',
            'A house protects us from heat, rain, cold, and wild animals.',
            'Food gives us energy to play and study. Fruits, vegetables, milk, and pulses make us strong.'
          ],
          revisionPoints: ['Family teaches sharing and care', 'House protects from weather', 'Drink plenty of clean water'],
          practiceQuestions: [
            { question: 'Why do we need food?', answer: 'Food gives us energy to work and play, and helps us grow strong and healthy.' },
            { question: 'Where is food cooked in a house?', answer: 'In the kitchen.' }
          ],
          quizQuestions: [
            { question: 'Who are your father’s or mother’s parents?', options: ['Cousins', 'Grandparents', 'Neighbors', 'Friends'], correctIndex: 1, explanation: 'Your parents’ parents are your grandparents.' },
            { question: 'Which room is used for cooking food?', options: ['Bedroom', 'Bathroom', 'Kitchen', 'Balcony'], correctIndex: 2, explanation: 'Meals are prepared in the kitchen.' },
            { question: 'Which food helps us grow strong and healthy?', options: ['Fresh fruits and milk', 'Only candy', 'Stale chips', 'Fizzy soda'], correctIndex: 0, explanation: 'Fresh fruits and milk provide vitamins, minerals, and calcium.' },
            { question: 'A house protects us from:', options: ['Rain and heat', 'Sunlight only', 'Friends', 'Books'], correctIndex: 0, explanation: 'A shelter protects us from harsh weather and danger.' },
            { question: 'What kind of water should we drink?', options: ['Muddy water', 'Clean filtered water', 'Salty sea water', 'Drain water'], correctIndex: 1, explanation: 'Clean drinking water keeps our stomach healthy.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Plants and Animals Around Us',
          topics: ['Trees and small plants', 'Pet, domestic, and wild animals', 'Caring for nature'],
          summary: 'Observe big trees and small herbs, and learn the difference between pet, farm, and wild animals.',
          objectives: ['Identify parts of a plant', 'Group animals by where they live', 'Show kindness to plants and animals'],
          studyNotes: [
            'Big and strong plants are called trees (like mango and neem). Small plants with soft stems are herbs (like mint).',
            'Wild animals live in forests (lion, tiger, elephant). Domestic animals help us on farms (cow, goat, horse).',
            'Plants need sunlight, water, air, and soil to grow.'
          ],
          revisionPoints: ['Trees have thick woody trunks', 'Wild animals live in forests', 'Water plants regularly'],
          practiceQuestions: [
            { question: 'Name two domestic animals and how they help us.', answer: 'Cow (gives milk) and sheep (gives wool).' },
            { question: 'What does a seed need to grow into a plant?', answer: 'Soil, water, air, and sunlight.' }
          ],
          quizQuestions: [
            { question: 'Which of these is a wild animal?', options: ['Dog', 'Cow', 'Tiger', 'Cat'], correctIndex: 2, explanation: 'A tiger lives naturally in the forest.' },
            { question: 'What is the thick woody stem of a big tree called?', options: ['Leaf', 'Trunk', 'Petal', 'Seed'], correctIndex: 1, explanation: 'The strong main stem of a tree is its trunk.' },
            { question: 'Which animal gives us wool?', options: ['Sheep', 'Cat', 'Fish', 'Crow'], correctIndex: 0, explanation: 'Sheep have thick fleece used to make wool.' },
            { question: 'What do green leaves need to make food for the plant?', options: ['Darkness', 'Sunlight and water', 'Ice only', 'Plastic'], correctIndex: 1, explanation: 'Plants use sunlight, water, and air to grow.' },
            { question: 'Where do fish live?', options: ['On trees', 'In water', 'Underground caves', 'On roofs'], correctIndex: 1, explanation: 'Fish breathe and swim in water.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(1, 'cs', 'Computer Studies', 'Technology', 'lavender', 'What is a computer, its main parts, and safe lab habits.', [
        {
          title: 'Computer: A Smart Machine',
          topics: ['Natural vs man-made things', 'What is a machine', 'Uses of computers'],
          summary: 'Understand how machines save time and effort, and discover how computers help us at home and school.',
          objectives: ['Differentiate natural and man-made things', 'Understand what makes a computer a smart machine', 'List everyday uses of computers'],
          studyNotes: [
            'Trees, rivers, and mountains are natural things. Books, cars, and computers are man-made things.',
            'Machines make our work easier and faster. A computer runs on electricity and can draw, play music, and solve sums.',
            'Computers are used in schools, hospitals, banks, and railway stations.'
          ],
          revisionPoints: ['Natural = made by nature', 'Computer = electronic machine', 'Never touch wet plugs'],
          practiceQuestions: [
            { question: 'Give two examples of machines at home.', answer: 'Refrigerator and washing machine.' },
            { question: 'Name two places where computers are used.', answer: 'School and hospital.' }
          ],
          quizQuestions: [
            { question: 'Which of these is a natural thing?', options: ['Laptop', 'Mountain', 'Bicycle', 'Chair'], correctIndex: 1, explanation: 'Mountains are formed by nature, not made by humans.' },
            { question: 'What does a computer need to work?', options: ['Water', 'Electricity / Battery', 'Petrol', 'Wood'], correctIndex: 1, explanation: 'A computer is an electronic machine powered by electricity or a battery.' },
            { question: 'Which activity can you do on a computer?', options: ['Cook rice', 'Draw and color pictures', 'Plant a tree', 'Wash clothes'], correctIndex: 1, explanation: 'Drawing programs let us paint and create pictures on a computer.' },
            { question: 'Machines help us work:', options: ['Slower', 'Faster and easier', 'More tired', 'Without any tools'], correctIndex: 1, explanation: 'Machines save time and reduce effort.' },
            { question: 'Where are computers used to book train tickets?', options: ['Playground', 'Railway station', 'Bakery', 'Forest'], correctIndex: 1, explanation: 'Railway reservation counters use computers to issue tickets.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Main Parts of a Computer',
          topics: ['Monitor', 'CPU', 'Keyboard', 'Mouse'],
          summary: 'Get to know the four core parts of a desktop computer—Monitor, CPU, Keyboard, and Mouse—and what each one does.',
          objectives: ['Name the four main computer parts', 'Identify CPU as the brain of the computer', 'Match keyboard and mouse functions'],
          studyNotes: [
            'Monitor looks like a TV screen and shows words, pictures, and videos.',
            'CPU (Central Processing Unit) is the brain of the computer.',
            'Keyboard has keys for typing letters and numbers; Mouse helps point and click items on the screen.'
          ],
          revisionPoints: ['Monitor = screen', 'CPU = brain', 'Keyboard = typing, Mouse = pointing'],
          practiceQuestions: [
            { question: 'Which part of the computer is called its brain?', answer: 'CPU (Central Processing Unit).' },
            { question: 'Which part looks like a television screen?', answer: 'The Monitor.' }
          ],
          quizQuestions: [
            { question: 'Which part is the brain of the computer?', options: ['Mouse', 'Monitor', 'CPU', 'Speaker'], correctIndex: 2, explanation: 'The CPU processes all instructions.' },
            { question: 'Which device do we use to type our name?', options: ['Keyboard', 'Monitor', 'Printer', 'Mouse'], correctIndex: 0, explanation: 'A keyboard has letter and number keys for typing.' },
            { question: 'Which part displays pictures and cartoons?', options: ['CPU', 'Monitor', 'Keyboard', 'Wire'], correctIndex: 1, explanation: 'The monitor shows visual output on its screen.' },
            { question: 'What do we use to point and click on icons?', options: ['Mouse', 'Speaker', 'Scanner', 'UPS'], correctIndex: 0, explanation: 'Moving the mouse moves the pointer arrow on screen.' },
            { question: 'Which part helps us listen to audio?', options: ['Keyboard', 'Mouse', 'Speakers', 'Monitor'], correctIndex: 2, explanation: 'Speakers produce sound from the computer.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Good Computer Lab Manners',
          topics: ['Sitting posture', 'Keeping keyboard clean', 'Asking teacher before touching wires'],
          summary: 'Learn safe, respectful habits when using computers in school or at home.',
          objectives: ['Maintain good posture', 'Keep food and water away from computers', 'Handle mouse and keyboard gently'],
          studyNotes: [
            'Always sit straight in front of the monitor and keep your eyes at a comfortable distance.',
            'Never eat or drink near a computer because spills can damage the keyboard and circuits.',
            'Cover the computer after shutting it down properly.'
          ],
          revisionPoints: ['Clean hands before typing', 'No food or drinks near computer', 'Ask an adult before touching power plugs'],
          practiceQuestions: [
            { question: 'Why should we not drink juice near a keyboard?', answer: 'Spilled liquid can damage the electronics inside the keyboard.' },
            { question: 'How should we press keys on a keyboard?', answer: 'Gently with clean, dry fingers.' }
          ],
          quizQuestions: [
            { question: 'What should you do before entering a computer lab?', options: ['Bring snacks', 'Keep hands clean and dry', 'Run fast', 'Pull cables'], correctIndex: 1, explanation: 'Clean, dry hands protect the keyboard and mouse.' },
            { question: 'How should you sit in front of a computer?', options: ['Slouching very close', 'Straight at a safe distance', 'Standing on the chair', 'Lying on the floor'], correctIndex: 1, explanation: 'Sitting straight protects your back and eyes.' },
            { question: 'If a wire comes loose, what should you do?', options: ['Pull other wires', 'Inform the teacher or parent', 'Pour water', 'Hit the monitor'], correctIndex: 1, explanation: 'Always tell a teacher or adult rather than touching power cables.' },
            { question: 'Why must we press keys gently?', options: ['To break them', 'To keep the keyboard working well', 'To make loud noise', 'To turn off electricity'], correctIndex: 1, explanation: 'Gentle typing keeps keys from jamming or breaking.' },
            { question: 'What should you do after finishing your work?', options: ['Leave it on forever', 'Shut down properly', 'Unplug while running', 'Cover the screen with paint'], correctIndex: 1, explanation: 'Proper shutdown saves work and keeps the system safe.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 2 ====================
  {
    classNumber: 2,
    label: 'Class 2',
    stage: 'Primary (Classes 1–5)',
    subjects: [
      makeSubject(2, 'math', 'Mathematics', 'Mathematics', 'blue', '2-digit & 3-digit numbers, place value, carry-over addition, and early multiplication.', [
        {
          title: 'Place Value up to 999',
          topics: ['Hundreds, Tens, Ones', 'Expanded form', 'Comparing 3-digit numbers', 'Skip counting'],
          summary: 'Understand how 3-digit numbers work using bundles of hundreds, tens, and ones.',
          objectives: ['Identify place value of digits', 'Write numbers in expanded form', 'Order 3-digit numbers'],
          studyNotes: [
            'In 245, 2 is at the Hundreds place (200), 4 is at the Tens place (40), and 5 is at the Ones place (5).',
            'Expanded form of 245 is 200 + 40 + 5.',
            'Skip counting by 2s, 5s, and 10s builds strong multiplication readiness.'
          ],
          revisionPoints: ['10 tens = 1 hundred (100)', 'Greatest 2-digit number = 99', 'Smallest 3-digit number = 100'],
          practiceQuestions: [
            { question: 'Write the expanded form of 378.', answer: '300 + 70 + 8.' },
            { question: 'What is the place value of 6 in 641?', answer: '600 (6 hundreds).' }
          ],
          quizQuestions: [
            { question: 'What is the place value of 5 in 352?', options: ['5', '50', '500', '35'], correctIndex: 1, explanation: '5 is in the tens place, so its value is 50.' },
            { question: 'Which number equals 400 + 20 + 9?', options: ['492', '249', '429', '924'], correctIndex: 2, explanation: '4 hundreds, 2 tens, and 9 ones make 429.' },
            { question: 'How many tens make 100?', options: ['5', '10', '20', '100'], correctIndex: 1, explanation: '10 × 10 = 100.' },
            { question: 'Which is the smallest 3-digit number?', options: ['99', '100', '101', '111'], correctIndex: 1, explanation: '100 is the first number after 99.' },
            { question: 'Complete the skip counting pattern: 15, 20, 25, ___, 35', options: ['28', '30', '32', '26'], correctIndex: 1, explanation: 'Adding 5 each step gives 30.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Addition & Subtraction with Regrouping',
          topics: ['Addition with carry over', 'Subtraction with borrowing', 'Word problems'],
          summary: 'Solve 2-digit addition and subtraction problems confidently using regrouping (carry and borrow).',
          objectives: ['Add 2-digit numbers with carry', 'Subtract 2-digit numbers with borrowing', 'Solve daily life money/item stories'],
          studyNotes: [
            'Always start adding or subtracting from the Ones column on the right.',
            'When the ones sum is 10 or more (e.g., 8 + 5 = 13), write 3 in the ones place and carry 1 ten to the tens column.',
            'In subtraction, if the top ones digit is smaller, borrow 1 ten (= 10 ones) from the tens column.'
          ],
          revisionPoints: ['Start from Ones column', '1 ten borrowed = 10 ones', 'Check subtraction by adding back'],
          practiceQuestions: [
            { question: 'Add 47 + 26.', answer: '7 + 6 = 13 (write 3, carry 1); 4 + 2 + 1 = 7. Answer = 73.' },
            { question: 'Subtract 52 − 18.', answer: 'Borrow 1 ten: 12 − 8 = 4; 4 − 1 = 3. Answer = 34.' }
          ],
          quizQuestions: [
            { question: 'What is 38 + 25?', options: ['53', '63', '65', '58'], correctIndex: 1, explanation: '8 + 5 = 13 (carry 1), 3 + 2 + 1 = 6, so 63.' },
            { question: 'What is 64 − 29?', options: ['45', '35', '33', '43'], correctIndex: 1, explanation: '14 − 9 = 5 and 5 − 2 = 3, giving 35.' },
            { question: 'From which column do we begin vertical addition?', options: ['Hundreds', 'Tens', 'Ones', 'Any'], correctIndex: 2, explanation: 'We always start from the rightmost Ones column.' },
            { question: 'A shopkeeper had 45 kites and sold 17. How many are left?', options: ['28', '32', '27', '62'], correctIndex: 0, explanation: '45 − 17 = 28 kites left.' },
            { question: 'If 24 + ___ = 50, what is the missing number?', options: ['24', '26', '36', '16'], correctIndex: 1, explanation: '50 − 24 = 26.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Repeated Addition & Measurement',
          topics: ['Introduction to multiplication', 'Tables of 2, 3, 5, 10', 'Measuring length in cm/m', 'Reading clock'],
          summary: 'Connect repeated addition to multiplication and explore basic units of length, weight, and telling time.',
          objectives: ['Write repeated addition as multiplication', 'Use ruler for centimeters', 'Read o’clock and half-past times'],
          studyNotes: [
            'Multiplication is fast repeated addition: 4 + 4 + 4 = 3 × 4 = 12.',
            'Short lengths (like a pencil) are measured in centimetres (cm); longer lengths (like a room) in metres (m).',
            'On a clock, the short hand shows Hours and the long hand shows Minutes.'
          ],
          revisionPoints: ['× means groups of', '1 metre = 100 centimetres', 'Short hand = Hour, Long hand = Minute'],
          practiceQuestions: [
            { question: 'Write 5 + 5 + 5 + 5 as a multiplication fact.', answer: '4 × 5 = 20.' },
            { question: 'Which hand on a clock moves faster?', answer: 'The minute hand (or second hand if present) moves faster than the hour hand.' }
          ],
          quizQuestions: [
            { question: 'What is 3 + 3 + 3 + 3 written as multiplication?', options: ['3 × 3', '4 × 3', '4 + 3', '2 × 3'], correctIndex: 1, explanation: '4 groups of 3 equal 4 × 3 = 12.' },
            { question: 'What is 6 × 5?', options: ['25', '30', '35', '11'], correctIndex: 1, explanation: '6 groups of 5 equal 30.' },
            { question: 'Which unit is best for measuring the length of an eraser?', options: ['Kilometre', 'Centimetre', 'Litre', 'Kilogram'], correctIndex: 1, explanation: 'Small objects like erasers are measured in centimetres (cm).' },
            { question: 'When the long hand is on 12 and short hand is on 4, what is the time?', options: ['12:04', '4:00', '4:12', '8:00'], correctIndex: 1, explanation: 'Long hand at 12 means exact hour: 4 o’clock.' },
            { question: 'Any number multiplied by 0 equals:', options: ['1', 'The same number', '0', '10'], correctIndex: 2, explanation: 'Zero groups of anything is always 0.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(2, 'english', 'English', 'Languages', 'lavender', 'Reading comprehension, grammar foundations, pronouns, adjectives, and vocabulary.', [
        {
          title: 'Describing Words (Adjectives)',
          topics: ['Colors, sizes, shapes, feelings', 'Matching adjectives to nouns', 'Opposites'],
          summary: 'Make sentences expressive using describing words (adjectives) that tell us more about naming words.',
          objectives: ['Spot adjectives in sentences', 'Pair suitable adjectives with nouns', 'Learn common opposite pairs'],
          studyNotes: [
            'Describing words (adjectives) tell us about the color, size, shape, number, or quality of a noun.',
            'Examples: a tall tree, a sweet mango, two blue birds, a happy child.',
            'Opposites (antonyms) help compare things: big/small, hot/cold, fast/slow.'
          ],
          revisionPoints: ['Adjective describes a noun', 'Examples: bright, soft, round, three', 'Opposites: tall–short, day–night'],
          practiceQuestions: [
            { question: 'Find the describing word: "The clever fox jumped."', answer: 'clever.' },
            { question: 'What is the opposite of "heavy"?', answer: 'light.' }
          ],
          quizQuestions: [
            { question: 'Which word is a describing word in "a red kite"?', options: ['a', 'red', 'kite', 'none'], correctIndex: 1, explanation: '"red" describes the color of the kite.' },
            { question: 'What is the opposite of "happy"?', options: ['glad', 'sad', 'tall', 'kind'], correctIndex: 1, explanation: 'Sad is the opposite of happy.' },
            { question: 'Choose the best adjective: "Ice cream is ___."', options: ['hot', 'cold', 'loud', 'heavy'], correctIndex: 1, explanation: 'Ice cream is cold.' },
            { question: 'How many adjectives are in "Two fluffy kittens"?', options: ['0', '1', '2', '3'], correctIndex: 2, explanation: 'Both "Two" (number) and "fluffy" (texture) describe kittens.' },
            { question: 'What is the opposite of "soft"?', options: ['smooth', 'hard', 'quiet', 'warm'], correctIndex: 1, explanation: 'Hard is the opposite of soft.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Pronouns (He, She, It, They)',
          topics: ['Replacing nouns', 'I, You, He, She, It, We, They', 'Using is/am/are'],
          summary: 'Avoid repeating names again and again by using pronouns accurately in everyday sentences.',
          objectives: ['Use he, she, it, they correctly', 'Match I with am, singular with is, plural with are'],
          studyNotes: [
            'Pronouns are words used in place of naming words: He (boy/man), She (girl/woman), It (animal/thing), They (more than one).',
            'Use "am" only with "I" (I am a student). Use "is" for one (She is singing). Use "are" for more than one and "you" (They are playing).'
          ],
          revisionPoints: ['I + am', 'He / She / It + is', 'We / You / They + are'],
          practiceQuestions: [
            { question: 'Replace the underlined name: "Riya is reading. Riya likes stories."', answer: 'She likes stories.' },
            { question: 'Fill in: "We ___ going to the library."', answer: 'are.' }
          ],
          quizQuestions: [
            { question: 'Which pronoun replaces "the bicycle"?', options: ['He', 'She', 'It', 'We'], correctIndex: 2, explanation: '"It" is used for things and non-human objects.' },
            { question: 'Fill in the blank: "I ___ seven years old."', options: ['is', 'am', 'are', 'be'], correctIndex: 1, explanation: '"am" always goes with "I".' },
            { question: 'Which word fits: "Arjun and Kabir are friends. ___ play cricket."', options: ['He', 'She', 'It', 'They'], correctIndex: 3, explanation: 'For two or more people, we use "They".' },
            { question: 'Fill in: "The flowers ___ blooming."', options: ['am', 'is', 'are', 'was'], correctIndex: 2, explanation: '"flowers" is plural, so we use "are".' },
            { question: 'Which pronoun is used for a sister or mother?', options: ['He', 'She', 'It', 'They'], correctIndex: 1, explanation: '"She" refers to a female person.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Reading Comprehension & Vocabulary',
          topics: ['Reading short stories', 'Answering who/what/where', 'Prepositions (in, on, under)'],
          summary: 'Read short illustrated passages carefully, answer comprehension questions, and use position words like in, on, and under.',
          objectives: ['Locate answers in a short passage', 'Use prepositions in, on, under, behind', 'Build everyday vocabulary'],
          studyNotes: [
            'Position words (prepositions) show where something is: The book is ON the table. The cat is UNDER the chair. The pen is IN the box.',
            'When reading a story, look for who is in the story, where it happens, and what happens first and last.'
          ],
          revisionPoints: ['in = inside', 'on = resting atop', 'under = below something'],
          practiceQuestions: [
            { question: 'Fill in: "The bird is sitting ___ the branch."', answer: 'on.' },
            { question: 'What do we ask to find a place in a story?', answer: 'Where?' }
          ],
          quizQuestions: [
            { question: 'The shoes are ___ the bed.', options: ['under', 'between', 'into', 'above'], correctIndex: 0, explanation: 'Shoes placed beneath a bed are "under" it.' },
            { question: 'The milk is ___ the glass.', options: ['on', 'in', 'under', 'over'], correctIndex: 1, explanation: 'Liquid held inside a container is "in" it.' },
            { question: 'Which question word asks about a person?', options: ['Where', 'When', 'Who', 'Why'], correctIndex: 2, explanation: '"Who" asks about people or characters.' },
            { question: 'Find the correct pair of rhyming words:', options: ['Tree – Bee', 'Book – Pen', 'Sun – Moon', 'Cat – Dog'], correctIndex: 0, explanation: 'Tree and Bee rhyme.' },
            { question: 'The sun rises in the:', options: ['West', 'East', 'North', 'South'], correctIndex: 1, explanation: 'The sun always rises in the East.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(2, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'संयुक्ताक्षर, संज्ञा परिचय, विलोम शब्द और सरल अनुच्छेद पठन।', [
        {
          title: 'मात्राओं का अभ्यास (उ, ऊ, ए, ऐ, ओ, औ)',
          topics: ['उ और ऊ की मात्रा', 'ए, ऐ, ओ, औ की मात्रा', 'शुद्ध वर्तनी'],
          summary: 'उ, ऊ, ए, ऐ, ओ और औ की मात्राओं के सही प्रयोग से शब्द पढ़ना और लिखना सीखें।',
          objectives: ['सभी मात्राओं के चिह्न पहचानना', 'छोटे उ और बड़े ऊ में अंतर समझना', 'वाक्यों में सही शब्द चुनना'],
          studyNotes: [
            'छोटे उ (ु) की मात्रा हल्की होती है (गुलाब, कछुआ), बड़े ऊ (ू) की मात्रा लंबी होती है (सूरज, फूल)।',
            'र में उ की मात्रा (रु - रुपया) और ऊ की मात्रा (रू - अमरूद) बीच में लगती है।'
          ],
          revisionPoints: ['ु = उ, ू = ऊ', 'े = ए, ै = ऐ', 'ो = ओ, ौ = औ'],
          practiceQuestions: [
            { question: '"सूरज" और "गुलाब" में किस-किस की मात्रा है?', answer: 'सूरज में ऊ (ू) और गुलाब में उ (ु) तथा आ (ा) की मात्रा है।' },
            { question: 'ओ की मात्रा वाले दो शब्द लिखिए।', answer: 'मोर, कोयल।' }
          ],
          quizQuestions: [
            { question: '"फूल" शब्द में कौन-सी मात्रा लगी है?', options: ['उ', 'ऊ', 'ओ', 'ए'], correctIndex: 1, explanation: 'फ के नीचे बड़े ऊ (ू) की मात्रा है।' },
            { question: '"मोर" शब्द में किसकी मात्रा है?', options: ['ओ', 'औ', 'ए', 'आ'], correctIndex: 0, explanation: 'म पर ओ (ो) की मात्रा लगी है।' },
            { question: 'सही वर्तनी वाला शब्द चुनिए:', options: ['सुरज', 'सूरज', 'सोरज', 'सेरज'], correctIndex: 1, explanation: 'सूरज में बड़े ऊ की मात्रा होती है।' },
            { question: '"मैना" शब्द में कौन-सी मात्रा है?', options: ['ए', 'ऐ', 'ओ', 'अ'], correctIndex: 1, explanation: 'म पर ऐ (ै) की मात्रा है।' },
            { question: '"रुपया" में "र" पर कौन-सी मात्रा लगी है?', options: ['छोटा उ', 'बड़ा ऊ', 'इ', 'आ'], correctIndex: 0, explanation: 'रुपया में र पर छोटे उ (रु) की मात्रा लगती है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'नाम वाले शब्द (संज्ञा) और वचन',
          topics: ['व्यक्ति, वस्तु, स्थान, प्राणी के नाम', 'एकवचन और बहुवचन'],
          summary: 'आसपास की वस्तुओं, लोगों और स्थानों के नामों को संज्ञा के रूप में पहचानें और एकवचन से बहुवचन बनाएँ।',
          objectives: ['संज्ञा की परिभाषा समझना', 'एक और अनेक (वचन) बदलना'],
          studyNotes: [
            'किसी व्यक्ति, वस्तु, स्थान या प्राणी के नाम को संज्ञा कहते हैं।',
            'एक संख्या का बोध कराने वाले शब्द एकवचन (लड़का, किताब) और एक से अधिक वाले बहुवचन (लड़के, किताबें) कहलाते हैं।'
          ],
          revisionPoints: ['नाम = संज्ञा', 'तारा -> तारे', 'लड़की -> लड़कियाँ'],
          practiceQuestions: [
            { question: '"तितली" का बहुवचन लिखिए।', answer: 'तितलियाँ।' },
            { question: 'वाक्य से संज्ञा चुनिए: "बच्चा गेंद से खेलता है।"', answer: 'बच्चा, गेंद।' }
          ],
          quizQuestions: [
            { question: '"किताब" का बहुवचन क्या होगा?', options: ['किताबा', 'किताबें', 'किताबी', 'किताबों'], correctIndex: 1, explanation: 'किताब का बहुवचन "किताबें" होता है।' },
            { question: 'इनमें से स्थान का नाम कौन-सा है?', options: ['मेज', 'दिल्ली', 'बिल्ली', 'मीठा'], correctIndex: 1, explanation: 'दिल्ली एक शहर (स्थान) का नाम है।' },
            { question: '"लड़के" किस वचन का शब्द है?', options: ['एकवचन', 'बहुवचन', 'दोनों नहीं', 'संज्ञा नहीं'], correctIndex: 1, explanation: 'लड़के एक से अधिक का बोध कराता है।' },
            { question: 'इनमें से संज्ञा शब्द चुनिए:', options: ['दौड़ना', 'हँसना', 'पेड़', 'लाल'], correctIndex: 2, explanation: 'पेड़ एक वस्तु/पौधे का नाम है।' },
            { question: '"केला" का बहुवचन क्या है?', options: ['केली', 'केले', 'केलाएँ', 'केलों'], correctIndex: 1, explanation: 'एक केला, अनेक केले।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'विलोम और समानार्थक शब्द',
          topics: ['उल्टे अर्थ वाले शब्द', 'समान अर्थ वाले शब्द', 'छोटी कविता पठन'],
          summary: 'सरल विलोम (उल्टे अर्थ) और पर्यायवाची (समान अर्थ) शब्दों से अपनी हिन्दी शब्दावली समृद्ध करें।',
          objectives: ['दैनिक शब्दों के विलोम बताना', 'समान अर्थ वाले शब्दों को जोड़ना'],
          studyNotes: [
            'उल्टा अर्थ बताने वाले शब्द विलोम कहलाते हैं: दिन–रात, ऊपर–नीचे, अच्छा–बुरा, ठंडा–गरम।',
            'समान अर्थ वाले शब्द: सूर्य–सूरज, पानी–जल, फूल–पुष्प, पेड़–वृक्ष।'
          ],
          revisionPoints: ['विलोम = उल्टा अर्थ', 'समानार्थी = एक जैसा अर्थ'],
          practiceQuestions: [
            { question: '"सुबह" का विलोम शब्द क्या है?', answer: 'शाम।' },
            { question: '"जल" का एक समान अर्थ वाला शब्द बताइए।', answer: 'पानी / नीर।' }
          ],
          quizQuestions: [
            { question: '"दिन" का विलोम शब्द क्या है?', options: ['सुबह', 'रात', 'शाम', 'धूप'], correctIndex: 1, explanation: 'दिन का उल्टा अर्थ रात होता है।' },
            { question: '"फूल" का समानार्थी शब्द कौन-सा है?', options: ['पत्ता', 'पुष्प', 'फल', 'काँटा'], correctIndex: 1, explanation: 'फूल और पुष्प का अर्थ समान है।' },
            { question: '"बड़ा" का विलोम क्या है?', options: ['लंबा', 'छोटा', 'मोटा', 'ऊँचा'], correctIndex: 1, explanation: 'बड़ा का विलोम छोटा होता है।' },
            { question: '"गरम" का उल्टा शब्द चुनिए:', options: ['तेज', 'ठंडा', 'मीठा', 'सूखा'], correctIndex: 1, explanation: 'गरम का विलोम ठंडा है।' },
            { question: '"सूरज" का दूसरा नाम क्या है?', options: ['चाँद', 'सूर्य', 'तारा', 'बादल'], correctIndex: 1, explanation: 'सूरज और सूर्य एक ही अर्थ रखते हैं।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(2, 'evs', 'Environmental Studies (EVS)', 'EVS', 'mint', 'Neighbourhood helpers, seasons, water, transport, and safety rules.', [
        {
          title: 'Our Neighbourhood & Community Helpers',
          topics: ['School, hospital, post office, market', 'Helpers around us', 'Being helpful'],
          summary: 'Discover important places in a neighbourhood and appreciate the people who help our community run smoothly.',
          objectives: ['Identify neighbourhood services', 'Match community helpers with their tools', 'Respect all kinds of work'],
          studyNotes: [
            'A neighbourhood has useful places like a school, hospital, bank, fire station, police station, and market.',
            'Doctors treat the sick, teachers help us learn, firefighters put out fires, and postmen deliver letters.'
          ],
          revisionPoints: ['Doctor -> Stethoscope', 'Firefighter -> Fire engine', 'Policeman keeps us safe'],
          practiceQuestions: [
            { question: 'Who delivers letters and parcels to our home?', answer: 'A postman.' },
            { question: 'Where do we keep money safely?', answer: 'In a bank.' }
          ],
          quizQuestions: [
            { question: 'Who treats us when we have a fever?', options: ['Tailor', 'Doctor', 'Cobbler', 'Carpenter'], correctIndex: 1, explanation: 'Doctors examine patients and prescribe medicine.' },
            { question: 'Who stitches our clothes?', options: ['Carpenter', 'Tailor', 'Mason', 'Plumber'], correctIndex: 1, explanation: 'A tailor sews and stitches clothes.' },
            { question: 'Where do we go to borrow storybooks?', options: ['Fire station', 'Library', 'Petrol pump', 'Bus stand'], correctIndex: 1, explanation: 'Libraries lend books for reading.' },
            { question: 'Who repairs leaking water taps?', options: ['Electrician', 'Plumber', 'Painter', 'Baker'], correctIndex: 1, explanation: 'Plumbers install and repair water pipes and taps.' },
            { question: 'Who grows grains and vegetables for us?', options: ['Farmer', 'Pilot', 'Driver', 'Barber'], correctIndex: 0, explanation: 'Farmers grow crops on farms.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Weather, Seasons & Water',
          topics: ['Summer, Monsoon, Winter', 'Sources of water', 'Saving water'],
          summary: 'Observe how weather changes across seasons in India and why clean water must never be wasted.',
          objectives: ['Describe clothes and food in different seasons', 'Name natural sources of water', 'Practice water conservation'],
          studyNotes: [
            'India has three main seasons: Summer (hot, cotton clothes), Monsoon/Rainy (raincoats, umbrellas), and Winter (cold, woollen clothes).',
            'Rain is the main source of fresh water. Rivers, lakes, wells, and ponds store rainwater.'
          ],
          revisionPoints: ['Summer = Cotton clothes', 'Winter = Woollen clothes', 'Turn off taps after use'],
          practiceQuestions: [
            { question: 'Why do we wear cotton clothes in summer?', answer: 'Cotton keeps our body cool and absorbs sweat.' },
            { question: 'Name two sources of fresh water.', answer: 'Rain and rivers.' }
          ],
          quizQuestions: [
            { question: 'Which clothes keep us warm in winter?', options: ['Cotton', 'Woollen', 'Nylon', 'Silk'], correctIndex: 1, explanation: 'Woollen sweaters trap body heat in winter.' },
            { question: 'What is the primary natural source of fresh water on Earth?', options: ['Ocean', 'Rain', 'Tap', 'Plastic bottle'], correctIndex: 1, explanation: 'Rain refills rivers, ponds, and groundwater.' },
            { question: 'What do we use during the rainy season?', options: ['Umbrella and raincoat', 'Heater', 'Fur coat', 'Sunglasses only'], correctIndex: 0, explanation: 'Umbrellas and raincoats keep us dry in the monsoon.' },
            { question: 'Which is a good way to save water?', options: ['Leave tap running while brushing', 'Use a bucket instead of a hose', 'Wash cars daily with pipe', 'Throw away half-filled bottles'], correctIndex: 1, explanation: 'Using a bucket saves gallons of water.' },
            { question: 'In which season do we see dark clouds and rainbows?', options: ['Summer', 'Monsoon', 'Winter', 'Autumn'], correctIndex: 1, explanation: 'Raindrops and sunlight create rainbows during the monsoon.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Transport & Road Safety',
          topics: ['Land, water, and air transport', 'Traffic light signals', 'Safe crossing habits'],
          summary: 'Explore how people travel on land, water, and air, and follow essential traffic rules to stay safe.',
          objectives: ['Classify vehicles into land, water, and air', 'Explain red, yellow, green traffic signals', 'Use zebra crossings safely'],
          studyNotes: [
            'Land transport: bicycle, bus, car, train. Water transport: boat, ship. Air transport: aeroplane, helicopter.',
            'Traffic lights: Red means STOP, Yellow means WAIT/GET READY, Green means GO.',
            'Always cross the road at a zebra crossing with an adult after looking right, left, and right again.'
          ],
          revisionPoints: ['Red = Stop, Yellow = Wait, Green = Go', 'Aeroplane is fastest transport', 'Walk on the footpath'],
          practiceQuestions: [
            { question: 'Name one vehicle that travels on rails.', answer: 'A train (or metro).' },
            { question: 'Where should pedestrians walk along a busy road?', answer: 'On the footpath (pavement).' }
          ],
          quizQuestions: [
            { question: 'Which is the fastest means of transport?', options: ['Bullock cart', 'Bicycle', 'Aeroplane', 'Boat'], correctIndex: 2, explanation: 'Aeroplanes fly at very high speeds across long distances.' },
            { question: 'What does a RED traffic light mean?', options: ['Go fast', 'Stop', 'Turn left', 'Honk horn'], correctIndex: 1, explanation: 'Red signals vehicles to stop completely.' },
            { question: 'Which vehicle is a water transport?', options: ['Scooter', 'Ship', 'Train', 'Helicopter'], correctIndex: 1, explanation: 'Ships travel on seas and oceans.' },
            { question: 'Where should you cross a street?', options: ['Middle of a curve', 'Zebra crossing', 'Between moving buses', 'Anywhere'], correctIndex: 1, explanation: 'Zebra crossings are marked for safe pedestrian crossing.' },
            { question: 'What does the GREEN traffic light tell drivers?', options: ['Stop', 'Sleep', 'Go', 'Reverse'], correctIndex: 2, explanation: 'Green indicates it is safe to proceed.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(2, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Keyboard special keys, mouse actions, and digital drawing basics.', [
        {
          title: 'Keyboard & Special Keys',
          topics: ['Alphabet & Number keys', 'Spacebar, Enter, Backspace', 'Caps Lock'],
          summary: 'Learn how to use special keyboard keys like Spacebar, Enter, Backspace, and Caps Lock while typing.',
          objectives: ['Identify longest key (Spacebar)', 'Move to new line using Enter', 'Erase mistakes with Backspace'],
          studyNotes: [
            'Spacebar is the longest key on the keyboard; it inserts a blank space between words.',
            'Enter key moves the cursor to the next line. Backspace erases characters to the left of the cursor.',
            'Caps Lock lets you type CAPITAL letters continuously.'
          ],
          revisionPoints: ['Spacebar = space', 'Enter = new line', 'Backspace = erase left'],
          practiceQuestions: [
            { question: 'Which is the longest key on a keyboard?', answer: 'The Spacebar.' },
            { question: 'Which key erases a wrong letter to the left?', answer: 'Backspace key.' }
          ],
          quizQuestions: [
            { question: 'Which key adds space between two words?', options: ['Enter', 'Spacebar', 'Shift', 'Escape'], correctIndex: 1, explanation: 'Spacebar adds a blank space.' },
            { question: 'Which key moves the cursor to a new line?', options: ['Backspace', 'Caps Lock', 'Enter', 'Tab'], correctIndex: 2, explanation: 'Pressing Enter starts a new line.' },
            { question: 'To type all CAPITAL letters, turn on:', options: ['Num Lock', 'Caps Lock', 'Spacebar', 'Ctrl'], correctIndex: 1, explanation: 'Caps Lock switches letters to uppercase.' },
            { question: 'Which key deletes the character just before the cursor?', options: ['Spacebar', 'Backspace', 'Enter', 'Up Arrow'], correctIndex: 1, explanation: 'Backspace removes text to the left of the cursor.' },
            { question: 'Arrow keys help us move the cursor:', options: ['Only up', 'Up, down, left, right', 'Only delete text', 'Turn off PC'], correctIndex: 1, explanation: 'There are 4 directional arrow keys.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Mouse Actions & Clicking',
          topics: ['Left click, double click', 'Right click', 'Drag and drop', 'Scroll wheel'],
          summary: 'Master mouse actions including single-click, double-click, right-click, scrolling, and dragging.',
          objectives: ['Select items with single click', 'Open folders with double click', 'Move objects using drag and drop'],
          studyNotes: [
            'Single left-click selects an icon. Double left-click quickly opens a file or program.',
            'Right-click opens a shortcut menu of options. The scroll wheel moves pages up and down.'
          ],
          revisionPoints: ['Single click = select', 'Double click = open', 'Drag & drop = move item'],
          practiceQuestions: [
            { question: 'How do you open a folder icon on the desktop?', answer: 'By double-clicking the left mouse button.' },
            { question: 'What does the scroll wheel do?', answer: 'It moves a page up or down smoothly.' }
          ],
          quizQuestions: [
            { question: 'Which action opens an application icon?', options: ['Single click', 'Double left-click', 'Scroll down', 'Unplug mouse'], correctIndex: 1, explanation: 'Double-clicking opens files and folders.' },
            { question: 'Which button opens a context/options menu?', options: ['Right button', 'Scroll wheel', 'Spacebar', 'Left button'], correctIndex: 0, explanation: 'Right-clicking shows a menu of actions.' },
            { question: 'Moving an icon across the screen while holding the left button is called:', options: ['Scrolling', 'Dragging', 'Typing', 'Printing'], correctIndex: 1, explanation: 'Drag and drop moves items.' },
            { question: 'The small arrow that moves when you move the mouse is the:', options: ['Cursor/Pointer', 'Keyboard', 'CPU', 'Monitor'], correctIndex: 0, explanation: 'The mouse pointer shows where you are pointing.' },
            { question: 'A mouse is always placed on a flat:', options: ['Pillow', 'Mouse pad', 'Water bottle', 'Keyboard'], correctIndex: 1, explanation: 'A mouse pad gives smooth tracking.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Fun with Digital Paint',
          topics: ['Pencil, Brush, Eraser tools', 'Fill with Color', 'Shape tools (Oval, Rectangle)', 'Saving a drawing'],
          summary: 'Create colorful digital art using drawing tools, shapes, and the fill bucket, and learn to save your file.',
          objectives: ['Use Pencil, Eraser, and Fill tools', 'Draw geometric shapes', 'Save drawings with a filename'],
          studyNotes: [
            'Paint programs give us digital tools: Pencil for freehand lines, Fill with Color (bucket) to color closed shapes, and Eraser to fix mistakes.',
            'Always close a shape completely before using the Fill tool, otherwise color leaks outside!'
          ],
          revisionPoints: ['Bucket tool = Fill closed shape', 'Save frequently', 'Line & Oval tools draw neat shapes'],
          practiceQuestions: [
            { question: 'Why should a circle have no gap before using Fill with Color?', answer: 'If there is a gap, the color spills out onto the entire canvas.' },
            { question: 'Which tool is used to draw a straight line?', answer: 'The Line tool.' }
          ],
          quizQuestions: [
            { question: 'Which tool fills a closed shape with color in one click?', options: ['Eraser', 'Fill with Color (Bucket)', 'Magnifier', 'Text tool'], correctIndex: 1, explanation: 'The Paint Bucket fills any closed region.' },
            { question: 'Which tool removes unwanted lines in a drawing?', options: ['Brush', 'Eraser', 'Oval', 'Zoom'], correctIndex: 1, explanation: 'The Eraser tool clears mistakes.' },
            { question: 'To keep your drawing for tomorrow, you must:', options: ['Close without saving', 'Save the file', 'Turn off monitor', 'Delete it'], correctIndex: 1, explanation: 'Saving stores the file on disk.' },
            { question: 'Which tool draws a neat circle?', options: ['Pencil', 'Oval/Ellipse tool', 'Bucket', 'Text'], correctIndex: 1, explanation: 'The Oval tool creates smooth circles and ellipses.' },
            { question: 'Which tool lets you write your name on a drawing?', options: ['Text (A) tool', 'Eraser', 'Line tool', 'Bucket'], correctIndex: 0, explanation: 'The Text tool adds typed words to a picture.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 3 ====================
  {
    classNumber: 3,
    label: 'Class 3',
    stage: 'Primary (Classes 1–5)',
    subjects: [
      makeSubject(3, 'math', 'Mathematics', 'Mathematics', 'blue', '4-digit numbers, multiplication, division basics, time, and patterns.', [
        {
          title: 'Four-Digit Numbers & Place Value',
          topics: ['Thousands place', 'Number names up to 9999', 'Ascending & descending order', 'Even and odd numbers'],
          summary: 'Step into 4-digit numbers up to 9,999, compare numbers using place value, and distinguish even from odd numbers.',
          objectives: ['Read and write 4-digit numbers', 'Identify face value vs place value', 'Separate even and odd numbers'],
          studyNotes: [
            '10 hundreds make 1 thousand (1,000), the smallest 4-digit number. The greatest 4-digit number is 9,999.',
            'Even numbers end in 0, 2, 4, 6, or 8 and can be shared equally into pairs. Odd numbers end in 1, 3, 5, 7, or 9.'
          ],
          revisionPoints: ['Smallest 4-digit = 1000', 'Even endings: 0, 2, 4, 6, 8', 'Face value never changes with position'],
          practiceQuestions: [
            { question: 'Find the difference between the place value and face value of 4 in 4,215.', answer: 'Place value = 4000, Face value = 4. Difference = 3996.' },
            { question: 'Is 3,479 even or odd?', answer: 'Odd, because it ends in 9.' }
          ],
          quizQuestions: [
            { question: 'Which is the smallest 4-digit number?', options: ['999', '1000', '1001', '1111'], correctIndex: 1, explanation: '1000 follows 999 and has 4 digits.' },
            { question: 'Which of these is an even number?', options: ['341', '573', '628', '915'], correctIndex: 2, explanation: '628 ends in 8, so it is divisible by 2 (even).' },
            { question: 'What is the place value of 7 in 2,745?', options: ['7', '70', '700', '7000'], correctIndex: 2, explanation: '7 is in the hundreds place, so its value is 700.' },
            { question: 'What is the face value of 9 in 9,310?', options: ['9000', '900', '90', '9'], correctIndex: 3, explanation: 'Face value of a digit is always the digit itself.' },
            { question: 'Arrange in ascending order: 1205, 1025, 1520', options: ['1025, 1205, 1520', '1520, 1205, 1025', '1205, 1025, 1520', '1025, 1520, 1205'], correctIndex: 0, explanation: 'Ascending order goes from smallest to largest.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Multiplication & Division Foundations',
          topics: ['Multiplying 2-digit by 1-digit', 'Equal sharing (Division)', 'Multiplication-Division family'],
          summary: 'Build fluency in multiplying 2-digit numbers and learn division as equal sharing and repeated subtraction.',
          objectives: ['Multiply 2-digit numbers by 1-digit', 'Divide numbers using equal sharing', 'Relate Dividend, Divisor, and Quotient'],
          studyNotes: [
            'In 24 ÷ 4 = 6, 24 is the Dividend, 4 is the Divisor, and 6 is the Quotient.',
            'Every multiplication fact gives two division facts: 4 × 5 = 20 gives 20 ÷ 4 = 5 and 20 ÷ 5 = 4.',
            'Any number divided by 1 equals the number itself.'
          ],
          revisionPoints: ['Dividend ÷ Divisor = Quotient', 'Division is repeated subtraction', 'Cannot divide by 0'],
          practiceQuestions: [
            { question: 'If 36 chocolates are shared equally among 6 children, how many does each get?', answer: '36 ÷ 6 = 6 chocolates each.' },
            { question: 'Multiply 23 × 4.', answer: '92.' }
          ],
          quizQuestions: [
            { question: 'What is 14 × 5?', options: ['60', '65', '70', '75'], correctIndex: 2, explanation: '(10 × 5) + (4 × 5) = 50 + 20 = 70.' },
            { question: 'What is 42 ÷ 7?', options: ['5', '6', '7', '8'], correctIndex: 1, explanation: '7 × 6 = 42, so 42 ÷ 7 = 6.' },
            { question: 'In 28 ÷ 4 = 7, which number is the divisor?', options: ['28', '4', '7', '0'], correctIndex: 1, explanation: 'The number you divide by (4) is the divisor.' },
            { question: 'What is 19 ÷ 1?', options: ['1', '0', '19', '20'], correctIndex: 2, explanation: 'Dividing any number by 1 gives the number itself.' },
            { question: 'A box holds 8 crayons. How many crayons in 9 boxes?', options: ['64', '72', '81', '63'], correctIndex: 1, explanation: '9 × 8 = 72 crayons.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Time, Money & Patterns',
          topics: ['Hours and minutes', 'Calendar days and months', 'Rupees and Paise', 'Number & shape patterns'],
          summary: 'Read time to 5-minute intervals, convert rupees to paise, and spot growing number and geometric patterns.',
          objectives: ['Convert 1 Rupee = 100 Paise', 'Count days in months', 'Predict next terms in patterns'],
          studyNotes: [
            '1 hour = 60 minutes. 1 day = 24 hours. A regular year has 365 days; a leap year has 366 days.',
            '1 Rupee (₹1) = 100 Paise. So ₹5 = 500 paise.',
            'Patterns follow a clear rule, such as adding 4 each time or alternating shapes.'
          ],
          revisionPoints: ['₹1 = 100 paise', '1 hour = 60 minutes', 'February has 29 days in a leap year'],
          practiceQuestions: [
            { question: 'How many minutes are there in 2 hours?', answer: '2 × 60 = 120 minutes.' },
            { question: 'Convert ₹3.50 into paise.', answer: '350 paise.' }
          ],
          quizQuestions: [
            { question: 'How many paise make ₹1?', options: ['10', '50', '100', '1000'], correctIndex: 2, explanation: '1 Rupee equals 100 paise.' },
            { question: 'How many minutes are in 1 hour?', options: ['30', '50', '60', '100'], correctIndex: 2, explanation: 'An hour has 60 minutes.' },
            { question: 'Which month has 28 or 29 days?', options: ['January', 'February', 'March', 'April'], correctIndex: 1, explanation: 'February has 28 days, and 29 in a leap year.' },
            { question: 'Find the next number: 4, 8, 12, 16, ___', options: ['18', '20', '22', '24'], correctIndex: 1, explanation: 'The pattern adds 4 each time: 16 + 4 = 20.' },
            { question: 'If a notebook costs ₹25 and a pen costs ₹12, what is the total?', options: ['₹35', '₹37', '₹38', '₹47'], correctIndex: 1, explanation: '25 + 12 = ₹37.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(3, 'english', 'English', 'Languages', 'lavender', 'Parts of speech, tenses, punctuation, and creative paragraph writing.', [
        {
          title: 'Countable & Uncountable Nouns',
          topics: ['Nouns we can count', 'Nouns we measure', 'Using a, an, some, many, much'],
          summary: 'Distinguish things you can count individually from things measured in bulk, and pick the right articles.',
          objectives: ['Classify countable and uncountable nouns', 'Use a/an correctly based on sound'],
          studyNotes: [
            'Countable nouns can be counted (apples, chairs, books) and have plurals.',
            'Uncountable nouns cannot be counted singly (milk, sugar, sand, water) and have no plural -s.',
            'Use "an" before a vowel sound (an umbrella, an honest boy) and "a" before a consonant sound (a university, a book).'
          ],
          revisionPoints: ['a/an = singular countable', 'some/much = uncountable', 'vowel sound -> an'],
          practiceQuestions: [
            { question: 'Is "rice" countable or uncountable?', answer: 'Uncountable.' },
            { question: 'Fill in: "She ate ___ orange."', answer: 'an.' }
          ],
          quizQuestions: [
            { question: 'Which noun is uncountable?', options: ['Chair', 'Mango', 'Water', 'Pencil'], correctIndex: 2, explanation: 'Water cannot be counted as 1 water, 2 waters.' },
            { question: 'Choose the right article: "___ elephant"', options: ['a', 'an', 'many', 'two'], correctIndex: 1, explanation: 'Elephant starts with a vowel sound.' },
            { question: 'Choose the right article: "___ hour"', options: ['a', 'an', 'the', 'some'], correctIndex: 1, explanation: 'The "h" in hour is silent, so it starts with a vowel sound.' },
            { question: 'Which word goes with countable nouns?', options: ['many', 'much', 'a little', 'none'], correctIndex: 0, explanation: 'We say "many books", not "much books".' },
            { question: 'Identify the countable noun:', options: ['Sugar', 'Milk', 'Notebook', 'Air'], correctIndex: 2, explanation: 'Notebooks can be counted individually.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Simple Present & Past Tense',
          topics: ['Daily habits (Present)', 'Yesterday actions (Past)', 'Regular -ed verbs', 'Irregular past forms'],
          summary: 'Talk accurately about actions happening regularly now versus actions completed yesterday.',
          objectives: ['Add -s/-es for he/she/it in simple present', 'Change regular verbs to past tense', 'Use common irregular verbs'],
          studyNotes: [
            'Simple Present shows habits or facts: "The sun rises in the east." "He plays football."',
            'Simple Past shows finished actions: "Yesterday, I walked to school." Irregular verbs change form: go -> went, eat -> ate, see -> saw.'
          ],
          revisionPoints: ['He/She + verb-s', 'Regular past: +ed', 'go->went, eat->ate, write->wrote'],
          practiceQuestions: [
            { question: 'Change to past tense: "They play chess."', answer: 'They played chess.' },
            { question: 'What is the past tense of "go"?', answer: 'went.' }
          ],
          quizQuestions: [
            { question: 'What is the past tense of "eat"?', options: ['eated', 'ate', 'eats', 'eating'], correctIndex: 1, explanation: 'Eat is irregular; its past form is ate.' },
            { question: 'Choose the correct present form: "Rohan ___ his teeth daily."', options: ['brush', 'brushes', 'brushed', 'brushing'], correctIndex: 1, explanation: 'Singular subject Rohan takes -es in simple present.' },
            { question: 'Fill in: "Last Sunday, we ___ a rainbow."', options: ['see', 'sees', 'saw', 'seeing'], correctIndex: 2, explanation: '"Last Sunday" indicates past tense: saw.' },
            { question: 'Which sentence is in Simple Present tense?', options: ['I went home.', 'She reads every night.', 'They ran fast.', 'He wrote a letter.'], correctIndex: 1, explanation: '"reads every night" expresses a current habit.' },
            { question: 'What is the past tense of "jump"?', options: ['jumped', 'jumps', 'jumping', 'jamp'], correctIndex: 0, explanation: 'Jump is a regular verb; add -ed.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Punctuation & Guided Writing',
          topics: ['Capital letters', 'Full stop, Question mark, Exclamation', 'Writing 5-sentence paragraphs'],
          summary: 'Punctuate sentences clearly and organize thoughts into a neat 5-sentence descriptive paragraph.',
          objectives: ['Use ?, ., and ! accurately', 'Capitalize days, months, and proper nouns'],
          studyNotes: [
            'Use a question mark (?) after asking something. Use an exclamation mark (!) for strong feelings like surprise or joy.',
            'Always capitalize "I", days of the week, months, and names of people and places.'
          ],
          revisionPoints: ['? = question', '! = strong feeling', 'Proper nouns start with capitals'],
          practiceQuestions: [
            { question: 'Punctuate: "where do you live"', answer: 'Where do you live?' },
            { question: 'Why is "Monday" capitalized?', answer: 'Names of days of the week are proper nouns.' }
          ],
          quizQuestions: [
            { question: 'Which mark ends the sentence: "What is your name"', options: ['.', '?', ',', '!'], correctIndex: 1, explanation: 'Questions end with a question mark (?).' },
            { question: 'Which word should ALWAYS be capitalized anywhere in a sentence?', options: ['and', 'the', 'I', 'my'], correctIndex: 2, explanation: 'The pronoun "I" is always capitalized.' },
            { question: 'Which sentence shows strong excitement?', options: ['I have a pen.', 'Where is the pen?', 'Hurray, we won the match!', 'The pen is blue.'], correctIndex: 2, explanation: 'Exclamation mark (!) conveys excitement.' },
            { question: 'Choose the correctly punctuated sentence:', options: ['we went to jaipur in june.', 'We went to Jaipur in June.', 'We went to jaipur in June.', 'we went to Jaipur in june.'], correctIndex: 1, explanation: 'Sentence start, city Jaipur, and month June are capitalized.' },
            { question: 'A comma (,) is used to:', options: ['End a question', 'Separate items in a list', 'Start a paragraph', 'Replace a verb'], correctIndex: 1, explanation: 'Commas separate items in a list like apples, pears, and plums.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(3, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'लिंग, सर्वनाम, विशेषण और वाक्य रचना।', [
        {
          title: 'लिंग (पुल्लिंग और स्त्रीलिंग)',
          topics: ['लिंग की पहचान', 'पुल्लिंग से स्त्रीलिंग बनाना'],
          summary: 'शब्दों के पुरुष या स्त्री जाति के होने (लिंग) को पहचानें और सही रूप बदलें।',
          objectives: ['पुल्लिंग और स्त्रीलिंग शब्दों में अंतर करना', 'वाक्य के अनुसार सही लिंग चुनना'],
          studyNotes: [
            'पुरुष जाति का बोध कराने वाले शब्द पुल्लिंग (लड़का, शेर, राजा) और स्त्री जाति का बोध कराने वाले शब्द स्त्रीलिंग (लड़की, शेरनी, रानी) कहलाते हैं।'
          ],
          revisionPoints: ['माता – पिता', 'मोर – मोरनी', 'भाई – बहन'],
          practiceQuestions: [
            { question: '"राजा" का स्त्रीलिंग लिखिए।', answer: 'रानी।' },
            { question: '"गाय" पुल्लिंग है या स्त्रीलिंग?', answer: 'स्त्रीलिंग।' }
          ],
          quizQuestions: [
            { question: '"मोर" का स्त्रीलिंग क्या होगा?', options: ['मोरा', 'मोरनी', 'मोरी', 'मोरिन'], correctIndex: 1, explanation: 'मोर का स्त्रीलिंग मोरनी होता है।' },
            { question: 'इनमें से कौन-सा शब्द पुल्लिंग है?', options: ['बहन', 'दादी', 'शेर', 'मछली'], correctIndex: 2, explanation: 'शेर पुल्लिंग शब्द है (स्त्रीलिंग: शेरनी)।' },
            { question: '"अध्यापक" का स्त्रीलिंग शब्द चुनिए:', options: ['अध्यापिका', 'अध्यापकी', 'अध्यापनी', 'अध्यापिन'], correctIndex: 0, explanation: 'अध्यापक का स्त्रीलिंग अध्यापिका है।' },
            { question: '"नानी" का पुल्लिंग क्या है?', options: ['दादा', 'नाना', 'मामा', 'चाचा'], correctIndex: 1, explanation: 'नानी का पुल्लिंग नाना होता है।' },
            { question: 'सही वाक्य चुनिए:', options: ['गाय दूध देता है।', 'गाय दूध देती है।', 'लड़की खेलता है।', 'माता पढ़ता है।'], correctIndex: 1, explanation: 'गाय स्त्रीलिंग है, इसलिए क्रिया "देती है" होगी।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'सर्वनाम (संज्ञा के स्थान पर)',
          topics: ['मैं, तुम, वह, हम, वे', 'वाक्य में प्रयोग'],
          summary: 'संज्ञा की बार-बार आवृत्ति रोकने के लिए सर्वनाम शब्दों का प्रयोग करना सीखें।',
          objectives: ['सर्वनाम की परिभाषा जानना', 'उचित सर्वनाम चुनना'],
          studyNotes: [
            'संज्ञा के स्थान पर प्रयोग होने वाले शब्द सर्वनाम कहलाते हैं, जैसे—मैं, तुम, आप, वह, यह, हम, वे।'
          ],
          revisionPoints: ['नाम की जगह सर्वनाम', 'बड़ों के लिए "आप" प्रयोग करें'],
          practiceQuestions: [
            { question: 'सर्वनाम चुनिए: "वह बाजार गया।"', answer: 'वह।' },
            { question: 'बड़ों से बात करते समय किस सर्वनाम का प्रयोग करते हैं?', answer: 'आप।' }
          ],
          quizQuestions: [
            { question: 'संज्ञा के स्थान पर आने वाले शब्द क्या कहलाते हैं?', options: ['विशेषण', 'क्रिया', 'सर्वनाम', 'वचन'], correctIndex: 2, explanation: 'इन्हें सर्वनाम कहते हैं।' },
            { question: 'इनमें से कौन-सा सर्वनाम है?', options: ['आगरा', 'मेज', 'हम', 'मीठा'], correctIndex: 2, explanation: '"हम" एक सर्वनाम शब्द है।' },
            { question: 'रिक्त स्थान भरिए: "___ रोज़ स्कूल जाता हूँ।"', options: ['वह', 'मैं', 'वे', 'तुम'], correctIndex: 1, explanation: '"हूँ" के साथ "मैं" सर्वनाम आता है।' },
            { question: '"सीता गाती है। ___ मधुर गाती है।"', options: ['वह', 'हम', 'तुम', 'वे'], correctIndex: 0, explanation: 'एकवचन सीता के लिए "वह" आएगा।' },
            { question: 'बड़ों को आदर देने के लिए कौन-सा शब्द सही है?', options: ['तू', 'आप', 'वे', 'यह'], correctIndex: 1, explanation: 'आदर के लिए "आप" का उपयोग किया जाता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'विशेषण और क्रिया परिचय',
          topics: ['गुण-दोष बताने वाले शब्द', 'काम वाले शब्द (क्रिया)'],
          summary: 'संज्ञा की विशेषता बताने वाले विशेषण और किसी कार्य का बोध कराने वाली क्रिया की पहचान करें।',
          objectives: ['विशेषण और विशेष्य पहचानना', 'वाक्य में क्रिया शब्द ढूँढना'],
          studyNotes: [
            'विशेषण संज्ञा या सर्वनाम की विशेषता बताते हैं: मीठा आम, नीला आसमान, चार किताबें।',
            'जिन शब्दों से किसी काम के करने या होने का पता चले, उन्हें क्रिया कहते हैं: पढ़ना, लिखना, दौड़ना।'
          ],
          revisionPoints: ['कैसा/कितना = विशेषण', 'क्या काम हो रहा है = क्रिया'],
          practiceQuestions: [
            { question: '"हरा तोता" में विशेषण क्या है?', answer: 'हरा।' },
            { question: '"बच्चे खेल रहे हैं" में क्रिया बताइए।', answer: 'खेल रहे हैं।' }
          ],
          quizQuestions: [
            { question: '"मीठा आम" में विशेषण शब्द क्या है?', options: ['आम', 'मीठा', 'दोनों', 'कोई नहीं'], correctIndex: 1, explanation: 'मीठा आम के स्वाद की विशेषता बताता है।' },
            { question: 'इनमें से क्रिया शब्द कौन-सा है?', options: ['कमल', 'लिखना', 'ऊँचा', 'सुंदर'], correctIndex: 1, explanation: 'लिखना एक कार्य है।' },
            { question: '"काला बादल" में बादल क्या है?', options: ['क्रिया', 'सर्वनाम', 'संज्ञा', 'अव्यय'], correctIndex: 2, explanation: 'बादल संज्ञा है और काला उसका विशेषण।' },
            { question: '"मोहन तेज दौड़ता है।" इस वाक्य में क्रिया क्या है?', options: ['मोहन', 'तेज', 'दौड़ता है', 'कोई नहीं'], correctIndex: 2, explanation: 'दौड़ना कार्य है।' },
            { question: '"चार चिड़ियाँ" में किस प्रकार की विशेषता है?', options: ['रंग', 'संख्या', 'स्वाद', 'आकार'], correctIndex: 1, explanation: 'चार संख्या बताता है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(3, 'evs', 'Environmental Studies (EVS)', 'EVS', 'mint', 'Plants, animals, family, environment, water cycle, and food nutrition.', [
        {
          title: 'Plants: Our Green Friends',
          topics: ['Parts of a plant', 'Types of plants (Herbs, Shrubs, Trees, Climbers)', 'Importance of leaves'],
          summary: 'Explore roots, stems, leaves, flowers, and fruits, and classify plants into trees, shrubs, herbs, climbers, and creepers.',
          objectives: ['Describe root and shoot systems', 'Classify plants by stem type', 'Explain why leaves are called food factories'],
          studyNotes: [
            'Roots grow underground, hold the plant firmly, and absorb water and minerals from soil.',
            'Trees have thick woody trunks; shrubs are medium bushy plants (rose); herbs are small soft plants (mint).',
            'Green leaves contain chlorophyll and make food using sunlight, water, and air.'
          ],
          revisionPoints: ['Root absorbs water', 'Leaf = Kitchen of the plant', 'Climbers need support (money plant)'],
          hindiSummary: 'जड़ें मिट्टी से पानी सोखती हैं और हरी पत्तियाँ सूर्य के प्रकाश में पौधे का भोजन बनाती हैं।',
          practiceQuestions: [
            { question: 'Why are green leaves called the kitchen of a plant?', answer: 'Because they prepare food for the plant using sunlight, air, and water.' },
            { question: 'Give an example of a creeper.', answer: 'Pumpkin or watermelon.' }
          ],
          quizQuestions: [
            { question: 'Which part of the plant absorbs water from the soil?', options: ['Flower', 'Root', 'Leaf', 'Fruit'], correctIndex: 1, explanation: 'Roots anchor the plant and absorb water and minerals.' },
            { question: 'A rose plant with thin woody branches near the ground is a:', options: ['Tree', 'Shrub', 'Herb', 'Creeper'], correctIndex: 1, explanation: 'Bushes like rose and hibiscus are shrubs.' },
            { question: 'Which plant needs support to climb upwards?', options: ['Banyan', 'Money plant', 'Mint', 'Neem'], correctIndex: 1, explanation: 'Money plant has a weak stem and climbs with support.' },
            { question: 'Which part of a plant produces seeds?', options: ['Root', 'Stem', 'Fruit/Flower', 'Bark'], correctIndex: 2, explanation: 'Flowers develop into fruits which hold seeds.' },
            { question: 'What gives leaves their green color?', options: ['Water', 'Chlorophyll', 'Soil', 'Dust'], correctIndex: 1, explanation: 'Chlorophyll is the green pigment in leaves.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Animals & Their Habitats',
          topics: ['Herbivores, Carnivores, Omnivores', 'Beaks and claws of birds', 'Protecting wildlife'],
          summary: 'Classify animals by what they eat and where they live, and examine how birds use different beaks.',
          objectives: ['Distinguish plant-eaters, meat-eaters, and omnivores', 'Match bird beaks to food habits'],
          studyNotes: [
            'Herbivores eat only plants (cow, deer). Carnivores eat other animals (lion, eagle). Omnivores eat both plants and animals (bear, crow).',
            'Birds have different beaks: curved beak for cracking nuts (parrot), sharp hooked beak for tearing flesh (eagle).'
          ],
          revisionPoints: ['Herbivore = plants', 'Carnivore = meat', 'Omnivore = both'],
          practiceQuestions: [
            { question: 'What type of eater is a deer?', answer: 'Herbivore.' },
            { question: 'Why does a duck have webbed feet?', answer: 'To paddle and swim easily in water.' }
          ],
          quizQuestions: [
            { question: 'Which animal is a carnivore?', options: ['Goat', 'Rabbit', 'Lion', 'Elephant'], correctIndex: 2, explanation: 'Lions eat meat.' },
            { question: 'Animals that eat both plants and meat are called:', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Insects'], correctIndex: 2, explanation: 'Omnivores eat both plant and animal foods.' },
            { question: 'Which bird has a strong chisel-like beak to peck wood?', options: ['Duck', 'Woodpecker', 'Sparrow', 'Pelican'], correctIndex: 1, explanation: 'Woodpeckers bore into tree bark for insects.' },
            { question: 'An animal that lives both on land and in water is:', options: ['Frog', 'Shark', 'Camel', 'Horse'], correctIndex: 0, explanation: 'Frogs are amphibians living on land and in water.' },
            { question: 'Which animal stores fat in its hump for desert travel?', options: ['Polar bear', 'Camel', 'Penguin', 'Zebra'], correctIndex: 1, explanation: 'Camels are adapted to hot deserts.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Family, Environment & Clean Water',
          topics: ['Helping at home', 'Water cycle basics', 'Keeping air & surroundings clean'],
          summary: 'Understand how water evaporates, forms clouds, and falls as rain, and how we protect our shared environment.',
          objectives: ['Trace the basic water cycle', 'Reduce littering and save trees'],
          studyNotes: [
            'Sun heats water into water vapour (evaporation). Vapour cools high up to form clouds (condensation) and falls as rain (precipitation).',
            'Planting trees keeps the air fresh and provides shade and homes for birds.'
          ],
          revisionPoints: ['Evaporation -> Clouds -> Rain', 'Use dustbins for waste', 'Never pollute rivers'],
          practiceQuestions: [
            { question: 'What turns liquid water into vapour in nature?', answer: 'Heat from the Sun.' },
            { question: 'Why should we separate wet and dry garbage?', answer: 'So wet waste can become compost and dry waste can be recycled.' }
          ],
          quizQuestions: [
            { question: 'What happens when the sun heats water in ponds?', options: ['It freezes', 'It evaporates into vapour', 'It turns into rocks', 'It disappears forever'], correctIndex: 1, explanation: 'Heating turns liquid water into water vapour.' },
            { question: 'Clouds are formed when water vapour:', options: ['Cools down', 'Burns', 'Freezes into iron', 'Sinks underground'], correctIndex: 0, explanation: 'Cooling condenses vapour into tiny water droplets forming clouds.' },
            { question: 'Which practice keeps our environment clean?', options: ['Burning plastic', 'Throwing waste in dustbins', 'Cutting all trees', 'Wasting tap water'], correctIndex: 1, explanation: 'Using dustbins prevents litter and pollution.' },
            { question: 'Trees release which gas that humans need to breathe?', options: ['Smoke', 'Oxygen', 'Plastic', 'Dust'], correctIndex: 1, explanation: 'Green plants release oxygen during daytime.' },
            { question: 'Rainwater falling back onto Earth is called:', options: ['Melting', 'Precipitation', 'Boiling', 'Rusting'], correctIndex: 1, explanation: 'Rain, snow, and hail are forms of precipitation.' }
          ],
          diagramType: 'science-cycle'
        }
      ]),
      makeSubject(3, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Hardware vs software, file basics, and WordPad typing.', [
        {
          title: 'Hardware and Software',
          topics: ['Input, Process, Output (IPO) cycle', 'Physical hardware parts', 'Software programs'],
          summary: 'Discover the IPO cycle and learn the difference between hardware you can touch and software programs that run inside.',
          objectives: ['Explain Input-Process-Output cycle', 'Classify devices as Input, Output, or Storage'],
          studyNotes: [
            'Computers work on the IPO cycle: Input (Keyboard/Mouse) -> Process (CPU) -> Output (Monitor/Printer).',
            'Hardware means physical parts you can touch (Monitor, Keyboard). Software means instructions/apps (Paint, Browser).'
          ],
          revisionPoints: ['IPO = Input -> Process -> Output', 'Hardware = physical', 'Software = programs'],
          practiceQuestions: [
            { question: 'Give two examples of Input devices.', answer: 'Keyboard and Mouse (or Microphone/Scanner).' },
            { question: 'Is Paint hardware or software?', answer: 'Software.' }
          ],
          quizQuestions: [
            { question: 'In the IPO cycle, what does "P" stand for?', options: ['Print', 'Process', 'Power', 'Paint'], correctIndex: 1, explanation: 'IPO stands for Input, Process, Output.' },
            { question: 'Which device is an Output device?', options: ['Keyboard', 'Mouse', 'Printer', 'Scanner'], correctIndex: 2, explanation: 'A printer outputs text/images onto paper.' },
            { question: 'Which is an example of Software?', options: ['Monitor', 'CPU cabinet', 'Calculator app', 'USB cable'], correctIndex: 2, explanation: 'Apps and programs are software.' },
            { question: 'Which part performs Processing?', options: ['CPU', 'Mouse', 'Speaker', 'Monitor'], correctIndex: 0, explanation: 'The CPU processes input data.' },
            { question: 'Hardware can be:', options: ['Only heard', 'Touched and seen physically', 'Never seen', 'Only typed'], correctIndex: 1, explanation: 'Hardware consists of physical components.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Introduction to Windows & Files',
          topics: ['Desktop, Icons, Taskbar', 'Files vs Folders', 'Minimizing and closing windows'],
          summary: 'Navigate the computer desktop, organize documents inside folders, and control application windows.',
          objectives: ['Identify Desktop, Taskbar, and Start menu', 'Create and name folders neatly'],
          studyNotes: [
            'The first screen after turning on a computer is the Desktop. Small pictures on it are Icons.',
            'A File stores one document or picture; a Folder holds many files together neatly.'
          ],
          revisionPoints: ['Taskbar sits at bottom', 'Folder organizes files', 'X button closes a window'],
          practiceQuestions: [
            { question: 'Where do you see open apps and the clock on Desktop?', answer: 'On the Taskbar.' },
            { question: 'Why do we use folders?', answer: 'To group related files together so they are easy to find.' }
          ],
          quizQuestions: [
            { question: 'What are the small labeled pictures on the Desktop called?', options: ['Windows', 'Icons', 'Wallpapers', 'Keys'], correctIndex: 1, explanation: 'Icons represent apps, files, or folders.' },
            { question: 'Which container holds multiple files together?', options: ['Mouse', 'Folder', 'Cursor', 'Spacebar'], correctIndex: 1, explanation: 'Folders organize multiple files.' },
            { question: 'Which button closes an open window?', options: ['_', '□', 'X', '+'], correctIndex: 2, explanation: 'The X button at the top corner closes the window.' },
            { question: 'Where is the Start button normally located?', options: ['Taskbar', 'Monitor stand', 'Keyboard', 'Printer'], correctIndex: 0, explanation: 'The Start button is on the taskbar.' },
            { question: 'The background picture on the desktop is called:', options: ['Icon', 'Wallpaper', 'File', 'Folder'], correctIndex: 1, explanation: 'Desktop background image is the wallpaper.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Typing & Formatting in WordPad',
          topics: ['Bold, Italic, Underline', 'Font size & color', 'Saving documents'],
          summary: 'Write short stories in a text editor and style headings using Bold, Italic, Underline, and font colors.',
          objectives: ['Format text with B, I, U buttons', 'Change font size and alignment'],
          studyNotes: [
            'Select text first before clicking Bold (B), Italic (I), or Underline (U).',
            'Font size makes letters bigger for headings or smaller for paragraphs.'
          ],
          revisionPoints: ['B = Bold (thick)', 'I = Italic (slanted)', 'U = Underline'],
          practiceQuestions: [
            { question: 'What must you do before changing the color of typed text?', answer: 'Select (highlight) the text first.' },
            { question: 'Which shortcut makes selected text Bold?', answer: 'Ctrl + B.' }
          ],
          quizQuestions: [
            { question: 'Which style makes letters appear thicker and darker?', options: ['Italic', 'Bold', 'Underline', 'Cut'], correctIndex: 1, explanation: 'Bold increases stroke thickness for emphasis.' },
            { question: 'Which style slants the text slightly to the right?', options: ['Bold', 'Italic', 'Underline', 'Align'], correctIndex: 1, explanation: 'Italic slants letters.' },
            { question: 'What does the "U" button do?', options: ['Makes text upper-case', 'Draws a line below text', 'Undoes typing', 'Changes color'], correctIndex: 1, explanation: 'U stands for Underline.' },
            { question: 'To change font size of a heading, first:', options: ['Delete it', 'Select the heading text', 'Turn off monitor', 'Print it'], correctIndex: 1, explanation: 'Formatting applies to selected text.' },
            { question: 'Which alignment centers a title on the page?', options: ['Left Align', 'Center Align', 'Right Align', 'Erase'], correctIndex: 1, explanation: 'Center alignment places text in the middle.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 4 ====================
  {
    classNumber: 4,
    label: 'Class 4',
    stage: 'Primary (Classes 1–5)',
    subjects: [
      makeSubject(4, 'math', 'Mathematics', 'Mathematics', 'blue', 'Large numbers, factors & multiples, fractions, perimeter, and metric conversions.', [
        {
          title: 'Large Numbers & Roman Numerals',
          topics: ['5-digit and 6-digit numbers', 'Indian place value chart', 'Rounding numbers', 'Roman numerals I to L'],
          summary: 'Read and write 5-digit and 6-digit numbers in the Indian system and learn Roman numeral symbols.',
          objectives: ['Use commas in Indian place value system', 'Read Roman numerals I, V, X, L'],
          studyNotes: [
            'In the Indian Place Value System, commas are placed after 3 digits from the right, then every 2 digits (e.g., 1,24,560).',
            'Roman numerals: I = 1, V = 5, X = 10, L = 50. A smaller numeral before a larger one subtracts (IV = 4, IX = 9).'
          ],
          revisionPoints: ['1 Lakh = 1,00,000', 'IV = 4, VI = 6, IX = 9, XL = 40', 'Never repeat a Roman symbol more than 3 times'],
          practiceQuestions: [
            { question: 'Write 29 in Roman numerals.', answer: 'XXIX (10 + 10 + 9).' },
            { question: 'How many thousands make 1 Lakh?', answer: '100 thousands make 1 Lakh.' }
          ],
          quizQuestions: [
            { question: 'What is the value of Roman numeral XXIV?', options: ['14', '24', '26', '16'], correctIndex: 1, explanation: 'XX = 20 and IV = 4, so 24.' },
            { question: 'How is 1 Lakh written in digits?', options: ['10,000', '1,00,000', '10,00,000', '1,000'], correctIndex: 1, explanation: 'One followed by five zeroes is 1,00,000.' },
            { question: 'Which Roman numeral represents 40?', options: ['XXXX', 'XL', 'LX', 'VX'], correctIndex: 1, explanation: 'XL = 50 − 10 = 40.' },
            { question: 'Round 468 to the nearest hundred:', options: ['400', '460', '500', '470'], correctIndex: 2, explanation: 'Since 68 >= 50, 468 rounds up to 500.' },
            { question: 'What is the successor of 99,999?', options: ['99,998', '1,00,000', '10,000', '99,900'], correctIndex: 1, explanation: '99,999 + 1 = 1,00,000.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Factors, Multiples & Fractions',
          topics: ['Finding factors', 'Multiples of a number', 'Like and unlike fractions', 'Equivalent fractions'],
          summary: 'Understand factors and multiples, and compare and add simple fractions.',
          objectives: ['List all factors of a number', 'Identify numerator and denominator', 'Add like fractions'],
          studyNotes: [
            'Factors divide a number exactly without remainder (Factors of 12: 1, 2, 3, 4, 6, 12). 1 is a factor of every number.',
            'In fraction 3/5, 3 is the Numerator (parts taken) and 5 is the Denominator (total equal parts).'
          ],
          revisionPoints: ['Smallest factor = 1', 'Multiples are endless', 'Like fractions share same denominator'],
          practiceQuestions: [
            { question: 'List the first four multiples of 6.', answer: '6, 12, 18, 24.' },
            { question: 'Add 2/7 + 3/7.', answer: '5/7.' }
          ],
          quizQuestions: [
            { question: 'Which number is a factor of EVERY number?', options: ['0', '1', '2', '10'], correctIndex: 1, explanation: 'Every number is divisible by 1.' },
            { question: 'In the fraction 5/8, what is 8 called?', options: ['Numerator', 'Denominator', 'Whole', 'Factor'], correctIndex: 1, explanation: 'The bottom number is the denominator.' },
            { question: 'What is 1/4 + 2/4?', options: ['3/8', '3/4', '2/4', '1/2'], correctIndex: 1, explanation: 'Add numerators when denominators match: (1+2)/4 = 3/4.' },
            { question: 'Which fraction is equivalent to 1/2?', options: ['2/3', '3/6', '2/5', '4/6'], correctIndex: 1, explanation: '3/6 simplifies to 1/2.' },
            { question: 'Which is a multiple of 7?', options: ['24', '28', '32', '40'], correctIndex: 1, explanation: '7 × 4 = 28.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Perimeter, Area & Symmetry',
          topics: ['Boundary length (Perimeter)', 'Surface covered (Area)', 'Lines of symmetry', 'Circle radius & diameter'],
          summary: 'Measure the perimeter of polygons, count square units for area, and discover mirror symmetry.',
          objectives: ['Compute perimeter of rectangles and triangles', 'Understand Diameter = 2 × Radius', 'Spot lines of symmetry'],
          studyNotes: [
            'Perimeter is the total distance around the boundary of a closed shape. Perimeter of rectangle = 2 × (length + breadth).',
            'Diameter of a circle passes through the center and equals twice the radius (D = 2 × r).'
          ],
          revisionPoints: ['Perimeter of square = 4 × side', 'Diameter = 2 × Radius', 'Symmetry = equal halves on folding'],
          practiceQuestions: [
            { question: 'Find the perimeter of a square of side 7 cm.', answer: '4 × 7 = 28 cm.' },
            { question: 'If radius of a circle is 5 cm, what is its diameter?', answer: '2 × 5 = 10 cm.' }
          ],
          quizQuestions: [
            { question: 'What is the perimeter of a triangle with sides 4 cm, 5 cm, and 6 cm?', options: ['12 cm', '15 cm', '20 cm', '24 cm'], correctIndex: 1, explanation: '4 + 5 + 6 = 15 cm.' },
            { question: 'If the diameter of a circle is 14 cm, what is its radius?', options: ['7 cm', '28 cm', '14 cm', '10 cm'], correctIndex: 0, explanation: 'Radius = Diameter ÷ 2 = 7 cm.' },
            { question: 'How many lines of symmetry does a square have?', options: ['1', '2', '4', '0'], correctIndex: 2, explanation: 'A square has vertical, horizontal, and 2 diagonal symmetry lines (4 total).' },
            { question: 'Perimeter of a rectangle of length 8 m and breadth 4 m is:', options: ['12 m', '24 m', '32 m', '16 m'], correctIndex: 1, explanation: '2 × (8 + 4) = 24 m.' },
            { question: 'What is the perimeter of a square whose side is 9 cm?', options: ['18 cm', '27 cm', '36 cm', '81 cm'], correctIndex: 2, explanation: '4 × 9 = 36 cm.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(4, 'english', 'English', 'Languages', 'lavender', 'Kinds of sentences, continuous tenses, adverbs, conjunctions, and letter writing.', [
        {
          title: 'Adverbs & Conjunctions',
          topics: ['Adverbs of manner, time, place', 'Joining words (and, but, because, or)'],
          summary: 'Enrich sentences with adverbs showing how, when, or where actions happen, and join ideas using conjunctions.',
          objectives: ['Form -ly adverbs from adjectives', 'Choose and/but/because/or accurately'],
          studyNotes: [
            'Adverbs describe verbs: "She sang sweetly" (how), "Come here" (where), "We will leave tomorrow" (when).',
            'Conjunctions join words or clauses: "and" adds ideas, "but" shows contrast, "because" gives reason, "or" shows choice.'
          ],
          revisionPoints: ['Adverb modifies a verb', 'but = contrast', 'because = reason'],
          practiceQuestions: [
            { question: 'Join with a conjunction: "I carried an umbrella. It was raining."', answer: 'I carried an umbrella because it was raining.' },
            { question: 'Identify the adverb: "The tortoise walked slowly."', answer: 'slowly.' }
          ],
          quizQuestions: [
            { question: 'Which word is an adverb in "Riya wrote neatly"?', options: ['Riya', 'wrote', 'neatly', 'none'], correctIndex: 2, explanation: 'Neatly tells how Riya wrote.' },
            { question: 'Fill in: "He ran fast, ___ he missed the bus."', options: ['and', 'but', 'because', 'or'], correctIndex: 1, explanation: '"but" connects two contrasting ideas.' },
            { question: 'Fill in: "Would you like tea ___ milk?"', options: ['but', 'or', 'because', 'so'], correctIndex: 1, explanation: '"or" presents a choice.' },
            { question: 'Which adverb tells "when"?', options: ['Slowly', 'Upstairs', 'Yesterday', 'Loudly'], correctIndex: 2, explanation: 'Yesterday indicates time.' },
            { question: 'Change the adjective "quiet" into an adverb:', options: ['quieter', 'quietly', 'quietness', 'quiets'], correctIndex: 1, explanation: 'Adding -ly gives quietly.' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Continuous Tenses & Subject-Verb Agreement',
          topics: ['Present continuous (is/am/are + -ing)', 'Past continuous (was/were + -ing)', 'Singular/plural agreement'],
          summary: 'Describe ongoing actions in the present and past, and match subjects with the right verb forms.',
          objectives: ['Use is/am/are + -ing', 'Use was/were + -ing'],
          studyNotes: [
            'Present Continuous describes what is happening right now: "They are painting a mural."',
            'Past Continuous describes an ongoing past action: "She was reading when the bell rang."'
          ],
          revisionPoints: ['Now = is/am/are + -ing', 'Past ongoing = was/were + -ing'],
          practiceQuestions: [
            { question: 'Fill in: "The children ___ (play) in the park now."', answer: 'are playing.' },
            { question: 'Fill in: "He ___ (sleep) at 9 PM last night."', answer: 'was sleeping.' }
          ],
          quizQuestions: [
            { question: 'Choose the right form: "Look! The birds ___ flying south."', options: ['is', 'am', 'are', 'was'], correctIndex: 2, explanation: 'Plural subject "birds" uses "are".' },
            { question: 'Which sentence is in Past Continuous tense?', options: ['I am eating.', 'I was eating.', 'I eat.', 'I will eat.'], correctIndex: 1, explanation: '"was + -ing" shows an ongoing past action.' },
            { question: 'Fill in: "Meera and I ___ working on a project."', options: ['is', 'am', 'are', 'was'], correctIndex: 2, explanation: 'Compound subject "Meera and I" is plural -> are.' },
            { question: 'What is the -ing form of "run"?', options: ['runing', 'running', 'ranned', 'runs'], correctIndex: 1, explanation: 'Double the final n: running.' },
            { question: 'Fill in: "Yesterday evening, they ___ watching stars."', options: ['was', 'were', 'are', 'is'], correctIndex: 1, explanation: '"They" in past continuous uses "were".' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Degrees of Comparison & Informal Letter',
          topics: ['Positive, Comparative, Superlative', '-er / -est and more / most', 'Parts of an informal letter'],
          summary: 'Compare two or more things using comparative and superlative adjectives, and format a friendly letter.',
          objectives: ['Use -er/-est correctly', 'List parts of an informal letter (Date, Salutation, Body, Sign-off)'],
          studyNotes: [
            'Positive: tall. Comparative (comparing 2): taller (use "than"). Superlative (3 or more): tallest (use "the").',
            'Longer adjectives use "more" and "most": beautiful, more beautiful, most beautiful.'
          ],
          revisionPoints: ['Comparative -> than', 'Superlative -> the', 'good -> better -> best'],
          practiceQuestions: [
            { question: 'Fill in: "Mount Everest is the ___ peak in the world."', answer: 'highest.' },
            { question: 'What is the comparative form of "good"?', answer: 'better.' }
          ],
          quizQuestions: [
            { question: 'Fill in: "A cheetah is ___ than a deer."', options: ['fast', 'faster', 'fastest', 'more fast'], correctIndex: 1, explanation: 'Comparing two animals uses the comparative "faster".' },
            { question: 'What is the superlative form of "good"?', options: ['gooder', 'goodest', 'better', 'best'], correctIndex: 3, explanation: 'Good, better, best.' },
            { question: 'Which word comes before a superlative adjective?', options: ['a', 'an', 'the', 'than'], correctIndex: 2, explanation: 'We write "the tallest", "the smartest".' },
            { question: 'Choose the correct form: "This puzzle is ___ difficult than that one."', options: ['more', 'most', 'very', 'much'], correctIndex: 0, explanation: 'Long adjectives take "more" in comparative.' },
            { question: 'Which comes first in an informal letter?', options: ['Signature', 'Sender’s address & date', 'Closing', 'PS'], correctIndex: 1, explanation: 'An informal letter begins with address and date at the top.' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(4, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'काल, मुहावरे, विराम चिह्न और अनुच्छेद लेखन।', [
        {
          title: 'काल (वर्तमान, भूत, भविष्य)',
          topics: ['काल के तीन भेद', 'वाक्य परिवर्तन'],
          summary: 'क्रिया के होने के समय—वर्तमान, भूत और भविष्य काल—को पहचानें और वाक्य बदलें।',
          objectives: ['तीनों कालों की पहचान करना', 'एक काल से दूसरे काल में बदलना'],
          studyNotes: [
            'वर्तमान काल: काम अभी हो रहा है (गीता पढ़ती है)। भूतकाल: काम बीत चुका (गीता ने पढ़ा)। भविष्यत् काल: काम आगे होगा (गीता पढ़ेगी)।'
          ],
          revisionPoints: ['है/हैं = वर्तमान', 'था/थे/थी = भूत', 'गा/गे/गी = भविष्य'],
          practiceQuestions: [
            { question: '"कल बारिश हुई थी।" किस काल का वाक्य है?', answer: 'भूतकाल।' },
            { question: '"मैं कल दिल्ली जाऊँगा।" किस काल में है?', answer: 'भविष्यत् काल।' }
          ],
          quizQuestions: [
            { question: 'काल के कितने मुख्य भेद होते हैं?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'वर्तमान, भूत और भविष्यत्—तीन काल होते हैं।' },
            { question: '"बच्चे मैदान में खेल रहे हैं।" यह किस काल का वाक्य है?', options: ['भूतकाल', 'वर्तमान काल', 'भविष्यत् काल', 'कोई नहीं'], correctIndex: 1, explanation: '"रहे हैं" अभी चल रहे समय को बताता है।' },
            { question: '"हम अगले महीने गाँव जाएँगे।" यह वाक्य है:', options: ['भूतकाल', 'वर्तमान काल', 'भविष्यत् काल', 'अनिश्चित'], correctIndex: 2, explanation: '"जाएँगे" आने वाले समय को दर्शाता है।' },
            { question: '"रोहन ने कल चित्र बनाया।" इसका काल बताइए:', options: ['वर्तमान', 'भूतकाल', 'भविष्यत्', 'कोई नहीं'], correctIndex: 1, explanation: 'काम कल पूरा हो चुका है, अतः भूतकाल।' },
            { question: '"वह गाना गाती है" का भविष्यत् रूप होगा:', options: ['वह गाना गा रही थी।', 'वह गाना गाएगी।', 'उसने गाना गाया।', 'वह गाती थी।'], correctIndex: 1, explanation: 'भविष्य के लिए "गाएगी" प्रयोग होगा।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'सरल मुहावरे और उनका प्रयोग',
          topics: ['मुहावरे का अर्थ', 'वाक्य में प्रयोग'],
          summary: 'आँखों का तारा, ईद का चाँद, नाक में दम करना जैसे प्रसिद्ध मुहावरों के अर्थ और प्रयोग सीखें।',
          objectives: ['लोकप्रिय मुहावरों का अर्थ बताना', 'वाक्यों को रोचक बनाना'],
          studyNotes: [
            'मुहावरा भाषा को सुंदर और प्रभावशाली बनाता है: "आँखों का तारा" = बहुत प्यारा; "नौ दो ग्यारह होना" = भाग जाना।'
          ],
          revisionPoints: ['आँखों का तारा = बहुत प्यारा', 'नौ दो ग्यारह = भाग जाना', 'ईद का चाँद = बहुत दिनों बाद दिखना'],
          practiceQuestions: [
            { question: '"पेट में चूहे कूदना" मुहावरे का अर्थ क्या है?', answer: 'बहुत तेज भूख लगना।' },
            { question: '"आँखों का तारा" का वाक्य बनाइए।', answer: 'रोहन अपने माता-पिता की आँखों का तारा है।' }
          ],
          quizQuestions: [
            { question: '"नौ दो ग्यारह होना" का क्या अर्थ है?', options: ['गिनती करना', 'भाग जाना', 'सो जाना', 'हँसना'], correctIndex: 1, explanation: 'पुलिस को देखकर चोर नौ दो ग्यारह हो गया अर्थात भाग गया।' },
            { question: '"आँखों का तारा" मुहावरे का अर्थ है:', options: ['रोशनी', 'बहुत प्यारा', 'गुस्सा होना', 'बीमार होना'], correctIndex: 1, explanation: 'इसका अर्थ अत्यंत प्रिय होना है।' },
            { question: 'बहुत दिनों बाद दिखाई देने पर कौन-सा मुहावरा कहते हैं?', options: ['ईद का चाँद होना', 'हाथ बटाना', 'कान भरना', 'कमर कसना'], correctIndex: 0, explanation: 'ईद का चाँद कभी-कभी दिखाई देता है।' },
            { question: '"कमर कसना" का सही अर्थ है:', options: ['थक जाना', 'तैयार होना', 'बैठ जाना', 'भूल जाना'], correctIndex: 1, explanation: 'परीक्षा के लिए कमर कसना अर्थात पूरी तरह तैयार होना।' },
            { question: '"हाथ बटाना" का अर्थ क्या है?', options: ['झगड़ना', 'मदद करना', 'चोरी करना', 'भागना'], correctIndex: 1, explanation: 'काम में सहायता करना।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'पर्यायवाची और अनेक शब्दों के लिए एक शब्द',
          topics: ['समानार्थक शब्द', 'वाक्यांश के लिए एक शब्द'],
          summary: 'अपनी अभिव्यक्ति को संक्षिप्त और प्रभावशाली बनाने के लिए अनेक शब्दों के स्थान पर एक शब्द का प्रयोग सीखें।',
          objectives: ['वाक्यांशों के लिए एक शब्द याद करना', 'समानार्थी शब्दों का सही प्रयोग'],
          studyNotes: [
            'जो चित्र बनाता हो = चित्रकार। जो खेती करता हो = किसान। जो प्रतिदिन हो = दैनिक। जो पढ़ा-लिखा हो = शिक्षित।'
          ],
          revisionPoints: ['जल = नीर, पानी', 'पेड़ = वृक्ष, तरु', 'चित्र बनाने वाला = चित्रकार'],
          practiceQuestions: [
            { question: 'जो लकड़ी का सामान बनाता है उसे क्या कहते हैं?', answer: 'बढ़ई।' },
            { question: '"आकाश" के दो पर्यायवाची लिखिए।', answer: 'गगन, नभ।' }
          ],
          quizQuestions: [
            { question: 'जो खेती करता है, उसे क्या कहते हैं?', options: ['माली', 'किसान', 'दर्जी', 'सैनिक'], correctIndex: 1, explanation: 'अन्न उगाने वाले को किसान कहते हैं।' },
            { question: 'जो प्रतिदिन होता हो, उसके लिए एक शब्द है:', options: ['साप्ताहिक', 'मासिक', 'दैनिक', 'वार्षिक'], correctIndex: 2, explanation: 'हर दिन होने वाला = दैनिक।' },
            { question: '"पृथ्वी" का पर्यायवाची शब्द कौन-सा है?', options: ['गगन', 'धरती', 'पवन', 'अग्नि'], correctIndex: 1, explanation: 'पृथ्वी, धरती और भू समानार्थक हैं।' },
            { question: 'जो रोगियों का इलाज करता है:', options: ['चिकित्सक', 'अध्यापक', 'लेखक', 'चालक'], correctIndex: 0, explanation: 'इलाज करने वाले को चिकित्सक (डॉक्टर) कहते हैं।' },
            { question: '"हवा" का पर्यायवाची नहीं है:', options: ['वायु', 'पवन', 'समीर', 'सलिल'], correctIndex: 3, explanation: 'सलिल पानी का पर्यायवाची है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(4, 'evs', 'Environmental Studies (EVS)', 'EVS', 'mint', 'Animal adaptations, food & digestion, community living, and Indian rivers.', [
        {
          title: 'Roots, Flowers & Farming Journey',
          topics: ['Taproot vs fibrous root', 'Parts of a flower', 'From farm to plate'],
          summary: 'Examine taproots and fibrous roots, discover how flowers turn into seeds, and trace how food travels from fields to our home.',
          objectives: ['Distinguish taproot and fibrous root', 'Identify steps of farming'],
          studyNotes: [
            'Taproot has one thick main root (carrot, mango); fibrous root has a bunch of thin roots (grass, wheat).',
            'Farmers plough soil, sow seeds, water crops, protect from weeds, harvest, and pack grains for mandis.'
          ],
          revisionPoints: ['Taproot = carrot, radish', 'Fibrous = grass, onion', 'Sepals protect bud; petals attract insects'],
          practiceQuestions: [
            { question: 'Name two edible roots we eat.', answer: 'Carrot and radish (or beetroot).' },
            { question: 'Why are flowers brightly colored?', answer: 'To attract bees and butterflies for pollination.' }
          ],
          quizQuestions: [
            { question: 'Which plant has a taproot?', options: ['Grass', 'Wheat', 'Carrot', 'Rice'], correctIndex: 2, explanation: 'Carrot is a thick central taproot.' },
            { question: 'Which part of the flower attracts bees and butterflies?', options: ['Root', 'Petals', 'Stem', 'Thorn'], correctIndex: 1, explanation: 'Colorful petals and scent attract pollinators.' },
            { question: 'What is the process of loosening soil before sowing seeds called?', options: ['Harvesting', 'Ploughing', 'Winnowing', 'Storing'], correctIndex: 1, explanation: 'Ploughing turns and softens the soil.' },
            { question: 'Spices like turmeric and cloves come from:', options: ['Animals', 'Plants', 'Rocks', 'Plastic'], correctIndex: 1, explanation: 'Spices are dried plant parts (roots, buds, seeds, bark).' },
            { question: 'Cutting ripe crops from the field is called:', options: ['Irrigation', 'Sowing', 'Harvesting', 'Weeding'], correctIndex: 2, explanation: 'Harvesting gathers mature crops.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Teeth, Digestion & Clean Water',
          topics: ['Milk teeth vs permanent teeth', 'Types of teeth', 'Water purification'],
          summary: 'Learn the four types of teeth, how food is digested, and simple ways to purify water at home.',
          objectives: ['Identify incisors, canines, premolars, molars', 'Explain boiling and filtration'],
          studyNotes: [
            'Adults have 32 permanent teeth: Incisors (cutting), Canines (tearing), Premolars & Molars (crushing and grinding).',
            'Boiling water for 10–15 minutes kills harmful germs.'
          ],
          revisionPoints: ['20 milk teeth, 32 permanent teeth', 'Incisors = cut, Molars = grind', 'ORS prevents dehydration'],
          practiceQuestions: [
            { question: 'How many permanent teeth does an adult have?', answer: '32 permanent teeth.' },
            { question: 'What does ORS stand for?', answer: 'Oral Rehydration Solution.' }
          ],
          quizQuestions: [
            { question: 'Which teeth are used for biting and cutting food?', options: ['Molars', 'Incisors', 'Premolars', 'Wisdom'], correctIndex: 1, explanation: 'Front flat incisors cut food.' },
            { question: 'Sharp pointed teeth next to incisors are:', options: ['Canines', 'Molars', 'Incisors', 'Gums'], correctIndex: 0, explanation: 'Canines tear food.' },
            { question: 'How many milk teeth does a young child usually have?', options: ['12', '20', '28', '32'], correctIndex: 1, explanation: 'Children grow 20 milk teeth.' },
            { question: 'Which method kills disease germs in drinking water?', options: ['Adding sand', 'Boiling', 'Stirring with spoon', 'Cooling only'], correctIndex: 1, explanation: 'Boiling kills microbes and bacteria.' },
            { question: 'Which organ churns food with digestive juices?', options: ['Lungs', 'Stomach', 'Heart', 'Kidney'], correctIndex: 1, explanation: 'The stomach breaks down food chemically and mechanically.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Homes, Bridges & Map Directions',
          topics: ['Stilt houses, igloos, houseboats', 'Compass directions', 'Reading simple maps'],
          summary: 'Explore why houses look different in mountains, snow, and flood zones, and learn to read map directions.',
          objectives: ['Match house types to climate', 'Use N, S, E, W directions on a map'],
          studyNotes: [
            'In Assam (heavy rain), houses are built on bamboo stilts. In Kashmir, houseboats float on Dal Lake. Igloos are built of snow blocks in freezing regions.',
            'On a map, North is always at the top, South at the bottom, East on the right, and West on the left.'
          ],
          revisionPoints: ['Sloping roofs shed snow/rain', 'Top of map = North', 'Compass needle points North'],
          practiceQuestions: [
            { question: 'Why do hill houses have sloping roofs?', answer: 'So rain and snow slide off easily without damaging the roof.' },
            { question: 'If you face East, which direction is to your back?', answer: 'West.' }
          ],
          quizQuestions: [
            { question: 'Houses built on bamboo pillars in rainy areas are called:', options: ['Igloos', 'Stilt houses', 'Tents', 'Bungalows'], correctIndex: 1, explanation: 'Stilts keep the floor above floodwater.' },
            { question: 'On a map, which direction is usually at the top?', options: ['South', 'East', 'North', 'West'], correctIndex: 2, explanation: 'North is standard at the top of maps.' },
            { question: 'Which instrument helps sailors and hikers find North?', options: ['Thermometer', 'Magnetic Compass', 'Ruler', 'Clock'], correctIndex: 1, explanation: 'A compass needle aligns with Earth’s magnetic North.' },
            { question: 'A floating wooden house on a lake in Kashmir is a:', options: ['Caravan', 'Houseboat', 'Igloo', 'Hut'], correctIndex: 1, explanation: 'Houseboats (shikaras/boats) float on lakes.' },
            { question: 'Why do desert houses have thick mud walls?', options: ['To look shiny', 'To keep the inside cool', 'To collect rain', 'To float on sand'], correctIndex: 1, explanation: 'Thick mud walls insulate against intense desert heat.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(4, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Memory & storage units, MS Word editing, and Scratch block coding.', [
        {
          title: 'Computer Memory & Storage Devices',
          topics: ['RAM vs ROM', 'Hard disk, Pen drive, Cloud', 'Bits and Bytes'],
          summary: 'Understand how computers remember data temporarily in RAM and store files permanently on drives and cloud storage.',
          objectives: ['Distinguish primary vs secondary memory', 'Rank KB, MB, GB'],
          studyNotes: [
            'Primary memory: RAM (temporary working memory, erased when power goes off) and ROM (permanent startup instructions).',
            'Secondary storage: Hard Disk, SSD, Pen Drive. 1 Byte = 8 Bits; 1024 KB = 1 MB; 1024 MB = 1 GB.'
          ],
          revisionPoints: ['1 Byte = 8 Bits', 'RAM = temporary, HDD/SSD = permanent', '1 GB > 1 MB > 1 KB'],
          practiceQuestions: [
            { question: 'Which memory loses data when electricity turns off?', answer: 'RAM (Random Access Memory).' },
            { question: 'Which is larger: 1 GB or 500 MB?', answer: '1 GB (1024 MB).' }
          ],
          quizQuestions: [
            { question: 'How many bits make 1 Byte?', options: ['4', '8', '16', '32'], correctIndex: 1, explanation: '1 Byte equals 8 bits.' },
            { question: 'Which memory is volatile (clears when power is off)?', options: ['ROM', 'RAM', 'Hard Disk', 'Pen Drive'], correctIndex: 1, explanation: 'RAM requires power to retain data.' },
            { question: 'Which portable device plugs into a USB port?', options: ['Monitor', 'Pen Drive', 'RAM stick', 'Motherboard'], correctIndex: 1, explanation: 'USB flash drives plug into USB ports.' },
            { question: 'Arrange from smallest to largest:', options: ['GB, MB, KB', 'KB, MB, GB', 'MB, KB, GB', 'Byte, GB, KB'], correctIndex: 1, explanation: 'Kilobyte < Megabyte < Gigabyte.' },
            { question: 'Which stores startup instructions permanently?', options: ['RAM', 'ROM', 'Clipboard', 'Cache'], correctIndex: 1, explanation: 'ROM (Read Only Memory) retains firmware.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Cut, Copy, Paste & Spell Check',
          topics: ['Clipboard operations', 'Undo & Redo', 'Spelling & grammar check'],
          summary: 'Edit documents efficiently using Cut, Copy, Paste, Undo/Redo, and automatic spell check.',
          objectives: ['Use Ctrl+C, Ctrl+X, Ctrl+V', 'Fix mistakes with Undo (Ctrl+Z)'],
          studyNotes: [
            'Copy (Ctrl+C) duplicates text while keeping the original. Cut (Ctrl+X) moves text from its original place.',
            'Paste (Ctrl+V) places copied or cut content at the cursor. Undo (Ctrl+Z) reverses the last action.'
          ],
          revisionPoints: ['Ctrl+C = Copy', 'Ctrl+X = Cut', 'Ctrl+V = Paste', 'Ctrl+Z = Undo'],
          practiceQuestions: [
            { question: 'What is the difference between Copy and Cut?', answer: 'Copy keeps the original in place; Cut removes the original so it can be moved.' },
            { question: 'What does a red wavy line under a word mean?', answer: 'A possible spelling error.' }
          ],
          quizQuestions: [
            { question: 'Which keyboard shortcut copies selected text?', options: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'], correctIndex: 1, explanation: 'Ctrl + C copies to clipboard.' },
            { question: 'Which shortcut pastes copied text?', options: ['Ctrl + P', 'Ctrl + V', 'Ctrl + C', 'Ctrl + S'], correctIndex: 1, explanation: 'Ctrl + V pastes from clipboard.' },
            { question: 'What does Ctrl + Z do?', options: ['Zoom in', 'Undo last action', 'Close app', 'Print page'], correctIndex: 1, explanation: 'Ctrl + Z undoes the previous edit.' },
            { question: 'To move a paragraph to another page, use:', options: ['Copy and Delete', 'Cut and Paste', 'Bold and Italic', 'Save and Print'], correctIndex: 1, explanation: 'Cut removes and Paste inserts.' },
            { question: 'A red squiggly line under a typed word indicates:', options: ['Bold style', 'Spelling mistake', 'Hyperlink', 'Page break'], correctIndex: 1, explanation: 'Word processors mark spelling issues with red wavy underlines.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Visual Block Coding (Scratch Basics)',
          topics: ['Sprites and Stage', 'Motion and Looks blocks', 'Events (When Green Flag clicked)'],
          summary: 'Build simple animations and interactive stories by snapping colorful Motion, Looks, and Event blocks together.',
          objectives: ['Identify Sprite, Stage, and Blocks palette', 'Create a sequence of movement blocks'],
          studyNotes: [
            'In block coding like Scratch, characters are called Sprites and the background area is the Stage.',
            'Scripts usually start with an Event block such as "When Green Flag clicked", followed by Motion blocks like "move 10 steps".'
          ],
          revisionPoints: ['Sprite = character', 'Stage = backdrop area', 'Green Flag = start script'],
          practiceQuestions: [
            { question: 'What is a Sprite?', answer: 'An object or character that performs actions on the stage.' },
            { question: 'Which category of blocks moves a sprite?', answer: 'Motion blocks (blue).' }
          ],
          quizQuestions: [
            { question: 'What is the character in Scratch called?', options: ['Stage', 'Sprite', 'Costume', 'Icon'], correctIndex: 1, explanation: 'Sprites are the programmable characters/objects.' },
            { question: 'Where do sprites perform their actions?', options: ['Palette', 'Stage', 'Taskbar', 'Folder'], correctIndex: 1, explanation: 'The Stage is the canvas where sprites move.' },
            { question: 'Which button normally starts a Scratch project?', options: ['Red Stop sign', 'Green Flag', 'Spacebar only', 'Power button'], correctIndex: 1, explanation: 'Clicking the Green Flag runs scripts attached to it.' },
            { question: 'Which block changes what a sprite says in a speech bubble?', options: ['Move 10 steps', 'Say "Hello!"', 'Turn 15 degrees', 'Wait 1 second'], correctIndex: 1, explanation: 'Looks blocks like Say display speech bubbles.' },
            { question: 'Snapping blocks in order to solve a task is called:', options: ['Painting', 'Sequencing / Programming', 'Printing', 'Deleting'], correctIndex: 1, explanation: 'Ordered instructions form a computer program.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  },

  // ==================== CLASS 5 ====================
  {
    classNumber: 5,
    label: 'Class 5',
    stage: 'Primary (Classes 1–5)',
    subjects: [
      makeSubject(5, 'math', 'Mathematics', 'Mathematics', 'blue', 'Fractions, decimals, geometry angles, area, and averages.', [
        {
          title: 'Fractions & Operations',
          topics: ['Proper, improper, mixed fractions', 'Comparing fractions', 'Addition & multiplication of fractions'],
          summary: 'Master mixed fractions, equivalent scaling, and adding or multiplying fractions in practical problems.',
          objectives: ['Convert improper to mixed fractions', 'Add unlike fractions using LCM', 'Multiply fractions cleanly'],
          studyNotes: [
            'Proper fraction: numerator < denominator (3/4). Improper: numerator >= denominator (7/4). Mixed: whole + proper (1 3/4).',
            'To add unlike fractions, find a common denominator (LCM) first, convert to equivalent fractions, then add numerators.'
          ],
          revisionPoints: ['Improper -> Mixed via division', 'Multiply fractions: (a×c)/(b×d)', 'Reciprocal flips numerator & denominator'],
          practiceQuestions: [
            { question: 'Convert 11/4 into a mixed fraction.', answer: '2 3/4 (11 ÷ 4 = 2 remainder 3).' },
            { question: 'Add 1/2 + 1/3.', answer: '3/6 + 2/6 = 5/6.' }
          ],
          quizQuestions: [
            { question: 'Which is an improper fraction?', options: ['2/5', '7/9', '9/4', '1/3'], correctIndex: 2, explanation: '9/4 has a numerator greater than its denominator.' },
            { question: 'Convert 2 1/3 into an improper fraction:', options: ['5/3', '6/3', '7/3', '3/7'], correctIndex: 2, explanation: '(2 × 3) + 1 = 7, so 7/3.' },
            { question: 'What is 1/2 + 1/4?', options: ['2/6', '3/4', '1/6', '2/4'], correctIndex: 1, explanation: '2/4 + 1/4 = 3/4.' },
            { question: 'What is 2/3 × 3/5?', options: ['6/15 (or 2/5)', '5/8', '6/8', '1/5'], correctIndex: 0, explanation: '(2×3)/(3×5) = 6/15 = 2/5.' },
            { question: 'What is the reciprocal of 5/7?', options: ['5/7', '7/5', '1/5', '2/7'], correctIndex: 1, explanation: 'Swapping numerator and denominator gives 7/5.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Decimals & Percentages Intro',
          topics: ['Tenths and hundredths', 'Converting fractions to decimals', 'Adding decimals', 'Percentage out of 100'],
          summary: 'Understand place value to the right of the decimal point (tenths, hundredths) and connect decimals to fractions and percentages.',
          objectives: ['Read and write decimals up to thousandths', 'Add and subtract aligned decimal numbers'],
          studyNotes: [
            'Digits right of the decimal point represent tenths (1/10 = 0.1), hundredths (1/100 = 0.01), and thousandths (1/1000 = 0.001).',
            'Always line up decimal points vertically before adding or subtracting.'
          ],
          revisionPoints: ['0.5 = 1/2 = 50%', '0.25 = 1/4 = 25%', 'Align decimal points when adding'],
          practiceQuestions: [
            { question: 'Write 3/10 + 4/100 as a decimal.', answer: '0.34.' },
            { question: 'Add 12.45 + 3.8.', answer: '16.25.' }
          ],
          quizQuestions: [
            { question: 'What is 7/100 written as a decimal?', options: ['0.7', '0.07', '7.0', '0.007'], correctIndex: 1, explanation: '7 hundredths sits in the second decimal place: 0.07.' },
            { question: 'What is 2.5 + 1.75?', options: ['3.80', '4.25', '3.25', '4.00'], correctIndex: 1, explanation: '2.50 + 1.75 = 4.25.' },
            { question: 'Which decimal is largest: 0.6, 0.59, 0.09, 0.499?', options: ['0.6', '0.59', '0.09', '0.499'], correctIndex: 0, explanation: '0.6 = 0.600, which has 6 tenths.' },
            { question: 'What percentage equals the fraction 3/4?', options: ['25%', '50%', '75%', '80%'], correctIndex: 2, explanation: '3/4 × 100% = 75%.' },
            { question: 'Subtract 5.0 − 1.35:', options: ['3.65', '4.65', '3.75', '4.35'], correctIndex: 0, explanation: '5.00 − 1.35 = 3.65.' }
          ],
          diagramType: 'math-numberline'
        },
        {
          title: 'Geometry: Angles, Area & Volume',
          topics: ['Acute, right, obtuse, straight angles', 'Using a protractor', 'Area of rectangle/square', 'Volume of cube/cuboid'],
          summary: 'Measure angles with a protractor, calculate areas in square units, and find volumes of boxes.',
          objectives: ['Classify angles by degree measure', 'Calculate Area = L × B', 'Calculate Volume = L × B × H'],
          studyNotes: [
            'Right angle = 90°. Acute angle < 90°. Obtuse angle is between 90° and 180°. Straight angle = 180°.',
            'Area of rectangle = Length × Breadth (sq. units). Volume of cuboid = Length × Breadth × Height (cubic units).'
          ],
          revisionPoints: ['Right angle = 90°', 'Area = L × B', 'Volume = L × B × H'],
          practiceQuestions: [
            { question: 'Classify a 125° angle.', answer: 'Obtuse angle (between 90° and 180°).' },
            { question: 'Find the volume of a box 5 cm long, 4 cm wide, and 3 cm high.', answer: '5 × 4 × 3 = 60 cubic cm.' }
          ],
          quizQuestions: [
            { question: 'An angle measuring 45° is called:', options: ['Right angle', 'Acute angle', 'Obtuse angle', 'Straight angle'], correctIndex: 1, explanation: 'Angles less than 90° are acute.' },
            { question: 'What is the measure of a straight angle?', options: ['90°', '120°', '180°', '360°'], correctIndex: 2, explanation: 'A straight line forms a 180° angle.' },
            { question: 'Find the area of a square of side 8 cm:', options: ['32 sq cm', '64 sq cm', '16 sq cm', '24 sq cm'], correctIndex: 1, explanation: 'Area = side × side = 8 × 8 = 64 sq cm.' },
            { question: 'Which instrument measures angles in degrees?', options: ['Divider', 'Compass', 'Protractor', 'Scale'], correctIndex: 2, explanation: 'A D-shaped protractor measures degrees.' },
            { question: 'Find the volume of a cube of edge 4 cm:', options: ['16 cu cm', '32 cu cm', '64 cu cm', '12 cu cm'], correctIndex: 2, explanation: '4 × 4 × 4 = 64 cubic cm.' }
          ],
          diagramType: 'geometry-shapes'
        }
      ]),
      makeSubject(5, 'english', 'English', 'Languages', 'lavender', 'Active/passive intro, prepositions, direct speech, and reading comprehension.', [
        {
          title: 'Prepositions & Modals',
          topics: ['Time & place prepositions (at, on, in, between, among)', 'Can, May, Must, Should'],
          summary: 'Use prepositions of time and place precisely and express ability, permission, or advice with modal verbs.',
          objectives: ['Distinguish between vs among', 'Use at/on/in for time', 'Apply can, may, must'],
          studyNotes: [
            'Time prepositions: AT for exact clock times (at 6 PM), ON for days/dates (on Monday), IN for months/years/seasons (in July).',
            '"Between" is for two items; "among" is for more than two.',
            'Modals: "can" (ability), "may" (polite permission), "must" (strong duty), "should" (advice).'
          ],
          revisionPoints: ['at = time, on = day, in = month', 'between = 2, among = 3+', 'may = polite permission'],
          practiceQuestions: [
            { question: 'Fill in: "The school starts ___ 8:00 AM."', answer: 'at.' },
            { question: 'Fill in: "Share these sweets ___ all five friends."', answer: 'among.' }
          ],
          quizQuestions: [
            { question: 'Fill in: "My birthday is ___ 15th August."', options: ['in', 'on', 'at', 'by'], correctIndex: 1, explanation: 'Specific dates take the preposition "on".' },
            { question: 'Fill in: "Divide the apple ___ Ram and Shyam."', options: ['among', 'between', 'into', 'over'], correctIndex: 1, explanation: '"between" is used for two people.' },
            { question: 'Which modal asks polite permission?', options: ['Must', 'May', 'Should', 'Will'], correctIndex: 1, explanation: '"May I come in?" asks polite permission.' },
            { question: 'Fill in: "We ___ obey traffic rules."', options: ['must', 'might', 'can', 'could'], correctIndex: 0, explanation: '"must" expresses obligation/necessity.' },
            { question: 'Fill in: "Flowers bloom ___ spring."', options: ['at', 'on', 'in', 'to'], correctIndex: 2, explanation: 'Seasons take "in".' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Future Tense & Question Tags',
          topics: ['Simple future (will / going to)', 'Forming short question tags', 'Negative sentences'],
          summary: 'Express future plans clearly and attach natural question tags to confirm statements.',
          objectives: ['Use will + base verb', 'Match positive statements with negative tags'],
          studyNotes: [
            'Simple future uses "will + base verb": "I will study science tonight."',
            'Question tags reverse the polarity: Positive statement -> negative tag ("It is sunny, isn’t it?"). Negative statement -> positive tag ("You aren’t late, are you?").'
          ],
          revisionPoints: ['will + base verb', '+ statement -> - tag', '- statement -> + tag'],
          practiceQuestions: [
            { question: 'Add a question tag: "She is a good singer, ___?"', answer: 'isn’t she?' },
            { question: 'Change to negative: "He will attend the meeting."', answer: 'He will not (won’t) attend the meeting.' }
          ],
          quizQuestions: [
            { question: 'Complete: "They are coming today, ___?"', options: ['are they', 'aren’t they', 'isn’t it', 'do they'], correctIndex: 1, explanation: 'Positive "are" takes negative tag "aren’t they".' },
            { question: 'Complete: "He doesn’t play tennis, ___?"', options: ['does he', 'doesn’t he', 'is he', 'did he'], correctIndex: 0, explanation: 'Negative "doesn’t" takes positive tag "does he".' },
            { question: 'Which sentence expresses future action?', options: ['She cooked food.', 'She cooks food.', 'She will cook food.', 'She was cooking.'], correctIndex: 2, explanation: '"will cook" indicates future tense.' },
            { question: 'What is the short form of "will not"?', options: ['willn’t', 'won’t', 'wouldn’t', 'weren’t'], correctIndex: 1, explanation: 'Will not contracts to won’t.' },
            { question: 'Complete: "Tomorrow ___ be a holiday."', options: ['was', 'will', 'did', 'has'], correctIndex: 1, explanation: '"Tomorrow" requires future auxiliary "will".' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'Synonyms, Idioms & Reading Mastery',
          topics: ['Context clues', 'Common idioms', 'Prefixes & suffixes'],
          summary: 'Decode unfamiliar words using prefixes and suffixes, understand common idioms, and analyze short passages.',
          objectives: ['Build words with un-, dis-, -ful, -less', 'Infer word meanings from context'],
          studyNotes: [
            'Prefixes attach to the start of a word (un + happy = unhappy, dis + honest = dishonest).',
            'Suffixes attach to the end (care + ful = careful, care + less = careless).'
          ],
          revisionPoints: ['un-/dis- often mean NOT', '-less means WITHOUT', '-ful means FULL OF'],
          practiceQuestions: [
            { question: 'Add a prefix to make the opposite of "possible".', answer: 'impossible.' },
            { question: 'What does "fearless" mean?', answer: 'Without fear / brave.' }
          ],
          quizQuestions: [
            { question: 'Which prefix makes the opposite of "kind"?', options: ['dis-', 'un-', 're-', 'mis-'], correctIndex: 1, explanation: 'un + kind = unkind.' },
            { question: 'What does the suffix "-less" in "hopeless" mean?', options: ['Full of', 'Without', 'Again', 'Before'], correctIndex: 1, explanation: '-less means without.' },
            { question: 'Choose a synonym for "brave":', options: ['Timid', 'Courageous', 'Lazy', 'Weak'], correctIndex: 1, explanation: 'Brave and courageous have similar meanings.' },
            { question: 'What does the idiom "a piece of cake" mean?', options: ['A bakery item', 'Very easy task', 'Very hard work', 'Birthday gift'], correctIndex: 1, explanation: 'Something very easy to do.' },
            { question: 'Which word has a prefix meaning "again"?', options: ['Unhappy', 'Rewrite', 'Careful', 'Slowly'], correctIndex: 1, explanation: 're- means again (write again).' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(5, 'hindi', 'Hindi (हिन्दी)', 'Languages', 'peach', 'कारक, उपसर्ग-प्रत्यय, पत्र लेखन और पठित गद्यांश।', [
        {
          title: 'कारक चिह्न (परसर्ग) परिचय',
          topics: ['कर्ता ने, कर्म को, करण से', 'संप्रदान, अपादान, संबंध, अधिकरण'],
          summary: 'वाक्य में संज्ञा या सर्वनाम का क्रिया से संबंध जोड़ने वाले कारक चिह्नों (ने, को, से, में, पर) का सही प्रयोग सीखें।',
          objectives: ['प्रमुख कारक चिह्न पहचानना', 'रिक्त स्थानों में सही परसर्ग भरना'],
          studyNotes: [
            'कारक चिह्न शब्दों को जोड़ते हैं: राम ने रावण को बाण से मारा। मेज पर किताब रखी है। पेड़ से पत्ता गिरा।'
          ],
          revisionPoints: ['कर्ता – ने', 'कर्म – को', 'अधिकरण – में, पर'],
          practiceQuestions: [
            { question: '"पेड़ ___ पत्ता गिरा।" सही कारक चिह्न भरिए।', answer: 'से (अपादान कारक—अलग होने का भाव)।' },
            { question: '"बस्ता मेज ___ रखा है।" में कारक बताइए।', answer: 'पर (अधिकरण कारक)।' }
          ],
          quizQuestions: [
            { question: '"माँ ने खाना बनाया।" में "ने" किस कारक का चिह्न है?', options: ['कर्म', 'कर्ता', 'करण', 'संबंध'], correctIndex: 1, explanation: 'कर्ता कारक का चिह्न "ने" होता है।' },
            { question: '"छत ___ बच्चे खेल रहे हैं।" सही शब्द चुनिए:', options: ['ने', 'पर', 'को', 'की'], correctIndex: 1, explanation: 'स्थान के लिए "पर" (अधिकरण) आता है।' },
            { question: '"गिलास में पानी है।" में कारक चिह्न क्या है?', options: ['पानी', 'है', 'में', 'गिलास'], correctIndex: 2, explanation: '"में" अधिकरण कारक का चिह्न है।' },
            { question: '"वह कलम ___ लिखता है।" रिक्त स्थान भरिए:', options: ['से', 'ने', 'का', 'में'], correctIndex: 0, explanation: 'साधन के लिए "से" (करण कारक) लगता है।' },
            { question: '"रोहन ___ भाई स्कूल गया।" सही संबंध चिह्न चुनिए:', options: ['ने', 'को', 'का', 'पर'], correctIndex: 2, explanation: 'संबंध दिखाने के लिए "का" लगता है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'उपसर्ग और प्रत्यय',
          topics: ['शब्द के आगे जुड़ने वाले उपसर्ग', 'शब्द के पीछे जुड़ने वाले प्रत्यय'],
          summary: 'मूल शब्दों के आगे उपसर्ग और पीछे प्रत्यय जोड़कर नए शब्द बनाना सीखें।',
          objectives: ['उपसर्ग और प्रत्यय में अंतर करना', 'मूल शब्द अलग करना'],
          studyNotes: [
            'उपसर्ग शब्द के आरंभ में जुड़ते हैं: अ + सत्य = असत्य, सु + पुत्र = सुपुत्र।',
            'प्रत्यय शब्द के अंत में जुड़ते हैं: सुंदर + ता = सुंदरता, लिख + आवट = लिखावट।'
          ],
          revisionPoints: ['उपसर्ग = आगे (Pre)', 'प्रत्यय = पीछे (Post)'],
          practiceQuestions: [
            { question: '"असफल" में उपसर्ग और मूल शब्द अलग कीजिए।', answer: 'उपसर्ग: अ, मूल शब्द: सफल।' },
            { question: '"ईमानदार" में कौन-सा प्रत्यय है?', answer: 'दार।' }
          ],
          quizQuestions: [
            { question: 'जो शब्दांश शब्द के आगे जुड़ते हैं, वे कहलाते हैं:', options: ['प्रत्यय', 'उपसर्ग', 'संधि', 'समास'], correctIndex: 1, explanation: 'उपसर्ग शब्द के प्रारंभ में जुड़ते हैं।' },
            { question: '"सफलता" में कौन-सा प्रत्यय लगा है?', options: ['स', 'फल', 'ता', 'लता'], correctIndex: 2, explanation: 'सफल + ता = सफलता।' },
            { question: '"अनुशासन" में उपसर्ग बताइए:', options: ['अ', 'अनु', 'शन', 'न'], correctIndex: 1, explanation: 'अनु + शासन = अनुशासन।' },
            { question: '"मित्र" में "ता" प्रत्यय जोड़ने पर बनेगा:', options: ['अमित्र', 'मित्रता', 'मैत्री', 'मित्रों'], correctIndex: 1, explanation: 'मित्र + ता = मित्रता।' },
            { question: 'इनमें से किस शब्द में "अ" उपसर्ग नहीं है?', options: ['अज्ञान', 'अमर', 'असत्य', 'अचार'], correctIndex: 3, explanation: 'अचार एक स्वतंत्र मूल शब्द है।' }
          ],
          diagramType: 'grammar-tree'
        },
        {
          title: 'औपचारिक पत्र और संवाद लेखन',
          topics: ['प्रधानाचार्य को अवकाश पत्र', 'दो मित्रों के बीच संवाद'],
          summary: 'सरल शब्दों में विद्यालय के प्रधानाचार्य को प्रार्थना-पत्र लिखने का प्रारूप सीखें।',
          objectives: ['प्रार्थना पत्र के भाग क्रमबद्ध लिखना', 'शिष्टाचार भाषा का प्रयोग'],
          studyNotes: [
            'प्रार्थना-पत्र की शुरुआत "सेवा में, श्रीमान प्रधानाचार्य महोदय..." से होती है, फिर विषय, संबोधन, मुख्य कारण और अंत में "आपका आज्ञाकारी शिष्य/शिष्या" लिखा जाता है।'
          ],
          revisionPoints: ['विषय संक्षिप्त लिखें', 'दिनांक और कक्षा अवश्य लिखें'],
          practiceQuestions: [
            { question: 'अवकाश पत्र किसे संबोधित करके लिखा जाता है?', answer: 'प्रधानाचार्य / कक्षा अध्यापक को।' },
            { question: 'पत्र में "विषय" क्यों लिखा जाता है?', answer: 'ताकि पढ़ने वाले को तुरंत पत्र का मुख्य उद्देश्य समझ आ जाए।' }
          ],
          quizQuestions: [
            { question: 'प्रधानाचार्य को लिखा गया पत्र किस श्रेणी में आता है?', options: ['अनौपचारिक', 'औपचारिक', 'कहानी', 'कविता'], correctIndex: 1, explanation: 'विद्यालय या कार्यालय के पत्र औपचारिक होते हैं।' },
            { question: 'प्रार्थना-पत्र के आरंभ में क्या लिखा जाता है?', options: ['धन्यवाद', 'सेवा में', 'प्यारे मित्र', 'समाप्त'], correctIndex: 1, explanation: 'औपचारिक पत्र "सेवा में" से आरंभ होता है।' },
            { question: 'दो लोगों की बातचीत को लिखना क्या कहलाता है?', options: ['निबंध', 'संवाद लेखन', 'नोटिस', 'कविता'], correctIndex: 1, explanation: 'बातचीत के लिखित रूप को संवाद कहते हैं।' },
            { question: 'पत्र के अंत में छात्र क्या लिखते हैं?', options: ['तुम्हारा शत्रु', 'आपका आज्ञाकारी शिष्य/शिष्या', 'अलविदा', 'नया वर्ष'], correctIndex: 1, explanation: 'शिष्टाचार हेतु आज्ञाकारी शिष्य/शिष्या लिखते हैं।' },
            { question: 'प्रार्थना पत्र में मुख्य बात कितने वाक्यों में होनी चाहिए?', options: ['बहुत लंबी कहानी', 'स्पष्ट और संक्षिप्त', 'बिना कारण', 'केवल एक शब्द'], correctIndex: 1, explanation: 'औपचारिक पत्र स्पष्ट और संक्षिप्त होता है।' }
          ],
          diagramType: 'grammar-tree'
        }
      ]),
      makeSubject(5, 'evs', 'Environmental Studies (EVS)', 'EVS', 'mint', 'Seed dispersal, human senses & preservation, force/energy, and heritage.', [
        {
          title: 'Seeds, Germination & Food Preservation',
          topics: ['Structure of a seed', 'Seed dispersal (wind, water, animals)', 'Preventing food spoilage'],
          summary: 'Discover how baby plants sleep inside seeds, travel across distances, and how we preserve food safely.',
          objectives: ['Identify seed coat, cotyledon, embryo', 'Explain methods of food preservation'],
          studyNotes: [
            'Seeds travel by wind (cotton, dandelion), water (coconut), animals (hooks/fruits), and bursting (pea pods).',
            'Food spoils due to moisture and warmth. Refrigeration, drying, salting (pickles), and boiling preserve food.'
          ],
          revisionPoints: ['Germination needs air, water, warmth', 'Drying removes moisture', 'Coconut disperses by water'],
          practiceQuestions: [
            { question: 'Why does a seed soaked in dry sand not sprout?', answer: 'Because water is essential for germination.' },
            { question: 'How are mango pickles preserved for months?', answer: 'Using salt and oil, which stop microbial growth.' }
          ],
          quizQuestions: [
            { question: 'How is a coconut seed dispersed across islands?', options: ['By wind', 'By water', 'By bursting', 'By ants'], correctIndex: 1, explanation: 'Coconuts have fibrous husks that float on ocean water.' },
            { question: 'Which conditions are required for a seed to germinate?', options: ['Darkness only', 'Water, air, and right warmth', 'Boiling oil', 'Freezer ice'], correctIndex: 1, explanation: 'Moisture, oxygen, and moderate warmth trigger sprouting.' },
            { question: 'Why do we keep milk in a refrigerator?', options: ['To freeze it hard', 'Low temperature slows down bacteria', 'To add vitamins', 'To make it salty'], correctIndex: 1, explanation: 'Cooling slows microbial spoilage.' },
            { question: 'Which plant scatters seeds by bursting its pods?', options: ['Pea / Balsam', 'Lotus', 'Coconut', 'Maple'], correctIndex: 0, explanation: 'Dry pea pods snap open and fling seeds.' },
            { question: 'The food stored inside a seed for the baby plant is in the:', options: ['Seed coat', 'Cotyledons', 'Stem', 'Flower'], correctIndex: 1, explanation: 'Cotyledons (seed leaves) nourish the embryo.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Super Senses, Breathing & Space',
          topics: ['Animal super senses', 'Respiratory system basics', 'Sunita in space / Gravity'],
          summary: 'Learn how animals sense danger, how our diaphragm helps us breathe, and what happens without gravity in space.',
          objectives: ['Compare animal senses to humans', 'Explain inhalation and exhalation', 'Understand weightlessness in space'],
          studyNotes: [
            'Dogs have a sharp sense of smell; eagles spot prey from kilometres away; bats use echoes.',
            'When we inhale, our chest expands and lungs fill with air. In space, there is negligible gravity so objects float!'
          ],
          revisionPoints: ['Ants leave scent trails', 'Inhale = oxygen in', 'Gravity pulls everything toward Earth'],
          practiceQuestions: [
            { question: 'Why do ants walk in a single line?', answer: 'They follow a scent trail left on the ground by ants ahead.' },
            { question: 'Why do astronauts float inside a spacecraft?', answer: 'Because they are in microgravity (free-fall orbit).' }
          ],
          quizQuestions: [
            { question: 'Which bird has eyesight four times sharper than humans?', options: ['Crow', 'Eagle', 'Sparrow', 'Duck'], correctIndex: 1, explanation: 'Eagles and kites spot tiny prey from high altitudes.' },
            { question: 'Why do we blow on hot soup?', options: ['To heat it', 'To cool it down', 'To freeze it', 'To make it spicy'], correctIndex: 1, explanation: 'Cooler breath speeds heat loss from hot soup.' },
            { question: 'Which organ expands when we breathe in air?', options: ['Stomach', 'Lungs', 'Kidneys', 'Liver'], correctIndex: 1, explanation: 'Lungs fill with air during inhalation.' },
            { question: 'What pulls a thrown ball back down to the ground?', options: ['Wind', 'Gravity', 'Electricity', 'Magnetism'], correctIndex: 1, explanation: 'Earth’s gravity attracts objects downward.' },
            { question: 'How do bats navigate in dark caves?', options: ['Flashlight', 'Echolocation (sound echoes)', 'Color vision', 'Smell only'], correctIndex: 1, explanation: 'Bats listen to bouncing sound waves.' }
          ],
          diagramType: 'science-cycle'
        },
        {
          title: 'Fuels, Conservation & Indian Heritage',
          topics: ['Renewable vs non-renewable fuels', 'Saving petrol & diesel', 'Historical forts & stepwells'],
          summary: 'Compare limited fossil fuels like petroleum with clean energy, and learn how ancient Indian forts harvested rainwater.',
          objectives: ['Differentiate fossil fuels and solar/wind energy', 'Appreciate ancient water architecture like stepwells'],
          studyNotes: [
            'Coal, petrol, and diesel take millions of years to form underground and will run out if wasted. Solar and wind energy are renewable.',
            'Ancient forts and baolis (stepwells) stored rainwater carefully for dry months.'
          ],
          revisionPoints: ['Petrol/Coal = non-renewable', 'Solar/Wind = renewable', 'Switch off engines at red lights'],
          practiceQuestions: [
            { question: 'What is a baoli (stepwell)?', answer: 'An ancient deep well with stone steps built to store and access groundwater.' },
            { question: 'Name two ways to save fuel.', answer: 'Use bicycles or public transport, and turn off engines at traffic signals.' }
          ],
          quizQuestions: [
            { question: 'Which of these is a renewable energy source?', options: ['Coal', 'Petrol', 'Sunlight (Solar)', 'Diesel'], correctIndex: 2, explanation: 'Sunlight is naturally replenished every day.' },
            { question: 'Why should we switch off car engines at long red lights?', options: ['To save fuel and reduce smoke', 'To go faster', 'To charge tires', 'To break the engine'], correctIndex: 0, explanation: 'Idling burns fuel and pollutes air.' },
            { question: 'What is CNG used for in buses and autos?', options: ['Cooking salt', 'Cleaner vehicle fuel', 'Washing tires', 'Painting roads'], correctIndex: 1, explanation: 'Compressed Natural Gas burns cleaner than diesel.' },
            { question: 'Ancient stepped water reservoirs in India are called:', options: ['Igloos', 'Baolis / Stepwells', 'Skyscrapers', 'Tunnels'], correctIndex: 1, explanation: 'Baolis stored monsoon water for communities.' },
            { question: 'Fossil fuels are formed over:', options: ['2 days', '1 year', 'Millions of years', '10 minutes'], correctIndex: 2, explanation: 'Coal and petroleum formed over millions of years.' }
          ],
          diagramType: 'history-timeline'
        }
      ]),
      makeSubject(5, 'cs', 'Computer Studies', 'Technology', 'lavender', 'Presentations, spreadsheets basics, and safe internet habits.', [
        {
          title: 'Creating Presentations (Slides)',
          topics: ['Slides, layouts, themes', 'Adding images and bullet points', 'Slide show mode (F5)'],
          summary: 'Design clean visual presentations using slides, concise bullet points, images, and smooth transitions.',
          objectives: ['Create a multi-slide presentation', 'Keep slides crisp and readable'],
          studyNotes: [
            'Presentation software (like PowerPoint or Impress) organizes ideas into Slides.',
            'Good slides use short bullet points, readable font sizes, and relevant pictures instead of huge walls of text.'
          ],
          revisionPoints: ['F5 starts Slideshow', 'Keep 5–6 words per bullet', 'Insert relevant visuals'],
          practiceQuestions: [
            { question: 'What is a single page in a presentation called?', answer: 'A Slide.' },
            { question: 'Which key starts full-screen Slide Show?', answer: 'F5.' }
          ],
          quizQuestions: [
            { question: 'Each page of a presentation is called a:', options: ['Worksheet', 'Slide', 'Paragraph', 'Cell'], correctIndex: 1, explanation: 'Presentations consist of slides.' },
            { question: 'Which rule makes a presentation easy to read?', options: ['Tiny font size', 'Short bullet points and clear contrast', '10 paragraphs per slide', 'Yellow text on white'], correctIndex: 1, explanation: 'Short bullets and strong contrast improve readability.' },
            { question: 'What do Transitions control?', options: ['File saving', 'How one slide moves to the next', 'Font color', 'Printing speed'], correctIndex: 1, explanation: 'Slide transitions animate movement between slides.' },
            { question: 'Which view shows thumbnails of all slides together?', options: ['Slide Sorter view', 'Reading view', 'Zoom 400%', 'Print'], correctIndex: 0, explanation: 'Slide Sorter lets you reorder slides easily.' },
            { question: 'Which shortcut normally begins a slide show from start?', options: ['F1', 'F5', 'Ctrl+Z', 'Esc'], correctIndex: 1, explanation: 'F5 launches the full-screen presentation.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Introduction to Spreadsheets',
          topics: ['Rows, Columns, Cells', 'Cell addresses (A1, B2)', 'Simple SUM formula'],
          summary: 'Organize numbers and class marks inside spreadsheet tables and calculate totals automatically using formulas.',
          objectives: ['Identify Rows, Columns, and Cell addresses', 'Use =SUM(A1:A5) formula'],
          studyNotes: [
            'A spreadsheet is a grid of horizontal Rows (1, 2, 3...) and vertical Columns (A, B, C...).',
            'Where a row and column meet is a Cell (e.g., B3). Every formula in a spreadsheet begins with an equals sign (=).'
          ],
          revisionPoints: ['Row = horizontal number', 'Column = vertical letter', 'Formulas start with ='],
          practiceQuestions: [
            { question: 'What is the cell address of Column C, Row 4?', answer: 'C4.' },
            { question: 'Which symbol begins every spreadsheet formula?', answer: 'The equals sign (=).' }
          ],
          quizQuestions: [
            { question: 'The intersection of a row and a column is called a:', options: ['Slide', 'Cell', 'Paragraph', 'Folder'], correctIndex: 1, explanation: 'A cell holds a single value or formula.' },
            { question: 'Every spreadsheet formula must start with:', options: ['+', '=', '#', '@'], correctIndex: 1, explanation: 'Formulas always begin with =.' },
            { question: 'Which is a valid cell address?', options: ['4B', 'B4', 'BB', '44'], correctIndex: 1, explanation: 'Column letter comes before Row number (B4).' },
            { question: 'Which function adds numbers in cells A1 through A5?', options: ['=ADD(A1:A5)', '=SUM(A1:A5)', '=TOTAL(A1:A5)', '=PLUS(A1:A5)'], correctIndex: 1, explanation: 'SUM computes the total of a range.' },
            { question: 'Columns in a spreadsheet are labeled with:', options: ['Numbers (1, 2, 3)', 'Letters (A, B, C)', 'Colors', 'Dates'], correctIndex: 1, explanation: 'Columns use letters; rows use numbers.' }
          ],
          diagramType: 'cs-flow'
        },
        {
          title: 'Internet & Cyber Safety',
          topics: ['Web browsers & URLs', 'Strong passwords', 'Never sharing personal info online'],
          summary: 'Explore how websites work via web browsers and practice essential rules to stay safe online.',
          objectives: ['Identify browser and search engine', 'Follow cyber safety rules with adults'],
          studyNotes: [
            'The Internet connects millions of computers worldwide. A Web Browser opens websites using their address (URL).',
            'Never share your full address, phone number, school ID, or passwords with strangers online.'
          ],
          revisionPoints: ['Keep passwords private', 'Ask parents before downloading', 'Be polite online (Netiquette)'],
          practiceQuestions: [
            { question: 'What is a web browser?', answer: 'Software used to view websites on the internet.' },
            { question: 'Should you share your password with a friend online?', answer: 'No, passwords must always remain private.' }
          ],
          quizQuestions: [
            { question: 'Which software is used to open websites?', options: ['Calculator', 'Web Browser', 'Paint', 'Notepad'], correctIndex: 1, explanation: 'Browsers like Chrome or Firefox load web pages.' },
            { question: 'What makes a password strong?', options: ['Your name', '123456', 'Mix of letters, numbers, and symbols', 'password'], correctIndex: 2, explanation: 'Mixing character types makes passwords hard to guess.' },
            { question: 'If a stranger asks for your home address online, you should:', options: ['Reply immediately', 'Ignore and tell a parent/teacher', 'Send a photo', 'Click unknown links'], correctIndex: 1, explanation: 'Never share personal information with strangers.' },
            { question: 'Polite and respectful behavior on the internet is called:', options: ['Hacking', 'Netiquette', 'Spamming', 'Downloading'], correctIndex: 1, explanation: 'Netiquette means good internet etiquette.' },
            { question: 'Before downloading a new file from an unknown site:', options: ['Click blindly', 'Check with a parent or teacher', 'Turn off antivirus', 'Share your email'], correctIndex: 1, explanation: 'Unknown downloads can contain harmful malware.' }
          ],
          diagramType: 'cs-flow'
        }
      ])
    ]
  }
];

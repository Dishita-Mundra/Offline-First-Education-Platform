import type { CBSEChapter, CBSEClassData, CBSESubject, SampleAssignment } from '../types/curriculum';
import { CBSE_PRIMARY_CLASSES } from './cbsePrimary';
import { CBSE_MIDDLE_CLASSES } from './cbseMiddle';
import { CBSE_SECONDARY_CLASSES } from './cbseSecondary';

export const CBSE_CURRICULUM: CBSEClassData[] = [
  ...CBSE_PRIMARY_CLASSES,
  ...CBSE_MIDDLE_CLASSES,
  ...CBSE_SECONDARY_CLASSES,
].sort((a, b) => a.classNumber - b.classNumber);

export function getClassData(classNumber: number): CBSEClassData | undefined {
  return CBSE_CURRICULUM.find((c) => c.classNumber === classNumber);
}

export function getSubjectsForClass(classNumber: number): CBSESubject[] {
  return getClassData(classNumber)?.subjects ?? [];
}

export function getSubjectById(subjectId: string): CBSESubject | undefined {
  for (const cls of CBSE_CURRICULUM) {
    const found = cls.subjects.find((s) => s.id === subjectId);
    if (found) return found;
  }
  return undefined;
}

export function getChapterById(chapterId: string): CBSEChapter | undefined {
  for (const cls of CBSE_CURRICULUM) {
    for (const sub of cls.subjects) {
      const ch = sub.chapters.find((c) => c.id === chapterId);
      if (ch) return ch;
    }
  }
  return undefined;
}

export function getAllChaptersForClass(classNumber: number): CBSEChapter[] {
  const cls = getClassData(classNumber);
  if (!cls) return [];
  return cls.subjects.flatMap((s) => s.chapters);
}

export function searchCurriculum(query: string, classFilter?: number) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: Array<{
    type: 'subject' | 'chapter';
    id: string;
    classNumber: number;
    subjectId: string;
    subjectName: string;
    title: string;
    subtitle: string;
  }> = [];

  for (const cls of CBSE_CURRICULUM) {
    if (classFilter && cls.classNumber !== classFilter) continue;
    for (const sub of cls.subjects) {
      if (sub.name.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q)) {
        results.push({
          type: 'subject',
          id: sub.id,
          classNumber: cls.classNumber,
          subjectId: sub.id,
          subjectName: sub.name,
          title: `${sub.name} (Class ${cls.classNumber})`,
          subtitle: sub.description,
        });
      }
      for (const ch of sub.chapters) {
        const hay = [ch.title, ch.summary, ...ch.topics, ...ch.studyNotes].join(' ').toLowerCase();
        if (hay.includes(q)) {
          results.push({
            type: 'chapter',
            id: ch.id,
            classNumber: cls.classNumber,
            subjectId: sub.id,
            subjectName: sub.name,
            title: ch.title,
            subtitle: `Class ${cls.classNumber} · ${sub.name} · Ch ${ch.chapterNumber}`,
          });
        }
      }
    }
  }
  return results.slice(0, 30);
}

export const SAMPLE_ASSIGNMENTS: SampleAssignment[] = [
  {
    id: 'sample-assign-c1-math',
    title: 'Counting & Shapes Around Home',
    description: 'List 5 round objects and 5 rectangular objects you see in your house, and write their total count.',
    classNumber: 1,
    subjectName: 'Mathematics',
    dueDate: '2026-12-05',
    maxMarks: 20,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c3-evs',
    title: 'Leaf Collection & Plant Parts Note',
    description: 'Observe two plants near your home. Describe their stems (tree, shrub, or herb) and explain how leaves help the plant.',
    classNumber: 3,
    subjectName: 'Environmental Studies (EVS)',
    dueDate: '2026-12-07',
    maxMarks: 25,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c5-math',
    title: 'Fraction & Decimal Kitchen Log',
    description: 'Write 3 everyday examples where fractions or decimals are used (like 1/2 litre milk or ₹12.50) and convert each fraction to a decimal.',
    classNumber: 5,
    subjectName: 'Mathematics',
    dueDate: '2026-12-08',
    maxMarks: 25,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c6-sci',
    title: 'Balanced Diet 3-Day Meal Chart',
    description: 'Plan a 3-day balanced meal chart listing carbohydrates, proteins, fats, vitamins, and roughage items.',
    classNumber: 6,
    subjectName: 'Science',
    dueDate: '2026-12-10',
    maxMarks: 30,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c7-math',
    title: 'Integer & Equation Practice Sheet',
    description: 'Create and solve 3 real-world word problems using negative integers (temperature or elevation) and 2 linear equations.',
    classNumber: 7,
    subjectName: 'Mathematics',
    dueDate: '2026-12-10',
    maxMarks: 30,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c8-sci',
    title: 'Force, Pressure & Sound Lab Reflection',
    description: 'Explain two daily examples of reducing or increasing pressure by changing area, and why sound cannot travel in space.',
    classNumber: 8,
    subjectName: 'Science',
    dueDate: '2026-12-12',
    maxMarks: 30,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c9-math',
    title: 'Coordinate Quadrants & Heron’s Area Proof',
    description: 'Plot 4 points in each quadrant on graph paper and calculate the area of a triangle with sides 9 cm, 12 cm, and 15 cm using Heron’s Formula.',
    classNumber: 9,
    subjectName: 'Mathematics',
    dueDate: '2026-12-14',
    maxMarks: 40,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c10-sci',
    title: 'Balanced Equations & Circuit Analysis',
    description: 'Write 4 balanced chemical equations (one each of combination, decomposition, displacement, and double displacement) and solve a parallel resistor problem.',
    classNumber: 10,
    subjectName: 'Science',
    dueDate: '2026-12-15',
    maxMarks: 40,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
  {
    id: 'sample-assign-c10-sst',
    title: 'Salt Satyagraha & Power Sharing Essay',
    description: 'Write a 200-word analysis explaining why the 1930 Dandi March united Indians across regions, and compare horizontal vs vertical power sharing.',
    classNumber: 10,
    subjectName: 'Social Science',
    dueDate: '2026-12-16',
    maxMarks: 40,
    teacherId: 'cbse_curriculum',
    teacherName: 'Indo American School CBSE Faculty',
  },
];

export function downloadChapterNotesDocument(chapter: CBSEChapter) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Indo American School Study Sheet - ${chapter.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 780px; margin: 40px auto; padding: 0 24px; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 2px solid #dbeafe; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { color: #0f2744; font-weight: 700; font-size: 14px; letter-spacing: 0.04em; text-transform: uppercase; }
    h1 { margin: 8px 0 4px; font-size: 26px; color: #0f172a; }
    .meta { color: #64748b; font-size: 14px; }
    h2 { font-size: 18px; color: #0f2744; margin-top: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    ul, ol { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin: 14px 0; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Indo American School · CBSE Offline Study Package</div>
    <h1>${chapter.title}</h1>
    <div class="meta">Class ${chapter.classNumber} · ${chapter.subjectName} · Chapter ${chapter.chapterNumber} · Est. ${chapter.estimatedMinutes} mins</div>
  </div>
  <p><strong>Overview:</strong> ${chapter.summary}</p>
  ${chapter.hindiSummary ? `<div class="box"><strong>हिन्दी सारांश:</strong> ${chapter.hindiSummary}</div>` : ''}
  <h2>Learning Objectives</h2>
  <ul>${chapter.objectives.map((o) => `<li>${o}</li>`).join('')}</ul>
  <h2>Detailed Study Notes</h2>
  <ul>${chapter.studyNotes.map((n) => `<li>${n}</li>`).join('')}</ul>
  <h2>Quick Revision Points</h2>
  <div class="box"><ul>${chapter.revisionPoints.map((r) => `<li>${r}</li>`).join('')}</ul></div>
  <h2>Practice Questions & Solutions</h2>
  <ol>${chapter.practiceQuestions.map((p) => `<li><strong>${p.question}</strong><br/><em>Answer:</em> ${p.answer}</li>`).join('')}</ol>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `IndoAmericanSchool_Class${chapter.classNumber}_${chapter.subjectName.replace(/\s+/g, '_')}_Ch${chapter.chapterNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

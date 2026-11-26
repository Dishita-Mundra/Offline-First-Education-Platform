import type { CBSEChapter, QuizQuestion } from '../types/curriculum';

export interface RawTopicBlueprint {
  title: string;
  topics: string[];
  summary: string;
  objectives: string[];
  studyNotes: string[];
  revisionPoints: string[];
  hindiSummary?: string;
  practiceQuestions: { question: string; answer: string }[];
  quizQuestions: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  }[];
  diagramType: CBSEChapter['conceptDiagramType'];
}

export function buildChapters(
  classNumber: number,
  subjectId: string,
  subjectName: string,
  rawList: RawTopicBlueprint[]
): CBSEChapter[] {
  return rawList.map((raw, idx) => {
    const chNum = idx + 1;
    const chId = `c${classNumber}-${subjectId}-ch${chNum}`;
    const quizQuestions: QuizQuestion[] = raw.quizQuestions.map((q, qIdx) => ({
      id: `${chId}-q${qIdx + 1}`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));

    return {
      id: chId,
      classNumber,
      subjectId,
      subjectName,
      chapterNumber: chNum,
      title: raw.title,
      topics: raw.topics,
      summary: raw.summary,
      objectives: raw.objectives,
      studyNotes: raw.studyNotes,
      revisionPoints: raw.revisionPoints,
      hindiSummary: raw.hindiSummary,
      practiceQuestions: raw.practiceQuestions,
      quizQuestions,
      estimatedMinutes: 15 + idx * 5,
      conceptDiagramType: raw.diagramType,
    };
  });
}

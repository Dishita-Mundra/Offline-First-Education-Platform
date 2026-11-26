import { useState } from 'react';
import type { CBSEChapter } from '../types/curriculum';

interface ConceptVisualizerProps {
  chapter: CBSEChapter;
}

export function ConceptVisualizer({ chapter }: ConceptVisualizerProps) {
  const [numberValue, setNumberValue] = useState(4);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedShape, setSelectedShape] = useState<'triangle' | 'rectangle' | 'circle'>('triangle');

  const type = chapter.conceptDiagramType;

  if (type === 'math-numberline') {
    const marks = Array.from({ length: 13 }, (_, i) => i - 4);
    return (
      <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Interactive Number Explorer</p>
            <h4 className="text-base font-bold text-slate-900">{chapter.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNumberValue((v) => Math.max(-4, v - 1))}
              className="rounded-lg border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              - 1
            </button>
            <span className="font-mono text-sm font-bold text-indigo-700 tabular-nums px-2">
              n = {numberValue}
            </span>
            <button
              type="button"
              onClick={() => setNumberValue((v) => Math.min(8, v + 1))}
              className="rounded-lg border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-sky-50 cursor-pointer"
            >
              + 1
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[480px] flex items-center justify-between relative pt-6 pb-2 px-3">
            <div className="absolute left-4 right-4 top-9 h-0.5 bg-sky-200" />
            {marks.map((m) => {
              const active = m === numberValue;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setNumberValue(m)}
                  className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    className={`h-4 w-4 rounded-full border-2 transition-transform ${
                      active
                        ? 'scale-125 bg-indigo-600 border-indigo-600 shadow-sm'
                        : 'bg-white border-sky-400 group-hover:border-indigo-400'
                    }`}
                  />
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      active ? 'font-bold text-indigo-700' : 'text-slate-600'
                    }`}
                  >
                    {m}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Selected value <span className="font-mono font-semibold text-slate-900">{numberValue}</span> · Successor:{' '}
          <span className="font-mono font-semibold text-emerald-700">{numberValue + 1}</span> · Predecessor:{' '}
          <span className="font-mono font-semibold text-amber-700">{numberValue - 1}</span> · Square:{' '}
          <span className="font-mono font-semibold text-indigo-700">{numberValue * numberValue}</span>
        </p>
      </div>
    );
  }

  if (type === 'geometry-shapes') {
    const shapeInfo = {
      triangle: { name: 'Right Triangle', sides: 3, angles: '180° sum', formula: 'Area = ½ × base × height' },
      rectangle: { name: 'Rectangle', sides: 4, angles: '90° each (360° sum)', formula: 'Area = length × breadth' },
      circle: { name: 'Circle', sides: 0, angles: '360° central angle', formula: 'Area = πr² · Circumference = 2πr' },
    }[selectedShape];

    return (
      <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/70 via-white to-sky-50/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Interactive Geometry Sandbox</p>
            <h4 className="text-base font-bold text-slate-900">{chapter.title}</h4>
          </div>
          <div className="flex gap-1.5">
            {(['triangle', 'rectangle', 'circle'] as const).map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => setSelectedShape(shape)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-colors ${
                  selectedShape === shape
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-violet-50'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center justify-center rounded-xl bg-white border border-violet-100 p-4 h-36">
            <svg viewBox="0 0 160 110" className="h-28 w-40">
              {selectedShape === 'triangle' && (
                <polygon points="25,90 135,90 25,20" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="3" />
              )}
              {selectedShape === 'rectangle' && (
                <rect x="20" y="20" width="120" height="70" rx="4" fill="#D1FAE5" stroke="#059669" strokeWidth="3" />
              )}
              {selectedShape === 'circle' && (
                <circle cx="80" cy="55" r="38" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
              )}
            </svg>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="font-bold text-slate-900">{shapeInfo.name}</p>
            <p className="text-slate-600">Sides: <span className="font-mono font-semibold text-slate-800">{shapeInfo.sides}</span></p>
            <p className="text-slate-600">Angles: <span className="font-semibold text-slate-800">{shapeInfo.angles}</span></p>
            <p className="text-indigo-700 font-mono text-xs bg-indigo-50 px-2.5 py-1.5 rounded-lg inline-block">{shapeInfo.formula}</p>
          </div>
        </div>
      </div>
    );
  }

  const steps = chapter.topics.slice(0, 4);
  const currentStep = steps[stepIdx] ?? chapter.title;
  const currentNote = chapter.studyNotes[stepIdx] ?? chapter.summary;

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Interactive Concept Flow
          </p>
          <h4 className="text-base font-bold text-slate-900">{chapter.title}</h4>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums">
          Step {stepIdx + 1} / {Math.max(steps.length, 1)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {steps.map((topic, idx) => (
          <button
            key={topic}
            type="button"
            onClick={() => setStepIdx(idx)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              stepIdx === idx
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
            }`}
          >
            {idx + 1}. {topic}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-emerald-100 p-4">
        <p className="text-xs font-semibold text-emerald-700 mb-1">{currentStep}</p>
        <p className="text-sm text-slate-700 leading-relaxed">{currentNote}</p>
      </div>
    </div>
  );
}

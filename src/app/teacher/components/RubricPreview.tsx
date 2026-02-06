import { useState } from 'react';
import { RubricSection } from '@/app/components/review/RubricSection';
import type { RubricSectionData } from '@/app/components/review/RubricSection';
import type { CriterionScore } from '@/app/components/review/RubricCriterion';
import type { RubricData } from '../TeacherRubricsPage';

/**
 * RubricPreview - Предпросмотр рубрики
 * 
 * Отображает рубрику в том виде, как она будет выглядеть
 * для студентов в форме рецензирования
 */

interface RubricPreviewProps {
  rubric: RubricData;
}

export function RubricPreview({ rubric }: RubricPreviewProps) {
  const [scores, setScores] = useState<CriterionScore[]>([]);

  // Convert RubricData to RubricSectionData format
  const section: RubricSectionData = {
    id: rubric.id,
    name: rubric.name,
    description: rubric.description,
    criteria: rubric.criteria.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      maxScore: c.maxScore,
      required: c.required,
      commentRequired: c.commentRequired,
      minCommentLength: c.minCommentLength,
    })),
  };

  const handleScoreChange = (criterionId: string, score: CriterionScore) => {
    setScores((prev) => {
      const existing = prev.find((s) => s.criterionId === criterionId);
      if (existing) {
        return prev.map((s) => (s.criterionId === criterionId ? score : s));
      }
      return [...prev, score];
    });
  };

  // Calculate stats
  const totalPossible = rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const totalScored = scores.reduce((sum, s) => sum + (s.score || 0), 0);
  const completedCount = scores.filter((s) => s.score !== null).length;
  const totalCriteria = rubric.criteria.length;
  const requiredCount = rubric.criteria.filter((c) => c.required).length;
  const completedRequiredCount = scores.filter(
    (s) => s.score !== null && rubric.criteria.find((c) => c.id === s.criterionId)?.required
  ).length;

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Info Banner */}
      <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6">
        <h3 className="text-[16px] font-medium text-[#21214f] mb-2">
          Режим предпросмотра
        </h3>
        <p className="text-[14px] text-[#767692]">
          Так будет выглядеть эта рубрика для студентов при оценивании работ. Вы можете
          взаимодействовать с формой, чтобы проверить, как она работает.
        </p>
      </div>

      {/* Rubric Metadata */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              {rubric.name}
            </h2>
            <p className="text-[15px] text-[#767692] leading-[1.5]">
              {rubric.description}
            </p>
          </div>
          <div className="ml-4">
            <span className="inline-block px-3 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[8px] text-[13px] font-medium">
              {rubric.taskType === 'text' && 'Текст'}
              {rubric.taskType === 'code' && 'Код'}
              {rubric.taskType === 'project' && 'Проект'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {rubric.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {rubric.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[#e9f5ff] text-[#5b8def] rounded-[6px] text-[12px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {completedCount}/{totalCriteria}
            </p>
            <p className="text-[12px] text-[#767692]">Оценено критериев</p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {completedRequiredCount}/{requiredCount}
            </p>
            <p className="text-[12px] text-[#767692]">Обязательных</p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-[#5b8def]">
              {totalScored}/{totalPossible}
            </p>
            <p className="text-[12px] text-[#767692]">Баллов набрано</p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-[#4caf50]">
              {totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0}%
            </p>
            <p className="text-[12px] text-[#767692]">Процент</p>
          </div>
        </div>
      </div>

      {/* Rubric Section (using existing component) */}
      <RubricSection
        section={section}
        scores={scores}
        onScoreChange={handleScoreChange}
        readonly={false}
      />

      {/* Weights Info (if any criterion has weight) */}
      {rubric.criteria.some((c) => c.weight) && (
        <div className="mt-6 bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[12px] p-4">
          <h4 className="text-[14px] font-medium text-[#21214f] mb-3">
            Весовые коэффициенты
          </h4>
          <div className="space-y-2">
            {rubric.criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between">
                <span className="text-[13px] text-[#767692]">{criterion.name}</span>
                <span className="text-[13px] font-medium text-[#21214f]">
                  {criterion.weight ? `${criterion.weight}%` : 'Не указан'}
                </span>
              </div>
            ))}
          </div>
          {rubric.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) !== 100 && (
            <p className="text-[12px] text-[#f57c00] mt-3 flex items-center gap-1">
              <span>⚠️</span>
              Сумма весов не равна 100%. Веса используются для информации, итоговая оценка
              рассчитывается как сумма баллов.
            </p>
          )}
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setScores([])}
          className="px-4 py-2 border-2 border-[#e6e8ee] text-[#767692] rounded-[12px] hover:border-[#a0b8f1] hover:text-[#21214f] transition-colors text-[14px]"
        >
          Сбросить оценки
        </button>
      </div>
    </div>
  );
}

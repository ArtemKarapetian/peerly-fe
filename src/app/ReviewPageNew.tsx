import { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import {
  WorkPreviewCard,
  RubricSection,
  ReviewProgress,
} from '@/app/components/review';
import type {
  WorkFile,
  ValidationCheck,
  RubricSectionData,
  CriterionScore,
} from '@/app/components/review';
import { LayoutDebugger } from '@/app/components/LayoutDebugger';
import { Save, Send, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { useReviewStore } from '@/app/stores/reviewStore';
import { SaveStatusIndicator } from '@/app/components/SaveStatusIndicator';
import type { SaveStatus } from '@/app/components/SaveStatusIndicator';
import {
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
} from '@/app/utils/reviewDraft';
import { debounce } from '@/app/utils/debounce';

interface ReviewPageProps {
  reviewId: string;
}

export default function ReviewPage({ reviewId }: ReviewPageProps) {
  const { getReview } = useReviewStore();
  const review = getReview(reviewId);

  // If review not found, show error
  if (!review) {
    return (
      <AppShell title="Рецензия не найдена">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 max-w-[480px] text-center">
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Рецензия не найдена
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5] mb-6">
              Рецензия, которую вы ищете, не существует или была удалена.
            </p>
            <button
              onClick={() => (window.location.hash = '/reviews')}
              className="px-6 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white rounded-[12px] text-[15px] font-medium transition-colors"
            >
              Вернуться к рецензиям
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const courseName = review.courseName;
  const taskTitle = review.taskTitle;
  const courseId = review.courseId;
  const taskId = review.taskId;

  // Work preview data (mock)
  const workFiles: WorkFile[] = [
    { id: 'f1', name: 'landing-v3.zip', size: 2457600, url: '#' },
    { id: 'f2', name: 'screenshots.pdf', size: 512000, url: '#' },
  ];

  const validationChecks: ValidationCheck[] = [
    { id: 'c1', name: 'Проверка на плагиат', status: 'passed', message: 'Совпадений не обнаружено' },
    { id: 'c2', name: 'Линтинг кода', status: 'passed' },
    { id: 'c3', name: 'Формат файлов', status: 'passed' },
  ];

  // Rubric data (mock)
  const rubricSections: RubricSectionData[] = [
    {
      id: 's1',
      name: 'Дизайн и UI',
      description: 'Оценка визуального оформления и пользовательского интерфейса',
      criteria: [
        {
          id: 'c1',
          name: 'Визуальная привлекательность',
          description: 'Насколько привлекателен и профессионален дизайн',
          maxScore: 5,
          required: true,
          commentRequired: false,
        },
        {
          id: 'c2',
          name: 'Адаптивность',
          description: 'Корректное отображение на разных устройствах',
          maxScore: 5,
          required: true,
          commentRequired: true,
          minCommentLength: 20,
        },
        {
          id: 'c3',
          name: 'Типографика',
          description: 'Читаемость текста и использование шрифтов',
          maxScore: 5,
          required: true,
        },
      ],
    },
    {
      id: 's2',
      name: 'Функциональность',
      description: 'Оценка работоспособности и функций',
      criteria: [
        {
          id: 'c4',
          name: 'Корректность работы форм',
          maxScore: 5,
          required: true,
          commentRequired: true,
          minCommentLength: 15,
        },
        {
          id: 'c5',
          name: 'Навигация',
          description: 'Удобство и логичность навигации',
          maxScore: 5,
          required: true,
        },
      ],
    },
    {
      id: 's3',
      name: 'Код',
      description: 'Оценка качества кода',
      criteria: [
        {
          id: 'c6',
          name: 'Чистота кода',
          description: 'Читаемость, структура, комментарии',
          maxScore: 5,
          required: true,
        },
        {
          id: 'c7',
          name: 'Использование технологий',
          maxScore: 5,
          required: false,
        },
      ],
    },
  ];

  const allCriteria = rubricSections.flatMap((section) => section.criteria);
  const requiredCriteria = allCriteria.filter((c) => c.required);

  // State
  const [scores, setScores] = useState<CriterionScore[]>([]);
  const [overallComment, setOverallComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDraftToast, setShowDraftToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | undefined>();
  const [focusedCriterionId, setFocusedCriterionId] = useState<string | null>(null);

  const minOverallCommentLength = 50;
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize scores from draft or defaults
  useEffect(() => {
    const draft = loadDraftFromStorage(courseId, taskId, reviewId);
    
    if (draft) {
      // Restore from draft
      setScores(draft.scores);
      setOverallComment(draft.overallComment);
      setLastSavedTimestamp(draft.lastSaved);
      setShowDraftToast(true);
      setTimeout(() => setShowDraftToast(false), 4000);
    } else {
      // Initialize with empty scores
      const initialScores: CriterionScore[] = allCriteria.map((criterion) => ({
        criterionId: criterion.id,
        score: null,
        comment: '',
      }));
      setScores(initialScores);
    }
  }, [courseId, taskId, reviewId]);

  // Auto-save to localStorage (debounced)
  const debouncedSave = useCallback(
    debounce(() => {
      if (isSubmitted) return;
      
      setSaveStatus('saving');
      const success = saveDraftToStorage(courseId, taskId, reviewId, scores, overallComment);
      
      if (success) {
        const now = Date.now();
        setLastSavedTimestamp(now);
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
        setShowSaveError(true);
        setTimeout(() => setShowSaveError(false), 5000);
      }
    }, 1000),
    [courseId, taskId, reviewId, scores, overallComment, isSubmitted]
  );

  // Trigger auto-save on changes
  useEffect(() => {
    if (scores.length > 0) {
      setSaveStatus('unsaved');
      debouncedSave();
    }
  }, [scores, overallComment, debouncedSave]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (isSubmitted) return;

    saveIntervalRef.current = setInterval(() => {
      const success = saveDraftToStorage(courseId, taskId, reviewId, scores, overallComment);
      if (success) {
        const now = Date.now();
        setLastSavedTimestamp(now);
        setSaveStatus('saved');
      }
    }, 10000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [courseId, taskId, reviewId, scores, overallComment, isSubmitted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return;

      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';

      // If typing in input/textarea, require Alt key
      if (isTyping && !e.altKey) return;

      // Number keys 1-5: set score
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const score = parseInt(e.key, 10);
        
        // Find criterion to score
        let criterionId = focusedCriterionId;
        if (!criterionId) {
          // Use first criterion in view
          const firstCriterion = document.querySelector('[data-criterion-id]');
          criterionId = firstCriterion?.getAttribute('data-criterion-id') || null;
        }

        if (criterionId) {
          const currentScore = scores.find((s) => s.criterionId === criterionId);
          if (currentScore) {
            handleScoreChange(criterionId, { ...currentScore, score });
          }
        }
      }

      // 0: Clear score
      if (e.key === '0') {
        e.preventDefault();
        let criterionId = focusedCriterionId;
        if (!criterionId) {
          const firstCriterion = document.querySelector('[data-criterion-id]');
          criterionId = firstCriterion?.getAttribute('data-criterion-id') || null;
        }

        if (criterionId) {
          const currentScore = scores.find((s) => s.criterionId === criterionId);
          if (currentScore) {
            handleScoreChange(criterionId, { ...currentScore, score: null });
          }
        }
      }

      // Arrow keys: Navigate between criteria
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const allCriteriaElements = Array.from(
          document.querySelectorAll('[data-criterion-id]')
        ) as HTMLElement[];

        if (allCriteriaElements.length === 0) return;

        let currentIndex = -1;
        if (focusedCriterionId) {
          currentIndex = allCriteriaElements.findIndex(
            (el) => el.getAttribute('data-criterion-id') === focusedCriterionId
          );
        }

        let nextIndex: number;
        if (e.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : allCriteriaElements.length - 1;
        } else {
          nextIndex = currentIndex < allCriteriaElements.length - 1 ? currentIndex + 1 : 0;
        }

        const nextElement = allCriteriaElements[nextIndex];
        const nextCriterionId = nextElement.getAttribute('data-criterion-id');
        if (nextCriterionId) {
          setFocusedCriterionId(nextCriterionId);
          nextElement.focus();
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scores, focusedCriterionId, isSubmitted]);

  // Handle score change
  const handleScoreChange = (criterionId: string, newScore: CriterionScore) => {
    setScores((prev) => prev.map((s) => (s.criterionId === criterionId ? newScore : s)));
    
    // Clear error for this criterion
    if (errors[criterionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[criterionId];
        return newErrors;
      });
    }
  };

  // Calculate progress
  const filledCriteria = scores.filter((s) => s.score !== null).length;

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    requiredCriteria.forEach((criterion) => {
      const score = scores.find((s) => s.criterionId === criterion.id);
      if (!score || score.score === null) {
        newErrors[criterion.id] = 'Обязательное поле';
      }

      if (criterion.commentRequired && (!score?.comment || score.comment.trim() === '')) {
        newErrors[criterion.id] = 'Комментарий обязателен';
      }

      if (
        criterion.minCommentLength &&
        score?.comment &&
        score.comment.length < criterion.minCommentLength
      ) {
        newErrors[criterion.id] = `Минимум ${criterion.minCommentLength} символов`;
      }
    });

    if (overallComment.length < minOverallCommentLength) {
      newErrors['overall'] = `Минимум ${minOverallCommentLength} символов`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Can submit?
  const canSubmit = () => {
    const allRequiredFilled = requiredCriteria.every((criterion) => {
      const score = scores.find((s) => s.criterionId === criterion.id);
      return score && score.score !== null;
    });

    const commentValid = overallComment.length >= minOverallCommentLength;
    return allRequiredFilled && commentValid && !isSubmitted;
  };

  // Submit review
  const handleSubmit = () => {
    if (!validate()) {
      const firstErrorElement = document.querySelector('[data-error]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setShowSuccessToast(true);
    
    // Clear draft after successful submit
    clearDraftFromStorage(courseId, taskId, reviewId);
    
    setTimeout(() => setShowSuccessToast(false), 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset draft
  const handleResetDraft = () => {
    setShowResetModal(true);
  };

  const confirmResetDraft = () => {
    clearDraftFromStorage(courseId, taskId, reviewId);
    
    // Reset to default state
    const initialScores: CriterionScore[] = allCriteria.map((criterion) => ({
      criterionId: criterion.id,
      score: null,
      comment: '',
    }));
    setScores(initialScores);
    setOverallComment('');
    setErrors({});
    setSaveStatus('saved');
    setShowResetModal(false);
  };

  // Handlers
  const handleDownloadFile = (fileId: string) => {
    alert(`Скачивание файла ${fileId}`);
  };

  const handleOpenInNewWindow = () => {
    window.open('#', '_blank');
  };

  return (
    <AppShell title="Рецензия">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Breadcrumbs
          items={['Курсы', courseName, taskTitle, 'Рецензия']}
          onItemClick={(index) => {
            if (index === 0) window.location.hash = '/courses';
            else if (index === 1) window.location.hash = `/course/${courseId}`;
            else if (index === 2) window.location.hash = `/task/${taskId}`;
          }}
        />
        
        <div className="flex items-center gap-3">
          <SaveStatusIndicator status={saveStatus} lastSavedTimestamp={lastSavedTimestamp} />
          
          {!isSubmitted && (
            <button
              onClick={handleResetDraft}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium text-[#767692] hover:text-[#21214f] hover:bg-[#f9f9f9] transition-colors"
              title="Сбросить черновик"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden tablet:inline">Сбросить</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Error Banner */}
      {showSaveError && (
        <div className="bg-[#fff5f5] border-2 border-[#ffb8b8] rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#d4183d] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
              Не удалось сохранить локально
            </h3>
            <p className="text-[14px] text-[#4b4963]">
              Проверьте настройки браузера. Ваши изменения могут быть не сохранены.
            </p>
          </div>
        </div>
      )}

      {/* Draft Restored Toast */}
      {showDraftToast && (
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#5b8def] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
              Черновик восстановлен
            </h3>
            <p className="text-[14px] text-[#4b4963]">
              Продолжайте работу с того места, где остановились.
            </p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {isSubmitted && (
        <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[#4caf50] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
              Рецензия отправлена
            </h3>
            <p className="text-[14px] text-[#4b4963]">
              Ваша рецензия успешно отправлена. Автор работы получит уведомление.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="desktop:grid desktop:grid-cols-[1fr_360px] desktop:gap-6 desktop:items-start">
        <div className="space-y-6">
          <WorkPreviewCard
            files={workFiles}
            validationChecks={validationChecks}
            onDownloadFile={handleDownloadFile}
            onOpenInNewWindow={handleOpenInNewWindow}
          />

          {rubricSections.map((section) => (
            <RubricSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              errors={errors}
              readonly={isSubmitted}
              onCriterionFocus={setFocusedCriterionId}
            />
          ))}

          <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-4 desktop:p-6">
            <h3 className="text-[18px] desktop:text-[20px] font-medium text-[#21214f] tracking-[-0.5px] mb-4">
              Общий комментарий
              <span className="text-[#d4183d] ml-1">*</span>
            </h3>
            <textarea
              value={overallComment}
              onChange={(e) => {
                setOverallComment(e.target.value);
                if (errors['overall']) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors['overall'];
                    return newErrors;
                  });
                }
              }}
              disabled={isSubmitted}
              rows={6}
              placeholder="Напишите общий комментарий о работе. Укажите сильные стороны и области для улучшения."
              className={`
                w-full px-4 py-3 border-2 rounded-[12px] text-[14px] text-[#21214f] 
                placeholder:text-[#b4b4b4] transition-colors resize-none
                ${errors['overall'] ? 'border-[#d4183d] bg-[#fff5f5]' : 'border-[#e6e8ee] focus:border-[#a0b8f1]'}
                ${isSubmitted ? 'bg-[#f9f9f9] cursor-not-allowed' : 'bg-white'}
              `}
            />
            <div className="flex items-center justify-between mt-2">
              <p
                className={`text-[13px] ${
                  overallComment.length >= minOverallCommentLength
                    ? 'text-[#4caf50]'
                    : errors['overall']
                    ? 'text-[#d4183d]'
                    : 'text-[#767692]'
                }`}
              >
                {overallComment.length} / {minOverallCommentLength} символов
              </p>
              {errors['overall'] && (
                <p className="text-[13px] text-[#d4183d]">{errors['overall']}</p>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Actions */}
          {!isSubmitted && (
            <div className="desktop:hidden bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[16px] p-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[12px] text-[15px] font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Отправить рецензию</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="hidden desktop:block desktop:sticky desktop:top-6 space-y-4">
          <ReviewProgress
            filledCriteria={filledCriteria}
            totalCriteria={requiredCriteria.length}
            overallCommentLength={overallComment.length}
            minOverallCommentLength={minOverallCommentLength}
            tips={[
              'Будьте конструктивны в критике',
              'Укажите конкретные примеры',
              'Предложите способы улучшения',
            ]}
          />

          {!isSubmitted && (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[12px] text-[15px] font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Отправить рецензию</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="desktop:hidden mt-6">
        <ReviewProgress
          filledCriteria={filledCriteria}
          totalCriteria={requiredCriteria.length}
          overallCommentLength={overallComment.length}
          minOverallCommentLength={minOverallCommentLength}
          tips={[
            'Будьте конструктивны в критике',
            'Укажите конкретные примеры',
            'Предложите способы улучшения',
          ]}
        />
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full">
            <h3 className="text-[20px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Отправить рецензию?
            </h3>
            <p className="text-[15px] text-[#767692] leading-[1.5] mb-6">
              После отправки рецензию нельзя будет изменить. Убедитесь, что вы проверили все критерии и оставили полезные комментарии.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-[#f9f9f9] hover:bg-[#e6e8ee] text-[#21214f] rounded-[12px] text-[15px] font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white rounded-[12px] text-[15px] font-medium transition-colors"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Draft Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full">
            <h3 className="text-[20px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Сбросить черновик?
            </h3>
            <p className="text-[15px] text-[#767692] leading-[1.5] mb-6">
              Все несохранённые изменения будут удалены. Это действие нельзя отменить.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-3 bg-[#f9f9f9] hover:bg-[#e6e8ee] text-[#21214f] rounded-[12px] text-[15px] font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={confirmResetDraft}
                className="flex-1 px-4 py-3 bg-[#d4183d] hover:bg-[#c01030] text-white rounded-[12px] text-[15px] font-medium transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 bg-[#4caf50] text-white rounded-[12px] px-4 py-3 shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span className="text-[14px] font-medium">Рецензия отправлена!</span>
        </div>
      )}

      <LayoutDebugger />
    </AppShell>
  );
}
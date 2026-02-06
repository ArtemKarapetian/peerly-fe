import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { StepBasics } from './components/assignment-wizard/StepBasics';
import { StepDeadlines } from './components/assignment-wizard/StepDeadlines';
import { StepRubric } from './components/assignment-wizard/StepRubric';
import { StepPeerSession } from './components/assignment-wizard/StepPeerSession';
import { StepPlugins } from './components/assignment-wizard/StepPlugins';
import { StepPublish } from './components/assignment-wizard/StepPublish';

/**
 * TeacherCreateAssignmentPage - Мастер создания задания
 * 
 * 6-шаговый визард:
 * 1. Основная информация
 * 2. Дедлайны
 * 3. Рубрика
 * 4. Настройки peer review
 * 5. Плагины и проверки
 * 6. Публикация
 */

export interface AssignmentFormData {
  // Step 1: Basics
  courseId: string;
  title: string;
  description: string;
  taskType: 'text' | 'code' | 'project' | 'files';
  attachments: Array<{ id: string; name: string; url: string; size: number }>;
  
  // Step 2: Deadlines
  submissionDeadline: Date | null;
  reviewDeadline: Date | null;
  latePolicy: 'soft' | 'hard';
  latePenalty: number; // percentage per day
  timezone: string;
  
  // Step 3: Rubric
  rubricId: string | null;
  rubricName?: string;
  
  // Step 4: Peer Session
  reviewsPerSubmission: number;
  distributionMode: 'random' | 'skill-based' | 'manual';
  anonymityMode: 'full' | 'partial' | 'none';
  allowReassignment: boolean;
  reassignmentDeadline: Date | null;
  
  // Step 5: Plugins
  enablePlagiarismCheck: boolean;
  plagiarismThreshold: number;
  enableLinter: boolean;
  linterConfig: string;
  enableFormatCheck: boolean;
  formatRules: string[];
  enableAnonymization: boolean;
  
  // Metadata
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const STEPS = [
  { id: 1, name: 'Основное', shortName: 'Основное' },
  { id: 2, name: 'Дедлайны', shortName: 'Дедлайны' },
  { id: 3, name: 'Рубрика', shortName: 'Рубрика' },
  { id: 4, name: 'Peer Review', shortName: 'Peer Review' },
  { id: 5, name: 'Плагины', shortName: 'Плагины' },
  { id: 6, name: 'Публикация', shortName: 'Публикация' },
];

const STORAGE_KEY = 'peerly_assignment_draft';

const getInitialFormData = (): AssignmentFormData => {
  // Try to load draft from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return {
        ...parsed,
        submissionDeadline: parsed.submissionDeadline ? new Date(parsed.submissionDeadline) : null,
        reviewDeadline: parsed.reviewDeadline ? new Date(parsed.reviewDeadline) : null,
        reassignmentDeadline: parsed.reassignmentDeadline ? new Date(parsed.reassignmentDeadline) : null,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (e) {
      console.error('Failed to parse assignment draft', e);
    }
  }

  // Default values
  return {
    courseId: '',
    title: '',
    description: '',
    taskType: 'project',
    attachments: [],
    submissionDeadline: null,
    reviewDeadline: null,
    latePolicy: 'soft',
    latePenalty: 10,
    timezone: 'Europe/Moscow',
    rubricId: null,
    reviewsPerSubmission: 3,
    distributionMode: 'random',
    anonymityMode: 'full',
    allowReassignment: true,
    reassignmentDeadline: null,
    enablePlagiarismCheck: true,
    plagiarismThreshold: 15,
    enableLinter: false,
    linterConfig: '',
    enableFormatCheck: true,
    formatRules: ['pdf', 'docx', 'zip'],
    enableAnonymization: true,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

interface TeacherCreateAssignmentPageProps {
  courseId?: string;
}

export default function TeacherCreateAssignmentPage({ courseId }: TeacherCreateAssignmentPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AssignmentFormData>(() => {
    const initial = getInitialFormData();
    if (courseId) {
      initial.courseId = courseId;
    }
    return initial;
  });

  // Save draft to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<AssignmentFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = (asDraft: boolean) => {
    const finalData = {
      ...formData,
      status: asDraft ? 'draft' : 'published',
      updatedAt: new Date(),
    };

    // Save to localStorage or backend
    console.log('Publishing assignment:', finalData);

    // Clear draft
    localStorage.removeItem(STORAGE_KEY);

    // Navigate to assignment details (mock for now)
    const assignmentId = `a${Date.now()}`;
    window.location.hash = `/teacher/assignment/${assignmentId}`;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.courseId && formData.title.trim().length > 0;
      case 2:
        return formData.submissionDeadline && formData.reviewDeadline;
      case 3:
        return true; // Rubric is optional
      case 4:
        return formData.reviewsPerSubmission >= 1;
      case 5:
        return true; // Plugins are optional
      case 6:
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasics data={formData} onUpdate={updateFormData} />;
      case 2:
        return <StepDeadlines data={formData} onUpdate={updateFormData} />;
      case 3:
        return <StepRubric data={formData} onUpdate={updateFormData} />;
      case 4:
        return <StepPeerSession data={formData} onUpdate={updateFormData} />;
      case 5:
        return <StepPlugins data={formData} onUpdate={updateFormData} />;
      case 6:
        return <StepPublish data={formData} onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  return (
    <AppShell title="Создание задания">
      <Breadcrumbs
        items={['Дашборд препо��авателя', 'Конструктор заданий', 'Новое задание']}
      />

      <div className="mt-6 max-w-[1000px] mx-auto">
        {/* Step Indicator */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all
                      ${
                        currentStep > step.id
                          ? 'bg-[#4caf50] text-white'
                          : currentStep === step.id
                          ? 'bg-[#5b8def] text-white'
                          : 'bg-[#f9f9f9] text-[#767692] border-2 border-[#e6e8ee]'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {/* Step Label */}
                  <span
                    className={`
                      mt-2 text-[12px] desktop:text-[13px] text-center
                      ${currentStep === step.id ? 'text-[#21214f] font-medium' : 'text-[#767692]'}
                    `}
                  >
                    {step.shortName}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-2 transition-all
                      ${currentStep > step.id ? 'bg-[#4caf50]' : 'bg-[#e6e8ee]'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>

            <div className="text-[14px] text-[#767692]">
              Шаг {currentStep} из {STEPS.length}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors disabled:bg-[#d7d7d7] disabled:cursor-not-allowed font-medium"
            >
              Далее
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
import { Clock, Upload, FileText, CheckCircle, AlertCircle, ArrowRight, User, History } from 'lucide-react';
import { useState } from 'react';
import { useReviewStore } from '@/app/stores/reviewStore';

export type TaskStatus = 
  | 'NOT_STARTED' 
  | 'SUBMITTED' 
  | 'PEER_REVIEW' 
  | 'TEACHER_REVIEW' 
  | 'GRADING' 
  | 'GRADED'
  | 'OVERDUE';

interface StatusCardProps {
  status: TaskStatus;
  deadline: string;
  courseId: string;
  taskId: string;
  hasSubmission?: boolean; // Has any submission (draft or final)
  isDraft?: boolean; // Current submission is draft
  allowResubmissions?: boolean; // Allows resubmitting
  onStatusChange?: (status: TaskStatus) => void;
}

export function StatusCard({ status, deadline, courseId, taskId, hasSubmission, isDraft, allowResubmissions, onStatusChange }: StatusCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getStatusInfo = () => {
    switch (status) {
      case 'NOT_STARTED':
        return { 
          label: 'Не начато', 
          color: 'bg-[#e4e4e4]', 
          textColor: 'text-[#4b4963]' 
        };
      case 'SUBMITTED':
        return { 
          label: 'Сдано', 
          color: 'bg-[#b7bdff]', 
          textColor: 'text-[#21214f]' 
        };
      case 'PEER_REVIEW':
        return { 
          label: 'На проверке', 
          color: 'bg-[#b0e9fb]', 
          textColor: 'text-[#21214f]' 
        };
      case 'TEACHER_REVIEW':
        return { 
          label: 'Нужно проверить', 
          color: 'bg-[#ffd4a3]', 
          textColor: 'text-[#21214f]' 
        };
      case 'GRADING':
        return { 
          label: 'Черновик', 
          color: 'bg-[#e6e8ee]', 
          textColor: 'text-[#4b4963]' 
        };
      case 'GRADED':
        return { 
          label: 'Оценено', 
          color: 'bg-[#9cf38d]', 
          textColor: 'text-[#21214f]' 
        };
      case 'OVERDUE':
        return { 
          label: 'Просрочено', 
          color: 'bg-[#ffb8b8]', 
          textColor: 'text-[#21214f]' 
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Peer review assignments (mock data)
  const peerReviewAssignments = [
    {
      id: 1,
      studentName: 'Иванов Иван',
      submitted: true,
      reviewed: false
    },
    {
      id: 2,
      studentName: 'Петрова Мария',
      submitted: true,
      reviewed: false
    }
  ];

  const myWorkReviewProgress = { completed: 1, total: 2 };

  return (
    <div>
      <div className="bg-[#f9f9f9] rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
        <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-[#21214f] mb-4">
          Статус и действия
        </h2>
        
        <div className={`${statusInfo.color} px-4 py-2 rounded-[12px] mb-4 desktop:mb-6 inline-block`}>
          <span className={`text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] ${statusInfo.textColor}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 mb-4 desktop:mb-6 pb-4 border-b border-[#c7c7c7]">
          <Clock className="size-5 text-[#4b4963]" />
          <div>
            <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
              Дедлайн
            </p>
            <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-[#21214f]">
              {deadline}
            </p>
          </div>
        </div>

        {/* Status-specific content */}
        {status === 'NOT_STARTED' && (
          <div>
            <h3 className="text-[16px] desktop:text-[18px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.54px] text-[#21214f] mb-3">
              Сдать работу
            </h3>
            
            <button 
              className="w-full bg-[#3d6bc6] hover:bg-[#2d5bb6] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-white flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                // Navigate to submit page
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
              }}
            >
              <Upload className="size-4" />
              <span>Сдать работу</span>
            </button>

            {/* History link - show if has any submission */}
            {hasSubmission && (
              <button
                onClick={() => {
                  window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
                }}
                className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                <History className="size-4" />
                <span>История версий</span>
              </button>
            )}
          </div>
        )}

        {status === 'SUBMITTED' && (
          <div>
            <div className="bg-[#e9f5ff] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    Работа сдана
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    Ожидайте назначения рецензентов
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="size-4 text-[#4b4963]" />
              <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                essay_final.pdf
              </p>
            </div>

            {allowResubmissions && (
              <button 
                onClick={() => {
                  window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
                }}
                className="w-full bg-white border-2 border-[#d2def8] hover:border-[#a0b8f1] hover:bg-[#f9f9f9] transition-colors py-2 desktop:py-3 rounded-[12px] text-[13px] desktop:text-[14px] font-medium text-[#21214f] mb-3"
              >
                Загрузить новую версию
              </button>
            )}

            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>История версий</span>
            </button>
          </div>
        )}

        {status === 'PEER_REVIEW' && (
          <div>
            {/* Your work being reviewed */}
            <div className="mb-6">
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-3">
                Вашу работу проверяют
              </h3>
              
              <div className="bg-white rounded-[12px] p-4 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    Прогресс проверки
                  </span>
                  <span className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f]">
                    {myWorkReviewProgress.completed}/{myWorkReviewProgress.total}
                  </span>
                </div>
                
                <div className="w-full bg-[#e4e4e4] rounded-full h-2">
                  <div 
                    className="bg-[#b0e9fb] h-2 rounded-full transition-all"
                    style={{ width: `${(myWorkReviewProgress.completed / myWorkReviewProgress.total) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
                {myWorkReviewProgress.total - myWorkReviewProgress.completed} {myWorkReviewProgress.total - myWorkReviewProgress.completed === 1 ? 'рецензент' : 'рецензента'} ещё не завершили проверку
              </p>
            </div>

            {/* Reviews you need to do */}
            <div>
              <h3 className="text-[15px] desktop:text-[16px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-3">
                Вам нужно проверить
              </h3>
              
              <div className="space-y-2 mb-4">
                {peerReviewAssignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="bg-white rounded-[12px] p-3 border border-[#c7c7c7]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-[#d2def8] flex items-center justify-center">
                          <User className="size-4 text-[#21214f]" />
                        </div>
                        <div>
                          <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] text-[#21214f]">
                            {assignment.studentName}
                          </p>
                          <p className="text-[11px] desktop:text-[12px] font-['Work_Sans:Regular',sans-serif] text-[#767692]">
                            {assignment.reviewed ? 'Проверено' : 'Ожидает проверки'}
                          </p>
                        </div>
                      </div>
                      
                      {assignment.reviewed ? (
                        <CheckCircle className="size-5 text-[#9cf38d]" />
                      ) : (
                        <AlertCircle className="size-5 text-[#ffb8b8]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  // Navigate to reviews inbox
                  window.location.hash = '/reviews';
                }}
                className="w-full bg-[#d2def8] hover:bg-[#b7bdff] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] flex items-center justify-center gap-2"
              >
                Начать проверку
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {status === 'TEACHER_REVIEW' && (
          <div className="bg-[#e9f5ff] rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                  Взаимная проверка завершена
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                  Преподаватель проверяет вашу работу и рецензии
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'GRADING' && (
          <div>
            <div className="bg-[#fff8e1] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-[#f57c00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    Черновик сохранён
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    Не забудьте сдать финальную версию до дедлайна
                  </p>
                </div>
              </div>
            </div>

            <button 
              className="w-full bg-[#3d6bc6] hover:bg-[#2d5bb6] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-medium text-white flex items-center justify-center gap-2 mb-3"
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
              }}
            >
              <Upload className="size-4" />
              <span>Продолжить работу</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submissions`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="size-4" />
              <span>История версий</span>
            </button>
          </div>
        )}

        {status === 'GRADED' && (
          <div>
            <div className="bg-[#e9f9e6] rounded-[12px] p-4 mb-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                    Оценка выставлена
                  </p>
                  <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                    Вы получили 85 баллов из 100
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                window.location.hash = '/reviews/received';
              }}
              className="w-full bg-[#d2def8] hover:bg-[#b7bdff] transition-colors py-3 desktop:py-4 rounded-[12px] text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] text-[#21214f] mb-3"
            >
              Посмотреть отзыв
            </button>

            <button 
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/appeal`;
              }}
              className="w-full text-center text-[13px] text-[#5b8def] hover:text-[#3d6bc6] font-medium py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="size-4" />
              <span>Запросить пересмотр оценки</span>
            </button>
          </div>
        )}

        {status === 'OVERDUE' && (
          <div className="bg-[#ffe9e9] rounded-[12px] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-[#21214f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] desktop:text-[14px] font-['Work_Sans:Medium',sans-serif] text-[#21214f] mb-1">
                  Срок сдачи истёк
                </p>
                <p className="text-[12px] desktop:text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#4b4963]">
                  Обратитесь к преподавателю для получения индивидуального дедлайна
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo status selector (remove in production) */}
      {onStatusChange && (
        <div className="bg-white border border-[#c7c7c7] rounded-[12px] p-4">
          <p className="text-[12px] font-['Work_Sans:Medium',sans-serif] text-[#767692] mb-2">
            ДЕМО: Выберите статус
          </p>
          <select 
            value={status} 
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 bg-white border border-[#c7c7c7] rounded-[8px] text-[13px] font-['Work_Sans:Regular',sans-serif] text-[#21214f]"
          >
            <option value="NOT_STARTED">Не начато</option>
            <option value="SUBMITTED">Сдана работа</option>
            <option value="PEER_REVIEW">Взаимная проверка</option>
            <option value="TEACHER_REVIEW">Проверка преподавателем</option>
            <option value="GRADING">Выставление оценок</option>
            <option value="GRADED">Оценки выставлены</option>
            <option value="OVERDUE">Просрочено</option>
          </select>
        </div>
      )}
    </div>
  );
}
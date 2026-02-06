import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { TaskHeader } from '@/app/components/TaskHeader';
import { TaskDescription } from '@/app/components/TaskDescription';
import { TaskRequirements } from '@/app/components/TaskRequirements';
import { TaskMaterials } from '@/app/components/TaskMaterials';
import { TaskQuestionsComments } from '@/app/components/TaskQuestionsComments';
import { StatusCard, TaskStatus } from '@/app/components/StatusCard';
import { LayoutDebugger } from '@/app/components/LayoutDebugger';
import { getExtensionForStudent, getExtensionStatusLabel } from '@/app/utils/extensions';
import { useAuth } from '@/app/contexts/AuthContext';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskPageProps {
  taskId?: string | null;
}

export default function TaskPage({ taskId = '1' }: TaskPageProps) {
  const { user } = useAuth();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('NOT_STARTED');
  const [extension, setExtension] = useState(getExtensionForStudent(taskId || '1', user?.id || '1'));

  const taskTitle = `Задание ${taskId || '1'}`;
  const courseId = '1'; // Mock course ID

  useEffect(() => {
    // Reload extension info when page loads
    setExtension(getExtensionForStudent(taskId || '1', user?.id || '1'));
  }, [taskId, user?.id]);

  const getStatusColor = () => {
    switch (taskStatus) {
      case 'NOT_STARTED':
        return 'bg-[#e4e4e4]';
      case 'SUBMITTED':
        return 'bg-[#b7bdff]';
      case 'PEER_REVIEW':
        return 'bg-[#b0e9fb]';
      case 'TEACHER_REVIEW':
        return 'bg-[#b7bdff]';
      case 'GRADING':
        return 'bg-[#b7bdff]';
      case 'GRADED':
        return 'bg-[#9cf38d]';
      case 'OVERDUE':
        return 'bg-[#ffb8b8]';
    }
  };

  const getStatusLabel = () => {
    switch (taskStatus) {
      case 'NOT_STARTED':
        return 'Не начато';
      case 'SUBMITTED':
        return 'Сдана работа';
      case 'PEER_REVIEW':
        return 'Взаимная проверка';
      case 'TEACHER_REVIEW':
        return 'Проверка преподавателем';
      case 'GRADING':
        return 'Выставление оценок';
      case 'GRADED':
        return 'Оценки выставлены';
      case 'OVERDUE':
        return 'Просрочено';
    }
  };

  const formatExtensionDeadline = (deadline?: string) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showExtensionBanner = extension && (extension.status === 'approved' || extension.status === 'manual');
  const showRequestedBanner = extension && extension.status === 'requested';
  const canRequestExtension = !extension || extension.status === 'denied';

  return (
    <AppShell title={taskTitle}>
      {/* Breadcrumbs - стандартизированная навигация: Курсы → Название курса → Задание */}
      <Breadcrumbs 
        items={['Курсы', 'Веб-программирование', taskTitle]} 
        onItemClick={(index) => {
          if (index === 0) {
            // Клик на "Курсы" - вернуться к списку курсов
            window.location.hash = '/courses';
          } else if (index === 1) {
            // Клик на "Веб-программирование" - вернуться к деталям курса
            window.location.hash = `/course/${courseId}`;
          }
        }}
      />
      
      {/* Extension Banner - Approved/Manual */}
      {showExtensionBanner && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[12px] p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">
                Ваш дедлайн продлён
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                {extension.submissionDeadlineOverride && (
                  <>Новый дедлайн сдачи: <strong>{formatExtensionDeadline(extension.submissionDeadlineOverride)}</strong></>
                )}
                {extension.type === 'both' && extension.reviewDeadlineOverride && <br />}
                {extension.reviewDeadlineOverride && (
                  <>Новый дедлайн проверки: <strong>{formatExtensionDeadline(extension.reviewDeadlineOverride)}</strong></>
                )}
              </p>
              {extension.reason && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Причина: {extension.reason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extension Banner - Requested */}
      {showRequestedBanner && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[12px] p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                Запрос на продление ожидает рассмотрения
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Ваш запрос на продление дедлайна отправлен преподавателю. Вы получите уведомление, когда он будет рассмотрен.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Page Header - H1 после breadcrumbs */}
      <TaskHeader
        title={taskTitle}
        courseName="Название курса"
        teacher="Преподаватель"
        deadline="31 января 2026"
        points={100}
        type="Индивидуальное с взаимопроверкой"
        status={getStatusLabel()}
        statusColor={getStatusColor()}
        extensionInfo={showExtensionBanner ? {
          isExtended: true,
          newDeadline: formatExtensionDeadline(
            extension.submissionDeadlineOverride || extension.reviewDeadlineOverride
          )
        } : undefined}
      />

      {/* Двухколоночный layout для Desktop с фиксированным right rail */}
      {/* 
        RESPONSIVE GRID LAYOUT:
        
        Desktop (≥1200px):
        ┌────────────────────────────────────┬──────────────────┐
        │ Main Content (1fr)                 │ Right Rail       │
        │                                    │ 360-420px fixed  │
        │ • Описание                         │ • Статус (sticky)│
        │ • Требования                       │ • Комментарии    │
        │ • Материалы                        │                  │
        └────────────────────────────────────┴──────────────────┘
        Gap: 32px between columns
        
        Tablet (800-1199px) & Mobile (<800px):
        ┌──────────────────────────────────────────┐
        │ Single Column (1fr)                      │
        │ • Статус                                 │
        │ • Описание                               │
        │ • Требования                             │
        │ • Материалы                              │
        │ • Комментарии                            │
        └──────────────────────────────────────────┘
        Gap: 16px between items
      */}
      
      {/* StatusCard на Tablet/Mobile - показываем вверху */}
      <div className="hide-on-desktop mb-4">
        <StatusCard 
          status={taskStatus} 
          deadline="31 января 2026, 23:59"
          courseId={courseId}
          taskId={taskId || '1'}
          hasSubmission={false}
          isDraft={false}
          allowResubmissions={true}
          onStatusChange={setTaskStatus}
        />
        {canRequestExtension && (
          <a
            href={`#/courses/${courseId}/tasks/${taskId}/extension-request`}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <Clock className="w-4 h-4" />
            Запросить продление дедлайна
          </a>
        )}
      </div>

      <div className="task-layout">
        {/* Левая колонка: основной контент задания */}
        <div className="w-full min-w-0 flex flex-col task-content-spacing">
          <TaskDescription />
          <TaskRequirements />
          <TaskMaterials />
          {/* На Tablet/Mobile (<1200px): Комментарии внизу основного контента */}
          <div className="hide-on-desktop">
            <TaskQuestionsComments />
          </div>
        </div>

        {/* Правая колонка: sidebar со статусом и комментариями (только Desktop) */}
        <div className="w-full min-w-0 flex flex-col task-content-spacing hide-below-desktop">
          {/* Статус и действия - STICKY на Desktop (≥1200px) */}
          <div className="task-sidebar-sticky">
            <StatusCard 
              status={taskStatus} 
              deadline="31 января 2026, 23:59"
              courseId={courseId}
              taskId={taskId || '1'}
              hasSubmission={false}
              isDraft={false}
              allowResubmissions={true}
              onStatusChange={setTaskStatus}
            />
            {canRequestExtension && (
              <a
                href={`#/courses/${courseId}/tasks/${taskId}/extension-request`}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
              >
                <Clock className="w-4 h-4" />
                Запросить продление
              </a>
            )}
          </div>
          {/* Комментарии и вопросы - на Desktop (≥1200px) в sidebar */}
          <TaskQuestionsComments />
        </div>
      </div>

      {/* Layout Debugger (remove in production) */}
      <LayoutDebugger />
    </AppShell>
  );
}

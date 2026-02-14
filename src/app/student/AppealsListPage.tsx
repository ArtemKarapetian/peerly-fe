import { useState } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ROUTES } from '@/app/routes';
import {
  AlertCircle, X, Calendar, MessageSquare, CheckCircle, 
  Clock, FileText, User
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  getStudentAppeals, 
  Appeal, 
  AppealStatus,
  getReasonLabel, 
  getStatusLabel, 
  getStatusColor 
} from '@/app/utils/appeals';

/**
 * AppealsListPage - Student Appeals List
 * 
 * Shows all appeals submitted by the student, grouped by status
 */

export default function AppealsListPage() {
  const { user } = useAuth();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  const appeals = getStudentAppeals(user?.id || 'student-1');

  // Group appeals by status
  const appealsByStatus: Record<AppealStatus, Appeal[]> = {
    new: appeals.filter(a => a.status === 'new'),
    in_review: appeals.filter(a => a.status === 'in_review'),
    resolved: appeals.filter(a => a.status === 'resolved')
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const StatusSection = ({ status, appeals }: { status: AppealStatus; appeals: Appeal[] }) => {
    if (appeals.length === 0) return null;

    const statusIcons: Record<AppealStatus, React.ElementType> = {
      new: AlertCircle,
      in_review: Clock,
      resolved: CheckCircle
    };

    const Icon = statusIcons[status];

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-[20px] font-medium text-foreground">
            {getStatusLabel(status)}
          </h2>
          <span className="text-[14px] text-muted-foreground">
            ({appeals.length})
          </span>
        </div>

        <div className="space-y-3">
          {appeals.map(appeal => (
            <AppealCard 
              key={appeal.id} 
              appeal={appeal} 
              onClick={() => setSelectedAppeal(appeal)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppShell title="Мои апелляции">
      <Breadcrumbs items={[
        { label: 'Студент', href: ROUTES.dashboard },
        { label: 'Апелляции' }
      ]} />

      <div className="mt-6 max-w-[1000px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-accent rounded-[12px] flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-accent-foreground" />
          </div>
          <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
            Мои апелляции
          </h1>
        </div>
        <p className="text-[16px] text-muted-foreground mb-8">
          Список всех ваших запросов на пересмотр оценок
        </p>

        {appeals.length === 0 ? (
          <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-[18px] font-medium text-foreground mb-2">
              У вас нет апелляций
            </h3>
            <p className="text-[14px] text-muted-foreground mb-6">
              Если вы не согласны с оценкой, вы можете подать апелляцию из страницы задания
            </p>
            <a
              href="#/courses"
              className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
            >
              Перейти к курсам
            </a>
          </div>
        ) : (
          <>
            <StatusSection status="new" appeals={appealsByStatus.new} />
            <StatusSection status="in_review" appeals={appealsByStatus.in_review} />
            <StatusSection status="resolved" appeals={appealsByStatus.resolved} />
          </>
        )}
      </div>

      {/* Appeal Detail Drawer */}
      {selectedAppeal && (
        <AppealDetailDrawer 
          appeal={selectedAppeal} 
          onClose={() => setSelectedAppeal(null)} 
        />
      )}
    </AppShell>
  );
}

/**
 * AppealCard - Individual Appeal Item
 */
function AppealCard({ appeal, onClick }: { appeal: Appeal; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-card border-2 border-border rounded-[12px] p-5 hover:border-accent transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[16px] font-medium text-foreground">
              {appeal.courseName}
            </h3>
            <span className="text-[14px] text-muted-foreground">→</span>
            <span className="text-[14px] text-muted-foreground">
              {appeal.taskName}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(appeal.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{getReasonLabel(appeal.reason)}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-[8px] text-[12px] font-medium uppercase tracking-wide border ${getStatusColor(appeal.status)}`}>
          {getStatusLabel(appeal.status)}
        </span>
      </div>

      {appeal.currentScore !== undefined && (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span>Текущая оценка:</span>
          <span className="font-medium text-foreground">
            {appeal.currentScore} / {appeal.maxScore}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * AppealDetailDrawer - Drawer showing full appeal details
 */
function AppealDetailDrawer({ appeal, onClose }: { appeal: Appeal; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[600px] bg-card z-50 overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b-2 border-border z-10">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-[20px] font-medium text-foreground">
              Детали апелляции
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-[8px] transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-[8px] text-[13px] font-medium uppercase tracking-wide border ${getStatusColor(appeal.status)}`}>
              {getStatusLabel(appeal.status)}
            </span>
          </div>

          {/* Course & Task Info */}
          <div className="bg-muted rounded-[12px] p-4 mb-6">
            <div className="space-y-2">
              <div>
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                  Курс
                </p>
                <p className="text-[15px] font-medium text-foreground">
                  {appeal.courseName}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                  Задание
                </p>
                <p className="text-[15px] font-medium text-foreground">
                  {appeal.taskName}
                </p>
              </div>
            </div>
          </div>

          {/* Score Info */}
          {appeal.currentScore !== undefined && (
            <div className="bg-muted rounded-[12px] p-4 mb-6">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-2">
                Информация об оценке
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-muted-foreground">Текущая оценка</span>
                <span className="text-[20px] font-medium text-foreground">
                  {appeal.currentScore} / {appeal.maxScore}
                </span>
              </div>
              {appeal.reviewCount !== undefined && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[14px] text-muted-foreground">Получено рецензий</span>
                  <span className="text-[16px] font-medium text-foreground">
                    {appeal.reviewCount}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Appeal Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                Причина обращения
              </h3>
            </div>
            <p className="text-[14px] text-foreground bg-muted px-4 py-2 rounded-[8px]">
              {getReasonLabel(appeal.reason)}
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                Описание проблемы
              </h3>
            </div>
            <div className="bg-muted rounded-[12px] p-4">
              <p className="text-[14px] text-foreground whitespace-pre-wrap">
                {appeal.message}
              </p>
            </div>
          </div>

          {/* Attachment */}
          {appeal.attachmentName && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-[16px] font-medium text-foreground">
                  Приложение
                </h3>
              </div>
              <div className="bg-muted rounded-[12px] p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-accent-foreground" />
                <span className="text-[14px] text-foreground font-medium">
                  {appeal.attachmentName}
                </span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-[16px] font-medium text-foreground">
                История
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-[14px] text-foreground font-medium">
                    Апелляция создана
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {new Date(appeal.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {appeal.status !== 'new' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-[14px] text-foreground font-medium">
                      Взята на рассмотрение
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      {new Date(appeal.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teacher Response */}
          {appeal.teacherResponse ? (
            <div className="bg-accent/10 border-2 border-accent rounded-[12px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-accent-foreground" />
                <h3 className="text-[16px] font-medium text-foreground">
                  Ответ преподавателя
                </h3>
              </div>
              <p className="text-[14px] text-foreground mb-3 whitespace-pre-wrap">
                {appeal.teacherResponse.message}
              </p>
              {appeal.teacherResponse.newScore !== undefined && (
                <div className="bg-card rounded-[8px] p-3 mt-3">
                  <p className="text-[13px] text-muted-foreground mb-1">
                    Новая оценка
                  </p>
                  <p className="text-[20px] font-medium text-foreground">
                    {appeal.teacherResponse.newScore} / {appeal.maxScore}
                  </p>
                </div>
              )}
              <p className="text-[12px] text-muted-foreground mt-3">
                {appeal.teacherResponse.respondedBy} • {new Date(appeal.teacherResponse.respondedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ) : (
            <div className="bg-muted rounded-[12px] p-5 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-[14px] text-muted-foreground">
                {appeal.status === 'new' 
                  ? 'Ожидает рассмотрения преподавателем'
                  : 'Преподаватель рассматривает вашу апелляцию'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

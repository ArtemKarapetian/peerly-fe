import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ROUTES } from '@/app/routes';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TeacherExtensionsPage() {
  const extensions = [
    { id: '1', student: 'Иван Петров', course: 'Web Dev', assignment: 'Final Project', requested: '2026-01-20', newDeadline: '2026-01-27', reason: 'Болезнь', status: 'pending' },
    { id: '2', student: 'Мария Сидорова', course: 'Algorithms', assignment: 'Sorting', requested: '2026-01-18', newDeadline: '2026-01-25', reason: 'Семейные обстоятельства', status: 'approved' },
    { id: '3', student: 'Алексей Иванов', course: 'Data Structures', assignment: 'Trees', requested: '2026-01-15', newDeadline: '2026-01-22', reason: 'Технические проблемы', status: 'rejected' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[8px] text-[12px] font-medium"><Clock className="w-4 h-4" />Ожидает</span>;
      case 'approved': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[12px] font-medium"><CheckCircle className="w-4 h-4" />Одобрено</span>;
      case 'rejected': return <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[8px] text-[12px] font-medium"><XCircle className="w-4 h-4" />Отклонено</span>;
      default: return null;
    }
  };

  return (
    <AppShell title="Extensions">
      <Breadcrumbs items={[
        { label: 'Преподаватель', href: ROUTES.teacherDashboard },
        { label: 'Продления' }
      ]} />
      <div className="mt-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Запросы на продление срока</h1>
        <p className="text-[16px] text-[#767692] mb-6">Управление запросами студентов на перенос дедлайнов</p>
        <div className="space-y-4">
          {extensions.map(ext => (
            <div key={ext.id} className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[16px] font-medium text-[#21214f]">{ext.student}</h3>
                  <p className="text-[13px] text-[#767692] mt-0.5">{ext.course} • {ext.assignment}</p>
                </div>
                {getStatusBadge(ext.status)}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 text-[13px]">
                <div>
                  <span className="text-[#767692]">Запрошено: </span>
                  <span className="text-[#21214f] font-medium">{new Date(ext.requested).toLocaleDateString('ru-RU')}</span>
                </div>
                <div>
                  <span className="text-[#767692]">Новый срок: </span>
                  <span className="text-[#21214f] font-medium">{new Date(ext.newDeadline).toLocaleDateString('ru-RU')}</span>
                </div>
                <div>
                  <span className="text-[#767692]">Причина: </span>
                  <span className="text-[#21214f] font-medium">{ext.reason}</span>
                </div>
              </div>
              {ext.status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-[#e6e8ee]">
                  <button className="px-3 py-1.5 bg-[#4caf50] text-white rounded-[8px] hover:bg-[#45a049] text-[13px] font-medium transition-colors">Одобрить</button>
                  <button className="px-3 py-1.5 bg-[#d4183d] text-white rounded-[8px] hover:bg-[#b71c2c] text-[13px] font-medium transition-colors">Отклонить</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div></AppShell>
  );
}
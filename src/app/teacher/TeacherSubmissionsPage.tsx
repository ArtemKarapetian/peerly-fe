import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { 
  Send, Filter, Search, Download, Clock, AlertTriangle, 
  CheckCircle, FileText, X, ChevronRight, Shield, Code,
  FileCheck, EyeOff, History, StickyNote, Save
} from 'lucide-react';
import { demoDataStore } from '@/app/stores/demoDataStore';

/**
 * TeacherSubmissionsPage - Просмотр сабмишенов (работ студентов)
 * 
 * Фильтрация по:
 * - Статус (draft/submitted/late)
 * - Риск плагиата (low/med/high)
 * - Наличие failed checks
 * - Поиск по студенту
 * 
 * Детальный просмотр:
 * - Список файлов с кнопками скачивания
 * - Временная шкала версий
 * - Отчеты плагинов (plagiarism/lint/format/anonymization)
 * - Внутренние заметки преподавателя
 */

type SubmissionStatus = 'draft' | 'submitted' | 'late';
type PlagiarismRisk = 'low' | 'medium' | 'high';

interface PluginReport {
  id: string;
  pluginName: string;
  pluginType: 'plagiarism' | 'lint' | 'format' | 'anonymization';
  status: 'passed' | 'warning' | 'failed';
  score?: number;
  message: string;
  timestamp: Date;
  details?: string;
}

interface SubmissionVersion {
  id: string;
  version: number;
  submittedAt: Date;
  filesCount: number;
  changes: string;
}

interface SubmissionFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  status: SubmissionStatus;
  plagiarismRisk: PlagiarismRisk;
  submittedAt?: Date;
  deadline: Date;
  files: SubmissionFile[];
  versions: SubmissionVersion[];
  pluginReports: PluginReport[];
  teacherNotes: string;
}

export default function TeacherSubmissionsPage() {
  const users = demoDataStore.getUsers();
  const assignments = demoDataStore.getAssignments();
  const demoSubmissions = demoDataStore.getSubmissions();

  // Get pre-filter from URL hash params
  const getPreFilterAssignmentId = (): string => {
    const hash = window.location.hash.slice(1); // Remove #
    const queryStart = hash.indexOf('?');
    if (queryStart === -1) return '';
    
    const queryString = hash.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    return params.get('assignmentId') || '';
  };

  // Generate comprehensive submission data
  const generateSubmissions = (): Submission[] => {
    return demoSubmissions.map((sub, idx) => {
      const assignment = assignments.find(a => a.id === sub.assignmentId);
      const student = users.find(u => u.id === sub.studentId);
      
      const isLate = sub.submittedAt && sub.submittedAt > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const status: SubmissionStatus = sub.status === 'draft' ? 'draft' : isLate ? 'late' : 'submitted';
      
      const plagiarismRisks: PlagiarismRisk[] = ['low', 'medium', 'high'];
      const plagiarismRisk = plagiarismRisks[idx % 3];

      // Generate files
      const files: SubmissionFile[] = [
        {
          id: `f1-${sub.id}`,
          name: 'main.py',
          size: '2.4 KB',
          uploadedAt: sub.submittedAt
        },
        {
          id: `f2-${sub.id}`,
          name: 'utils.py',
          size: '1.8 KB',
          uploadedAt: sub.submittedAt
        },
        {
          id: `f3-${sub.id}`,
          name: 'README.md',
          size: '856 B',
          uploadedAt: sub.submittedAt
        }
      ];

      // Generate versions
      const versions: SubmissionVersion[] = [
        {
          id: `v1-${sub.id}`,
          version: 1,
          submittedAt: new Date(sub.submittedAt.getTime() - 2 * 60 * 60 * 1000),
          filesCount: 2,
          changes: 'Первоначальная версия'
        },
        {
          id: `v2-${sub.id}`,
          version: 2,
          submittedAt: new Date(sub.submittedAt.getTime() - 1 * 60 * 60 * 1000),
          filesCount: 3,
          changes: 'Добавлен README.md'
        },
        {
          id: `v3-${sub.id}`,
          version: 3,
          submittedAt: sub.submittedAt,
          filesCount: 3,
          changes: 'Исправлены опечатки в main.py'
        }
      ];

      // Generate plugin reports
      const pluginReports: PluginReport[] = [
        {
          id: `pr1-${sub.id}`,
          pluginName: 'Turnitin',
          pluginType: 'plagiarism',
          status: plagiarismRisk === 'high' ? 'failed' : plagiarismRisk === 'medium' ? 'warning' : 'passed',
          score: plagiarismRisk === 'high' ? 78 : plagiarismRisk === 'medium' ? 45 : 12,
          message: plagiarismRisk === 'high' 
            ? 'Обнаружено высокое сходство с другими работами' 
            : plagiarismRisk === 'medium' 
            ? 'Умеренное сходство с опубликованными материалами'
            : 'Работа оригинальна',
          timestamp: new Date(sub.submittedAt.getTime() + 5 * 60 * 1000),
          details: `Совпадений с другими источниками: ${plagiarismRisk === 'high' ? '78%' : plagiarismRisk === 'medium' ? '45%' : '12%'}`
        },
        {
          id: `pr2-${sub.id}`,
          pluginName: 'ESLint',
          pluginType: 'lint',
          status: idx % 3 === 0 ? 'failed' : idx % 3 === 1 ? 'warning' : 'passed',
          message: idx % 3 === 0 ? '12 ошибок обнаружено' : idx % 3 === 1 ? '3 предупреждения' : 'Код соответствует стандартам',
          timestamp: new Date(sub.submittedAt.getTime() + 2 * 60 * 1000),
          details: idx % 3 === 0 ? 'Необходимо исправить синтаксические ошибки' : 'Незначительные проблемы со стилем'
        },
        {
          id: `pr3-${sub.id}`,
          pluginName: 'Prettier',
          pluginType: 'format',
          status: 'passed',
          message: 'Форматирование соответствует стандартам',
          timestamp: new Date(sub.submittedAt.getTime() + 3 * 60 * 1000)
        },
        {
          id: `pr4-${sub.id}`,
          pluginName: 'Anonymous Check',
          pluginType: 'anonymization',
          status: 'passed',
          message: 'Персональная информация не обнаружена',
          timestamp: new Date(sub.submittedAt.getTime() + 1 * 60 * 1000)
        }
      ];

      return {
        id: sub.id,
        assignmentId: sub.assignmentId,
        assignmentTitle: assignment?.title || 'Unknown Assignment',
        studentId: sub.studentId,
        studentName: student?.name || 'Unknown Student',
        status,
        plagiarismRisk,
        submittedAt: sub.submittedAt,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        files,
        versions,
        pluginReports,
        teacherNotes: ''
      };
    });
  };

  const [submissions, setSubmissions] = useState<Submission[]>(generateSubmissions());
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all');
  const [filterPlagiarism, setFilterPlagiarism] = useState<PlagiarismRisk | 'all'>('all');
  const [filterFailedChecks, setFilterFailedChecks] = useState(false);
  const [filterAssignment, setFilterAssignment] = useState<string>(getPreFilterAssignmentId());
  const [searchStudent, setSearchStudent] = useState('');

  // Teacher notes editing
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    if (selectedSubmission) {
      setNotesText(selectedSubmission.teacherNotes);
    }
  }, [selectedSubmission]);

  // Apply filters
  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
    if (filterPlagiarism !== 'all' && sub.plagiarismRisk !== filterPlagiarism) return false;
    if (filterFailedChecks) {
      const hasFailed = sub.pluginReports.some(r => r.status === 'failed');
      if (!hasFailed) return false;
    }
    if (filterAssignment !== 'all' && sub.assignmentId !== filterAssignment) return false;
    if (searchStudent && !sub.studentName.toLowerCase().includes(searchStudent.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
          <CheckCircle className="w-3 h-3" />
          Сдано
        </span>;
      case 'late':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[12px] font-medium">
          <Clock className="w-3 h-3" />
          Просрочено
        </span>;
      case 'draft':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[12px] font-medium">
          <FileText className="w-3 h-3" />
          Черновик
        </span>;
    }
  };

  const getPlagiarismBadge = (risk: PlagiarismRisk) => {
    switch (risk) {
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[12px] font-medium">
          <AlertTriangle className="w-3 h-3" />
          Высокий
        </span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[12px] font-medium">
          <AlertTriangle className="w-3 h-3" />
          Средний
        </span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
          <CheckCircle className="w-3 h-3" />
          Низкий
        </span>;
    }
  };

  const getPluginIcon = (type: PluginReport['pluginType']) => {
    switch (type) {
      case 'plagiarism': return <Shield className="w-4 h-4" />;
      case 'lint': return <Code className="w-4 h-4" />;
      case 'format': return <FileCheck className="w-4 h-4" />;
      case 'anonymization': return <EyeOff className="w-4 h-4" />;
    }
  };

  const getPluginStatusBadge = (status: PluginReport['status']) => {
    switch (status) {
      case 'passed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
          <CheckCircle className="w-3 h-3" />
          Passed
        </span>;
      case 'warning':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
          <AlertTriangle className="w-3 h-3" />
          Warning
        </span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
          <X className="w-3 h-3" />
          Failed
        </span>;
    }
  };

  const handleDownloadFile = (fileName: string) => {
    alert(`Скачивание файла: ${fileName}`);
  };

  const handleSaveNotes = () => {
    if (selectedSubmission) {
      setSubmissions(prev => prev.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, teacherNotes: notesText }
          : sub
      ));
      setSelectedSubmission({ ...selectedSubmission, teacherNotes: notesText });
      setEditingNotes(false);
      alert('Заметки сохранены');
    }
  };

  const hasFailedChecks = (sub: Submission) => {
    return sub.pluginReports.some(r => r.status === 'failed');
  };

  return (
    <AppShell title="Просмотр сабмишенов">
      <Breadcrumbs items={['Дашборд преподавателя', 'Работы студентов']} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Просмотр сабмишенов
          </h1>
          <p className="text-[16px] text-[#767692]">
            Управление работами студентов и проверка плагинов
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#767692]" />
            <h2 className="text-[16px] font-medium text-[#21214f]">Фильтры</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Assignment Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Задание
              </label>
              <select
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Все задания ({submissions.length})</option>
                {assignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Статус
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | 'all')}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Все статусы</option>
                <option value="submitted">Сдано</option>
                <option value="late">Просрочено</option>
                <option value="draft">Черновик</option>
              </select>
            </div>

            {/* Plagiarism Risk Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Риск плагиата
              </label>
              <select
                value={filterPlagiarism}
                onChange={(e) => setFilterPlagiarism(e.target.value as PlagiarismRisk | 'all')}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Любой риск</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>

            {/* Student Search */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Поиск студента
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#767692]" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Имя студента..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Failed Checks Filter */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Дополнительно
              </label>
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] cursor-pointer hover:bg-[#f9f9f9] transition-colors">
                <input
                  type="checkbox"
                  checked={filterFailedChecks}
                  onChange={(e) => setFilterFailedChecks(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-2 focus:ring-[#5b8def] focus:ring-offset-0"
                />
                <span className="text-[15px] text-[#21214f]">
                  Только с ошибками проверок
                </span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[14px] text-[#767692]">
              Найдено работ: <strong className="text-[#21214f]">{filteredSubmissions.length}</strong>
            </p>
            {(filterStatus !== 'all' || filterPlagiarism !== 'all' || filterFailedChecks || searchStudent || filterAssignment !== 'all') && (
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPlagiarism('all');
                  setFilterFailedChecks(false);
                  setFilterAssignment('all');
                  setSearchStudent('');
                }}
                className="flex items-center gap-2 px-3 py-2 text-[#5b8def] hover:bg-[#e9f5ff] rounded-[8px] transition-colors text-[14px]"
              >
                <X className="w-4 h-4" />
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          {filteredSubmissions.length > 0 ? (
            <div className="divide-y divide-[#e6e8ee]">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-medium text-[#21214f]">
                          {submission.studentName}
                        </h3>
                        {getStatusBadge(submission.status)}
                        {getPlagiarismBadge(submission.plagiarismRisk)}
                        {hasFailedChecks(submission) && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[12px] font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Есть ошибки
                          </span>
                        )}
                      </div>
                      <p className="text-[14px] text-[#767692] mb-2">
                        {submission.assignmentTitle}
                      </p>
                      <div className="flex items-center gap-4 text-[13px] text-[#767692]">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {submission.files.length} файлов
                        </span>
                        <span className="flex items-center gap-1">
                          <History className="w-3 h-3" />
                          v{submission.versions.length}
                        </span>
                        {submission.submittedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {submission.submittedAt.toLocaleString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#767692] shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
                Работы не найдены
              </h3>
              <p className="text-[14px] text-[#767692]">
                Попробуйте изменить фильтры
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Drawer */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
          onClick={() => {
            setSelectedSubmission(null);
            setEditingNotes(false);
          }}
        >
          <div
            className="bg-white h-full w-full md:w-[700px] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b-2 border-[#e6e8ee] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-[#21214f]">
                  {selectedSubmission.studentName}
                </h2>
                <p className="text-[13px] text-[#767692] mt-1">
                  {selectedSubmission.assignmentTitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setEditingNotes(false);
                }}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Status Summary */}
              <div className="bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[12px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Статус</p>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Риск плагиата</p>
                    {getPlagiarismBadge(selectedSubmission.plagiarismRisk)}
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Сдано</p>
                    <p className="text-[14px] text-[#21214f]">
                      {selectedSubmission.submittedAt?.toLocaleString('ru-RU') || 'Не сдано'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Дедлайн</p>
                    <p className="text-[14px] text-[#21214f]">
                      {selectedSubmission.deadline.toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Files List */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Файлы ({selectedSubmission.files.length})
                </h3>
                <div className="space-y-2">
                  {selectedSubmission.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-[#f9f9f9] border border-[#e6e8ee] rounded-[8px]">
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-[#21214f]">{file.name}</p>
                        <p className="text-[12px] text-[#767692]">
                          {file.size} • Загружено {file.uploadedAt.toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(file.name)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#5b8def] text-white rounded-[8px] hover:bg-[#4a7de8] transition-colors text-[13px]"
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Versions Timeline */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  История версий
                </h3>
                <div className="space-y-3">
                  {selectedSubmission.versions.map((version, index) => (
                    <div key={version.id} className="relative pl-6 pb-3 border-l-2 border-[#e6e8ee] last:border-0">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 bg-[#5b8def] rounded-full" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-medium text-[#21214f]">
                            Версия {version.version}
                            {index === selectedSubmission.versions.length - 1 && (
                              <span className="ml-2 text-[12px] text-[#4caf50]">(Текущая)</span>
                            )}
                          </p>
                          <p className="text-[13px] text-[#767692] mt-1">{version.changes}</p>
                          <p className="text-[12px] text-[#767692] mt-1">
                            {version.filesCount} файлов • {version.submittedAt.toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plugin Reports */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Отчеты плагинов
                </h3>
                <div className="space-y-3">
                  {selectedSubmission.pluginReports.map(report => (
                    <div key={report.id} className="p-4 bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[12px]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPluginIcon(report.pluginType)}
                          <h4 className="text-[14px] font-medium text-[#21214f]">
                            {report.pluginName}
                          </h4>
                        </div>
                        {getPluginStatusBadge(report.status)}
                      </div>
                      <p className="text-[13px] text-[#21214f] mb-2">{report.message}</p>
                      {report.score !== undefined && (
                        <p className="text-[13px] text-[#767692] mb-2">
                          Оценка: <strong className="text-[#21214f]">{report.score}%</strong>
                        </p>
                      )}
                      {report.details && (
                        <p className="text-[12px] text-[#767692] mb-2">{report.details}</p>
                      )}
                      <p className="text-[11px] text-[#767692]">
                        Проверено: {report.timestamp.toLocaleString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-medium text-[#21214f] flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    Заметки преподавателя
                  </h3>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className="text-[14px] text-[#5b8def] hover:underline"
                    >
                      Редактировать
                    </button>
                  )}
                </div>
                <div className="p-4 bg-[#fff9e5] border-2 border-[#f59e0b] rounded-[12px]">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#767692]">
                      Эти заметки видны только преподавателям и не отображаются студентам
                    </p>
                  </div>
                  {editingNotes ? (
                    <div>
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Внутренние заметки о работе студента..."
                        className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors min-h-[120px] resize-y"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleSaveNotes}
                          className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[8px] hover:bg-[#4a7de8] transition-colors text-[14px]"
                        >
                          <Save className="w-4 h-4" />
                          Сохранить
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setNotesText(selectedSubmission.teacherNotes);
                          }}
                          className="px-4 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[14px]"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[14px] text-[#21214f] leading-relaxed">
                      {selectedSubmission.teacherNotes || <span className="text-[#767692] italic">Заметок пока нет</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
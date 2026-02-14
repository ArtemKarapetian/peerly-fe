import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ROUTES } from '@/app/routes';
import {
  Save,
  EyeOff,
  Users,
  Shuffle,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Clock,
  History,
} from 'lucide-react';

/**
 * TeacherPeerSessionSettingsPage - Настройки peer-сессии
 * 
 * Управление параметрами взаимного рецензирования для конкретного задания
 */

interface PeerSessionSettings {
  assignmentId: string;
  anonymityMode: 'none' | 'hide-student' | 'double-anonymous';
  reviewsPerSubmission: number;
  assignmentAlgorithm: 'random' | 'avoid-collusion';
  allowManualReassignment: boolean;
  autoReassignInactive: boolean;
  inactiveThresholdHours: number;
  lateSubmissionPenaltyEnabled: boolean;
  lateSubmissionPenaltyType: 'percentage' | 'fixed';
  lateSubmissionPenaltyValue: number;
  studentExtensions: Record<string, number>; // studentId -> hours extended
  updatedAt: Date;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  userId: string;
  userName: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  submissionStatus: 'not-started' | 'in-progress' | 'submitted';
}

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Алексей Иванов', email: 'a.ivanov@example.com', submissionStatus: 'submitted' },
  { id: 's2', name: 'Мария Петрова', email: 'm.petrova@example.com', submissionStatus: 'submitted' },
  { id: 's3', name: 'Дмитрий Сидоров', email: 'd.sidorov@example.com', submissionStatus: 'in-progress' },
  { id: 's4', name: 'Елена Васильева', email: 'e.vasilyeva@example.com', submissionStatus: 'not-started' },
  { id: 's5', name: 'Сергей Козлов', email: 's.kozlov@example.com', submissionStatus: 'submitted' },
  { id: 's6', name: 'Ольга Морозова', email: 'o.morozova@example.com', submissionStatus: 'in-progress' },
  { id: 's7', name: 'Павел Новиков', email: 'p.novikov@example.com', submissionStatus: 'submitted' },
  { id: 's8', name: 'Анна Соколова', email: 'a.sokolova@example.com', submissionStatus: 'not-started' },
];

interface TeacherPeerSessionSettingsPageProps {
  assignmentId: string;
}

export default function TeacherPeerSessionSettingsPage({
  assignmentId,
}: TeacherPeerSessionSettingsPageProps) {
  const [settings, setSettings] = useState<PeerSessionSettings>(() => {
    const stored = localStorage.getItem(`peer_session_settings_${assignmentId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          updatedAt: new Date(parsed.updatedAt),
        };
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }

    return {
      assignmentId,
      anonymityMode: 'double-anonymous',
      reviewsPerSubmission: 3,
      assignmentAlgorithm: 'random',
      allowManualReassignment: true,
      autoReassignInactive: true,
      inactiveThresholdHours: 48,
      lateSubmissionPenaltyEnabled: false,
      lateSubmissionPenaltyType: 'percentage',
      lateSubmissionPenaltyValue: 10,
      studentExtensions: {},
      updatedAt: new Date(),
    };
  });

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem(`peer_session_audit_${assignmentId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      } catch (e) {
        console.error('Failed to parse audit log', e);
      }
    }
    return [];
  });

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      `peer_session_settings_${assignmentId}`,
      JSON.stringify(settings)
    );
  }, [settings, assignmentId]);

  // Save audit log to localStorage
  useEffect(() => {
    localStorage.setItem(
      `peer_session_audit_${assignmentId}`,
      JSON.stringify(auditLog)
    );
  }, [auditLog, assignmentId]);

  const addAuditEntry = (
    action: string,
    field: string,
    oldValue: string,
    newValue: string
  ) => {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date(),
      action,
      field,
      oldValue,
      newValue,
      userId: 'u2',
      userName: 'Преподаватель',
    };

    setAuditLog((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const updateSettings = (updates: Partial<PeerSessionSettings>) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      };

      // Log changes
      Object.keys(updates).forEach((key) => {
        const oldValue = String(prev[key as keyof PeerSessionSettings]);
        const newValue = String(updates[key as keyof PeerSessionSettings]);
        if (oldValue !== newValue) {
          addAuditEntry('Изменение настройки', key, oldValue, newValue);
        }
      });

      return newSettings;
    });
  };

  const handleSave = () => {
    addAuditEntry('Сохранение настроек', 'all', '', 'Настройки сохранены');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const updateStudentExtension = (studentId: string, hours: number) => {
    const oldHours = settings.studentExtensions[studentId] || 0;
    const newExtensions = { ...settings.studentExtensions };

    if (hours > 0) {
      newExtensions[studentId] = hours;
    } else {
      delete newExtensions[studentId];
    }

    updateSettings({ studentExtensions: newExtensions });

    const student = MOCK_STUDENTS.find((s) => s.id === studentId);
    if (student) {
      addAuditEntry(
        'Изменение продления дедлайна',
        `extension_${student.name}`,
        `${oldHours} ч`,
        `${hours} ч`
      );
    }
  };

  const getAnonymityLabel = (mode: string) => {
    switch (mode) {
      case 'none':
        return 'Без анонимности';
      case 'hide-student':
        return 'Скрыть автора работы';
      case 'double-anonymous':
        return 'Двойная анонимность';
      default:
        return mode;
    }
  };

  const getAlgorithmLabel = (algo: string) => {
    switch (algo) {
      case 'random':
        return 'Случайное';
      case 'avoid-collusion':
        return 'С защитой от сговора';
      default:
        return algo;
    }
  };

  return (
    <AppShell title="Настройки peer-сессии">
      <Breadcrumbs
        items={[
          { label: 'Дашборд преподавателя', href: ROUTES.teacherDashboard },
          { label: 'Конструктор заданий', href: ROUTES.teacherDashboard },
          { label: 'Задание', href: ROUTES.teacherDashboard },
          { label: 'Настройки peer-сессии' }
        ]}
      />

      {/* Save Success Banner */}
      {showSaveSuccess && (
        <div className="mt-6 bg-[#e8f5e9] border border-[#4caf50] rounded-[12px] p-4 animate-fade-in">
          <p className="text-[14px] text-[#21214f] font-medium">
            ✅ Настройки успешно сохранены
          </p>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Настройки peer-сессии
            </h1>
            <p className="text-[15px] text-[#767692]">
              Управление параметрами взаимного рецензирования
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Сохранить изменения
          </button>
        </div>

        <div className="space-y-8">
          {/* Anonymity Mode */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EyeOff className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">
                Режим анонимности
              </h2>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => updateSettings({ anonymityMode: 'none' })}
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === 'none'
                      ? 'border-[#5b8def] bg-[#e9f5ff]'
                      : 'border-[#e6e8ee] hover:border-[#a0b8f1] bg-white'
                  }
                `}
              >
                <div className="text-[15px] font-medium text-[#21214f] mb-1">
                  Без анонимности
                </div>
                <div className="text-[13px] text-[#767692]">
                  Все участники видят имена авторов и рецензентов
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ anonymityMode: 'hide-student' })}
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === 'hide-student'
                      ? 'border-[#5b8def] bg-[#e9f5ff]'
                      : 'border-[#e6e8ee] hover:border-[#a0b8f1] bg-white'
                  }
                `}
              >
                <div className="text-[15px] font-medium text-[#21214f] mb-1">
                  Скрыть автора работы
                </div>
                <div className="text-[13px] text-[#767692]">
                  Рецензент не знает, чью работу проверяет, но автор видит рецензента
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateSettings({ anonymityMode: 'double-anonymous' })
                }
                className={`
                  w-full p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.anonymityMode === 'double-anonymous'
                      ? 'border-[#5b8def] bg-[#e9f5ff]'
                      : 'border-[#e6e8ee] hover:border-[#a0b8f1] bg-white'
                  }
                `}
              >
                <div className="text-[15px] font-medium text-[#21214f] mb-1">
                  Двойная анонимность (рекомендуется)
                </div>
                <div className="text-[13px] text-[#767692]">
                  Ни автор, ни рецензент не знают друг друга. Максимальная
                  объективность.
                </div>
              </button>
            </div>
          </div>

          {/* Reviews Per Submission */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">
                Количество рецензий на работу
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={settings.reviewsPerSubmission}
                onChange={(e) =>
                  updateSettings({
                    reviewsPerSubmission: parseInt(e.target.value),
                  })
                }
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.reviewsPerSubmission}
                  onChange={(e) =>
                    updateSettings({
                      reviewsPerSubmission: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-20 px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[15px] font-medium text-center focus:outline-none focus:border-[#5b8def]"
                />
                <span className="text-[14px] text-[#767692]">рецензий</span>
              </div>
            </div>
            <p className="text-[13px] text-[#767692] mt-2">
              Каждая работа будет проверена {settings.reviewsPerSubmission}{' '}
              рецензент
              {settings.reviewsPerSubmission === 1
                ? 'ом'
                : settings.reviewsPerSubmission < 5
                ? 'ами'
                : 'ами'}
              . Рекомендуется 3-5 для баланса.
            </p>
          </div>

          {/* Assignment Algorithm */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shuffle className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">
                Алгоритм распределения
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  updateSettings({ assignmentAlgorithm: 'random' })
                }
                className={`
                  p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.assignmentAlgorithm === 'random'
                      ? 'border-[#5b8def] bg-[#e9f5ff]'
                      : 'border-[#e6e8ee] hover:border-[#a0b8f1] bg-white'
                  }
                `}
              >
                <div className="text-[15px] font-medium text-[#21214f] mb-1">
                  Случайное распределение
                </div>
                <div className="text-[13px] text-[#767692]">
                  Быстрое и простое распределение работ
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateSettings({ assignmentAlgorithm: 'avoid-collusion' })
                }
                className={`
                  p-4 border-2 rounded-[12px] text-left transition-all
                  ${
                    settings.assignmentAlgorithm === 'avoid-collusion'
                      ? 'border-[#5b8def] bg-[#e9f5ff]'
                      : 'border-[#e6e8ee] hover:border-[#a0b8f1] bg-white'
                  }
                `}
              >
                <div className="text-[15px] font-medium text-[#21214f] mb-1">
                  С защитой от сговора
                </div>
                <div className="text-[13px] text-[#767692]">
                  Учитывает связи между студентами
                </div>
              </button>
            </div>
            {settings.assignmentAlgorithm === 'avoid-collusion' && (
              <div className="mt-3 bg-[#e9f5ff] border border-[#a0b8f1] rounded-[8px] p-3">
                <p className="text-[13px] text-[#21214f]">
                  <strong>Demo:</strong> Алгоритм анализирует историю
                  взаимодействий и избегает назначения работ между студентами,
                  которые часто взаимодействуют.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue in next section... */}
    </AppShell>
  );
}
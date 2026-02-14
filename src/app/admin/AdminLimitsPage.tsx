import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { ROUTES } from '@/app/routes';
import { Gauge, Save, Plus, X, Building, AlertCircle } from 'lucide-react';

/**
 * AdminLimitsPage - Лимиты и квоты
 * 
 * Функции:
 * - Глобальные лимиты: upload size, files per submission, attempts, rate limits
 * - Per-tenant overrides
 * - Сохранение в localStorage
 */

interface GlobalLimits {
  maxUploadSizeMB: number;
  maxFilesPerSubmission: number;
  maxSubmissionAttempts: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  maxReviewsPerDay: number;
  maxCoursesPerTeacher: number;
}

interface TenantOverride {
  tenantId: string;
  tenantName: string;
  limits: Partial<GlobalLimits>;
}

const DEFAULT_LIMITS: GlobalLimits = {
  maxUploadSizeMB: 10,
  maxFilesPerSubmission: 5,
  maxSubmissionAttempts: 3,
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  },
  maxReviewsPerDay: 50,
  maxCoursesPerTeacher: 20
};

export default function AdminLimitsPage() {
  const [globalLimits, setGlobalLimits] = useState<GlobalLimits>(DEFAULT_LIMITS);
  const [tenantOverrides, setTenantOverrides] = useState<TenantOverride[]>([]);
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Available tenants (from demoDataStore)
  const availableTenants = [
    { id: 'org1', name: 'HSE' },
    { id: 'org2', name: 'MGUSiT' },
    { id: 'org3', name: 'Demo University' }
  ];

  useEffect(() => {
    const storedLimits = localStorage.getItem('admin_global_limits');
    if (storedLimits) {
      setGlobalLimits(JSON.parse(storedLimits));
    }

    const storedOverrides = localStorage.getItem('admin_tenant_overrides');
    if (storedOverrides) {
      setTenantOverrides(JSON.parse(storedOverrides));
    }
  }, []);

  const handleGlobalChange = (path: string, value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      setGlobalLimits({
        ...globalLimits,
        [parent]: {
          ...(globalLimits[parent as keyof GlobalLimits] as any),
          [child]: numValue
        }
      });
    } else {
      setGlobalLimits({ ...globalLimits, [path]: numValue });
    }
    
    setHasChanges(true);
  };

  const handleAddOverride = () => {
    const unusedTenant = availableTenants.find(
      t => !tenantOverrides.some(o => o.tenantId === t.id)
    );

    if (!unusedTenant) {
      alert('Все организации уж�� имеют переопределения');
      return;
    }

    const newOverride: TenantOverride = {
      tenantId: unusedTenant.id,
      tenantName: unusedTenant.name,
      limits: {}
    };

    setTenantOverrides([...tenantOverrides, newOverride]);
    setHasChanges(true);
    setShowAddOverride(false);
  };

  const handleRemoveOverride = (tenantId: string) => {
    if (!confirm('Удалить переопределение для этой организации?')) return;
    setTenantOverrides(tenantOverrides.filter(o => o.tenantId !== tenantId));
    setHasChanges(true);
  };

  const handleOverrideChange = (tenantId: string, key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    
    setTenantOverrides(tenantOverrides.map(override => {
      if (override.tenantId !== tenantId) return override;
      
      return {
        ...override,
        limits: { ...override.limits, [key]: numValue }
      };
    }));
    
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem('admin_global_limits', JSON.stringify(globalLimits));
    localStorage.setItem('admin_tenant_overrides', JSON.stringify(tenantOverrides));
    
    logAuditEntry('UPDATE_LIMITS', 'SystemLimits', 'Лимиты и квоты обновлены');
    
    setHasChanges(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: 'limits-system',
      adminId: 'u3',
      action,
      resource,
      details,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_audit_logs', JSON.stringify(logs));
  };

  const limitSettings = [
    {
      key: 'maxUploadSizeMB',
      label: 'Максимальный размер файла',
      description: 'Лимит размера одного загружаемого файла',
      unit: 'MB',
      icon: '📁'
    },
    {
      key: 'maxFilesPerSubmission',
      label: 'Файлов в одной работе',
      description: 'Максимальное количество файлов в submission',
      unit: 'файлов',
      icon: '📎'
    },
    {
      key: 'maxSubmissionAttempts',
      label: 'Попыток отправки',
      description: 'Сколько раз студент может переотправить работу',
      unit: 'попыток',
      icon: '🔄'
    },
    {
      key: 'maxReviewsPerDay',
      label: 'Рецензий в день',
      description: 'Максимум рецензий, которые может написать студент за день',
      unit: 'рецензий',
      icon: '✍️'
    },
    {
      key: 'maxCoursesPerTeacher',
      label: 'Курсов на преподавателя',
      description: 'Максимальное количество курсов у одного преподавателя',
      unit: 'курсов',
      icon: '📚'
    }
  ];

  return (
    <AppShell title="Лимиты и квоты">
      <Breadcrumbs items={[
        { label: 'Администратор', href: ROUTES.adminOverview },
        { label: 'Политики', href: ROUTES.adminPolicies },
        { label: 'Лимиты' }
      ]} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Лимиты и квоты
          </h1>
          <p className="text-[16px] text-[#767692]">
            Настройка ограничений для пользователей и системных ресурсов
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[16px] p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4caf50] rounded-full flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <p className="text-[14px] font-medium text-[#4caf50]">
                ✓ Лимиты и квоты успешно сохранены
              </p>
            </div>
          </div>
        )}

        {/* Global Limits */}
        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Глобальные лимиты</h2>
          
          <div className="space-y-4">
            {/* Standard Limits */}
            {limitSettings.map(setting => (
              <div key={setting.key} className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[32px] flex-shrink-0">{setting.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                      {setting.label}
                    </h3>
                    <p className="text-[13px] text-[#767692] mb-3">
                      {setting.description}
                    </p>
                    <div className="flex items-center gap-2 max-w-[250px]">
                      <input
                        type="number"
                        min="1"
                        value={(globalLimits as any)[setting.key]}
                        onChange={(e) => handleGlobalChange(setting.key, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                      />
                      <span className="text-[14px] text-[#767692] min-w-[80px]">{setting.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Rate Limits */}
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
              <div className="flex items-start gap-4">
                <div className="text-[32px] flex-shrink-0">⚡</div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                    Rate Limiting
                  </h3>
                  <p className="text-[13px] text-[#767692] mb-4">
                    Ограничение частоты запросов к API
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                        Запросов в минуту
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={globalLimits.rateLimit.requestsPerMinute}
                          onChange={(e) => handleGlobalChange('rateLimit.requestsPerMinute', e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                        />
                        <span className="text-[14px] text-[#767692] min-w-[60px]">req/min</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                        Запросов в час
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={globalLimits.rateLimit.requestsPerHour}
                          onChange={(e) => handleGlobalChange('rateLimit.requestsPerHour', e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:border-[#5b8def] focus:outline-none transition-colors"
                        />
                        <span className="text-[14px] text-[#767692] min-w-[60px]">req/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Overrides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-medium text-[#21214f]">Переопределения по организациям</h2>
              <p className="text-[13px] text-[#767692] mt-1">
                Установите особые лимиты для конкретных организаций
              </p>
            </div>
            {tenantOverrides.length < availableTenants.length && (
              <button
                onClick={() => setShowAddOverride(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            )}
          </div>

          {tenantOverrides.length > 0 ? (
            <div className="space-y-4">
              {tenantOverrides.map(override => {
                const tenant = availableTenants.find(t => t.id === override.tenantId);
                return (
                  <div key={override.tenantId} className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
                    {/* Tenant Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[#e6e8ee]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
                          <Building className="w-5 h-5 text-[#5b8def]" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-medium text-[#21214f]">{tenant?.name}</h3>
                          <p className="text-[12px] text-[#767692]">ID: {override.tenantId}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveOverride(override.tenantId)}
                        className="p-2 text-[#d4183d] hover:bg-[#fff5f5] rounded-[8px] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Override Settings */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {limitSettings.map(setting => (
                        <div key={setting.key}>
                          <label className="block text-[12px] font-medium text-[#767692] mb-2">
                            {setting.label}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={(override.limits as any)[setting.key] || ''}
                              onChange={(e) => handleOverrideChange(override.tenantId, setting.key, e.target.value)}
                              placeholder={`По умолч.: ${(globalLimits as any)[setting.key]}`}
                              className="flex-1 px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[13px] focus:border-[#5b8def] focus:outline-none transition-colors"
                            />
                            <span className="text-[12px] text-[#767692] min-w-[60px]">
                              {setting.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-[#f9f9f9] rounded-[8px]">
                      <p className="text-[12px] text-[#767692]">
                        💡 Пустые поля используют глобальное значение. 
                        Заполненные поля переопределяют глобальные лимиты для этой организации.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-12 text-center">
              <Building className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[16px] font-medium text-[#21214f] mb-2">
                Нет переопределений
              </h3>
              <p className="text-[13px] text-[#767692] mb-4">
                Все организации используют глобальные лимиты
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                О лимитах и квотах
              </h4>
              <p className="text-[13px] text-[#767692]">
                Лимиты применяются в реальном времени и помогают предотвратить злоупотребления системой. 
                Переопределения по организациям имеют приоритет над глобальными настройками.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-6 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
              hasChanges
                ? 'bg-[#5b8def] text-white hover:bg-[#4a7de8]'
                : 'bg-[#e6e8ee] text-[#767692] cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>
        </div>
      </div>

      {/* Add Override Modal */}
      {showAddOverride && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddOverride(false)}
        >
          <div
            className="bg-white rounded-[20px] w-full max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-[#e6e8ee]">
              <h2 className="text-[18px] font-medium text-[#21214f]">
                Добавить переопределение
              </h2>
            </div>
            <div className="p-6">
              <p className="text-[14px] text-[#767692] mb-4">
                Будет добавлено переопределение для следующей доступной организации. 
                После добавления вы сможете настроить индивидуальные лимиты.
              </p>
              <div className="p-4 bg-[#f9f9f9] rounded-[12px] border-2 border-[#e6e8ee]">
                <p className="text-[13px] text-[#21214f]">
                  Доступные организации: <strong>
                    {availableTenants
                      .filter(t => !tenantOverrides.some(o => o.tenantId === t.id))
                      .map(t => t.name)
                      .join(', ')}
                  </strong>
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t-2 border-[#e6e8ee] flex gap-3">
              <button
                onClick={() => setShowAddOverride(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleAddOverride}
                className="flex-1 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
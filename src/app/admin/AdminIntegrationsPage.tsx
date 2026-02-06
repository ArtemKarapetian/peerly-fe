import { useState, useEffect } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { 
  Link2, Lock, AlertCircle, Plus, X, Edit3, Trash2, 
  CheckCircle, XCircle, Send, Clock, ExternalLink, Eye, EyeOff
} from 'lucide-react';

/**
 * AdminIntegrationsPage - Ключи интеграций и вебхуки
 * 
 * Функции:
 * - Секции интеграций: Moodle (отключена, "Out of MVP"), Office 365 (отключена)
 * - Webhooks: создание, список, статусы, последняя доставка
 * - События: AssignmentCreated, SubmissionUploaded, ReviewSubmitted
 * - Тест webhook с генерацией fake delivery log
 */

interface Webhook {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastDelivery?: WebhookDelivery;
  createdAt: Date;
}

interface WebhookDelivery {
  timestamp: Date;
  event: string;
  status: 'success' | 'failed';
  responseCode?: number;
  responseTime?: number;
}

const WEBHOOK_EVENTS = [
  { value: 'assignment.created', label: 'Assignment Created', description: 'Когда создаётся новое задание' },
  { value: 'submission.uploaded', label: 'Submission Uploaded', description: 'Когда студент загружает работу' },
  { value: 'review.submitted', label: 'Review Submitted', description: 'Когда отправляется рецензия' },
  { value: 'course.updated', label: 'Course Updated', description: 'Когда обновляется курс' },
  { value: 'user.registered', label: 'User Registered', description: 'Когда регистрируется пользователь' }
];

export default function AdminIntegrationsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState<string | null>(null);
  const [showDeliveryLog, setShowDeliveryLog] = useState<Webhook | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSecret, setFormSecret] = useState('');
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load webhooks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin_webhooks');
    if (stored) {
      const parsed = JSON.parse(stored);
      setWebhooks(parsed.map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        lastDelivery: w.lastDelivery ? {
          ...w.lastDelivery,
          timestamp: new Date(w.lastDelivery.timestamp)
        } : undefined
      })));
    }
  }, []);

  // Save webhooks to localStorage
  const saveWebhooks = (newWebhooks: Webhook[]) => {
    setWebhooks(newWebhooks);
    localStorage.setItem('admin_webhooks', JSON.stringify(newWebhooks));
  };

  // Generate random secret
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = 'whsec_';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formName.trim()) {
      errors.name = 'Введите название';
    }

    if (!formUrl.trim()) {
      errors.url = 'Введите URL';
    } else if (!formUrl.startsWith('http://') && !formUrl.startsWith('https://')) {
      errors.url = 'URL должен начинаться с http:// или https://';
    }

    if (formEvents.length === 0) {
      errors.events = 'Выберите хотя бы одно событие';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create webhook
  const handleCreate = () => {
    if (!validateForm()) return;

    const newWebhook: Webhook = {
      id: `wh-${Date.now()}`,
      name: formName,
      url: formUrl,
      secret: formSecret || generateSecret(),
      events: formEvents,
      status: 'active',
      createdAt: new Date()
    };

    saveWebhooks([...webhooks, newWebhook]);
    logAuditEntry('CREATE_WEBHOOK', 'Webhook', `Webhook ${formName} создан`);

    // Reset form
    setFormName('');
    setFormUrl('');
    setFormSecret('');
    setFormEvents([]);
    setFormErrors({});
    setShowCreateModal(false);

    alert(`✅ Webhook "${formName}" успешно создан`);
  };

  // Handle delete webhook
  const handleDelete = (webhook: Webhook) => {
    if (!confirm(`Удалить webhook "${webhook.name}"?`)) return;

    saveWebhooks(webhooks.filter(w => w.id !== webhook.id));
    logAuditEntry('DELETE_WEBHOOK', 'Webhook', `Webhook ${webhook.name} удалён`);
    alert(`🗑️ Webhook "${webhook.name}" удалён`);
  };

  // Handle toggle status
  const handleToggleStatus = (webhook: Webhook) => {
    const newStatus = webhook.status === 'active' ? 'inactive' : 'active';
    const updated = webhooks.map(w => 
      w.id === webhook.id ? { ...w, status: newStatus } : w
    );
    saveWebhooks(updated);
    logAuditEntry(
      newStatus === 'active' ? 'ENABLE_WEBHOOK' : 'DISABLE_WEBHOOK',
      'Webhook',
      `Webhook ${webhook.name} ${newStatus === 'active' ? 'активирован' : 'отключён'}`
    );
  };

  // Handle test webhook
  const handleTestWebhook = (webhook: Webhook) => {
    const testEvent = webhook.events[0] || 'test.event';
    const isSuccess = Math.random() > 0.2; // 80% success rate

    const delivery: WebhookDelivery = {
      timestamp: new Date(),
      event: testEvent,
      status: isSuccess ? 'success' : 'failed',
      responseCode: isSuccess ? 200 : 500,
      responseTime: Math.floor(Math.random() * 500) + 100
    };

    const updated = webhooks.map(w => 
      w.id === webhook.id 
        ? { ...w, lastDelivery: delivery, status: isSuccess ? 'active' as const : 'error' as const }
        : w
    );
    saveWebhooks(updated);

    logAuditEntry('TEST_WEBHOOK', 'Webhook', `Тестовый запрос отправлен на ${webhook.name}`);

    alert(
      isSuccess 
        ? `✅ Webhook протестирован успешно\nСтатус: 200 OK\nВремя ответа: ${delivery.responseTime}ms`
        : `❌ Webhook вернул ошибку\nСтатус: ${delivery.responseCode}\nВремя ответа: ${delivery.responseTime}ms`
    );
  };

  // Toggle event selection
  const toggleEvent = (event: string) => {
    if (formEvents.includes(event)) {
      setFormEvents(formEvents.filter(e => e !== event));
    } else {
      setFormEvents([...formEvents, event]);
    }
  };

  // Audit logging
  const logAuditEntry = (action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: 'webhook-system',
      adminId: 'u3',
      action,
      resource,
      details,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_audit_logs', JSON.stringify(logs));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Активен
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            Отключён
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
            <XCircle className="w-3 h-3" />
            Ошибка
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title="Интеграции и Webhooks">
      <Breadcrumbs items={['Администратор', 'Интеграции']} />

      <div className="mt-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Ключи интеграций и вебхуки
          </h1>
          <p className="text-[16px] text-[#767692]">
            Настройка внешних интеграций и webhook-уведомлений
          </p>
        </div>

        {/* External Integrations Section */}
        <div>
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Внешние интеграции</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Moodle Integration */}
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#fff4e5] rounded-[12px] flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-[#ff9800]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-medium text-[#21214f] mb-1">Moodle</h3>
                    <p className="text-[13px] text-[#767692]">
                      Интеграция с LMS Moodle для синхронизации курсов и оценок
                    </p>
                  </div>
                </div>
              </div>

              {/* Out of MVP Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[12px] font-medium">
                  <Lock className="w-3 h-3" />
                  Out of MVP
                </span>
              </div>

              {/* Placeholder Settings */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#767692] mb-1 uppercase tracking-wide">
                    Moodle URL
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="https://your-moodle.edu"
                    className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] bg-[#f9f9f9] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#767692] mb-1 uppercase tracking-wide">
                    API Token
                  </label>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] bg-[#f9f9f9] cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                disabled
                className="w-full px-4 py-2 bg-[#e6e8ee] text-[#767692] rounded-[8px] text-[14px] font-medium cursor-not-allowed"
              >
                Подключить (недосту��но)
              </button>
            </div>

            {/* Office 365 Integration */}
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-[#5b8def]" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-medium text-[#21214f] mb-1">Office 365</h3>
                    <p className="text-[13px] text-[#767692]">
                      Интеграция с Microsoft 365 для работы с документами
                    </p>
                  </div>
                </div>
              </div>

              {/* Out of MVP Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[12px] font-medium">
                  <Lock className="w-3 h-3" />
                  Out of MVP
                </span>
              </div>

              {/* Placeholder Settings */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#767692] mb-1 uppercase tracking-wide">
                    Client ID
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="00000000-0000-0000-0000-000000000000"
                    className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] bg-[#f9f9f9] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#767692] mb-1 uppercase tracking-wide">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] bg-[#f9f9f9] cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                disabled
                className="w-full px-4 py-2 bg-[#e6e8ee] text-[#767692] rounded-[8px] text-[14px] font-medium cursor-not-allowed"
              >
                Подключить (недоступно)
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-medium text-[#21214f]">Webhooks</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Создать webhook
            </button>
          </div>

          {/* Webhooks List */}
          {webhooks.length > 0 ? (
            <div className="space-y-4">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-medium text-[#21214f]">{webhook.name}</h3>
                        {getStatusBadge(webhook.status)}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-[#767692] mb-2">
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-mono">{webhook.url}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map(event => {
                          const eventInfo = WEBHOOK_EVENTS.find(e => e.value === event);
                          return (
                            <span key={event} className="px-2 py-1 bg-[#f9f9f9] text-[#21214f] rounded-[6px] text-[11px]">
                              {eventInfo?.label || event}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Last Delivery */}
                  {webhook.lastDelivery && (
                    <div className="p-4 bg-[#f9f9f9] rounded-[12px] mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-medium text-[#767692] uppercase tracking-wide">
                          Последняя доставка
                        </span>
                        {webhook.lastDelivery.status === 'success' ? (
                          <span className="text-[11px] text-[#4caf50] font-medium">✓ Успешно</span>
                        ) : (
                          <span className="text-[11px] text-[#d4183d] font-medium">✗ Ошибка</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-[12px]">
                        <div>
                          <span className="text-[#767692]">Событие:</span>
                          <p className="text-[#21214f] font-medium mt-1">{webhook.lastDelivery.event}</p>
                        </div>
                        <div>
                          <span className="text-[#767692]">Код ответа:</span>
                          <p className="text-[#21214f] font-medium mt-1">{webhook.lastDelivery.responseCode}</p>
                        </div>
                        <div>
                          <span className="text-[#767692]">Время:</span>
                          <p className="text-[#21214f] font-medium mt-1">{webhook.lastDelivery.responseTime}ms</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#767692] mt-2">
                        {webhook.lastDelivery.timestamp.toLocaleString('ru-RU')}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#5b8def] text-white rounded-[8px] hover:bg-[#4a7de8] transition-colors text-[13px] font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Тест
                    </button>
                    <button
                      onClick={() => handleToggleStatus(webhook)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-[8px] transition-colors text-[13px] font-medium ${
                        webhook.status === 'active'
                          ? 'border-2 border-[#e6e8ee] text-[#21214f] hover:bg-[#f9f9f9]'
                          : 'bg-[#4caf50] text-white hover:bg-[#45a049]'
                      }`}
                    >
                      {webhook.status === 'active' ? 'Отключить' : 'Включить'}
                    </button>
                    <button
                      onClick={() => setShowSecretModal(webhook.secret)}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-[#e6e8ee] text-[#21214f] rounded-[8px] hover:bg-[#f9f9f9] transition-colors text-[13px] font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Secret
                    </button>
                    <button
                      onClick={() => handleDelete(webhook)}
                      className="ml-auto flex items-center gap-2 px-3 py-2 border-2 border-[#d4183d] text-[#d4183d] rounded-[8px] hover:bg-[#fff5f5] transition-colors text-[13px] font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
              <Link2 className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
                Нет настроенных webhooks
              </h3>
              <p className="text-[14px] text-[#767692] mb-4">
                Создайте webhook для получения уведомлений о событиях в системе
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                <Plus className="w-4 h-4" />
                Создать первый webhook
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                О Webhooks
              </h4>
              <p className="text-[13px] text-[#767692]">
                Webhooks позволяют получать HTTP-уведомления при возникновении событий в системе. 
                Убедитесь, что ваш endpoint доступен и возвращает статус 200 OK. 
                Все запросы подписываются secret ключом для безопасности.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b-2 border-[#e6e8ee] flex items-center justify-between">
              <h2 className="text-[20px] font-medium text-[#21214f]">Создать webhook</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[13px] font-medium text-[#21214f] mb-2">
                    Название <span className="text-[#d4183d]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Мой webhook"
                    className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors ${
                      formErrors.name
                        ? 'border-[#d4183d] focus:border-[#d4183d]'
                        : 'border-[#e6e8ee] focus:border-[#5b8def]'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[12px] text-[#d4183d] mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* URL */}
                <div>
                  <label className="block text-[13px] font-medium text-[#21214f] mb-2">
                    Endpoint URL <span className="text-[#d4183d]">*</span>
                  </label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors font-mono ${
                      formErrors.url
                        ? 'border-[#d4183d] focus:border-[#d4183d]'
                        : 'border-[#e6e8ee] focus:border-[#5b8def]'
                    }`}
                  />
                  {formErrors.url && (
                    <p className="text-[12px] text-[#d4183d] mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.url}
                    </p>
                  )}
                </div>

                {/* Secret */}
                <div>
                  <label className="block text-[13px] font-medium text-[#21214f] mb-2">
                    Secret (опционально)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formSecret}
                      onChange={(e) => setFormSecret(e.target.value)}
                      placeholder="Будет сгенерирован автоматически"
                      className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] focus:border-[#5b8def] focus:outline-none transition-colors font-mono"
                    />
                    <button
                      onClick={() => setFormSecret(generateSecret())}
                      className="px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[13px] font-medium"
                    >
                      Сгенерировать
                    </button>
                  </div>
                  <p className="text-[12px] text-[#767692] mt-1">
                    Secret используется для подписи запросов
                  </p>
                </div>

                {/* Events */}
                <div>
                  <label className="block text-[13px] font-medium text-[#21214f] mb-2">
                    События <span className="text-[#d4183d]">*</span>
                  </label>
                  <div className="space-y-2">
                    {WEBHOOK_EVENTS.map(event => (
                      <label
                        key={event.value}
                        className="flex items-start gap-3 p-3 border-2 border-[#e6e8ee] rounded-[12px] cursor-pointer hover:bg-[#f9f9f9] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formEvents.includes(event.value)}
                          onChange={() => toggleEvent(event.value)}
                          className="w-5 h-5 text-[#5b8def] rounded-[4px] mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="text-[14px] font-medium text-[#21214f]">{event.label}</p>
                          <p className="text-[12px] text-[#767692] mt-0.5">{event.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formErrors.events && (
                    <p className="text-[12px] text-[#d4183d] mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.events}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t-2 border-[#e6e8ee] flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Secret Modal */}
      {showSecretModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSecretModal(null)}
        >
          <div
            className="bg-white rounded-[20px] w-full max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-[#e6e8ee] flex items-center justify-between">
              <h2 className="text-[18px] font-medium text-[#21214f]">Webhook Secret</h2>
              <button
                onClick={() => setShowSecretModal(null)}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>
            <div className="p-6">
              <div className="p-4 bg-[#f9f9f9] rounded-[12px] border-2 border-[#e6e8ee] mb-4">
                <p className="text-[14px] font-mono text-[#21214f] break-all">{showSecretModal}</p>
              </div>
              <p className="text-[13px] text-[#767692]">
                Используйте этот secret для проверки подписи входящих webhook запросов. 
                Храните его в безопасности и не передавайте третьим лицам.
              </p>
            </div>
            <div className="px-6 py-4 border-t-2 border-[#e6e8ee]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showSecretModal);
                  alert('✓ Secret скопирован в буфер обмена');
                }}
                className="w-full px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium"
              >
                Копировать в буфер
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
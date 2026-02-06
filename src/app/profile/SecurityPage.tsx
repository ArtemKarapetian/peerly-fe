import { useState } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Lock, Shield, Key, Smartphone, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { getFeatureFlags, setFeatureFlag } from '@/app/utils/featureFlags';

/**
 * SecurityPage - Security settings
 */

export default function SecurityPage() {
  const flags = getFeatureFlags();
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(flags.twoFactor);
  
  const emailVerificationEnabled = flags.enableEmailConfirmation;
  
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordSuccess(true);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setShowPasswordSuccess(false), 3000);
  };

  const handleToggle2FA = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    setFeatureFlag('twoFactor', newValue);
  };

  const sessions = [
    {
      device: 'Chrome on Windows',
      location: 'Moscow, Russia',
      ip: '192.168.1.100',
      lastActive: '2 минуты назад',
      current: true
    },
    {
      device: 'Safari on iPhone',
      location: 'Moscow, Russia',
      ip: '192.168.1.101',
      lastActive: '2 часа назад',
      current: false
    }
  ];

  return (
    <AppShell title="Security">
      <Breadcrumbs items={['Settings', 'Security']} />

      <div className="mt-6 max-w-[800px]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Безопасность
            </h1>
            <p className="text-[16px] text-[#767692]">
              Управление паролем и настройками безопасности
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#5b8def]" />
            </div>
            <h2 className="text-[20px] font-medium text-[#21214f]">Изменить пароль</h2>
          </div>

          {showPasswordSuccess && (
            <div className="mb-4 p-4 bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[12px] flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#4caf50]" />
              <p className="text-[14px] text-[#4caf50] font-medium">Пароль успешно изменён!</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[15px] font-medium"
            >
              Обновить пароль
            </button>
          </form>
        </div>

        {/* Email Verification - Feature flag controlled */}
        {emailVerificationEnabled && (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#5b8def]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[20px] font-medium text-[#21214f] mb-2">
                    Подтверждение email
                  </h2>
                  <p className="text-[14px] text-[#767692] mb-4">
                    Email: <strong className="text-[#21214f]">ivan.petrov@university.edu</strong>
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-[#fff5e6] border-2 border-[#ff9800] rounded-[12px]">
                    <AlertCircle className="w-5 h-5 text-[#ff9800] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[14px] text-[#ff9800] font-medium">
                        Email не подтверждён
                      </p>
                      <p className="text-[13px] text-[#767692] mt-1">
                        Подтвердите ваш email для доступа ко всем функциям платформы
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <a
              href="#/verify-email"
              className="mt-4 inline-block px-6 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[15px] font-medium"
            >
              Подтвердить email
            </a>
          </div>
        )}

        {/* Two-Factor Authentication */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-[#5b8def]" />
              </div>
              <div>
                <h2 className="text-[20px] font-medium text-[#21214f] mb-2">
                  Двухфакторная аутентификация
                </h2>
                <p className="text-[14px] text-[#767692]">
                  Добавьте дополнительный уровень защиты вашего аккаунта
                </p>
              </div>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-[#4caf50]' : 'bg-[#d7d7d7]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-[#e8f5e9] border-2 border-[#4caf50] rounded-[12px] flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#4caf50] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] text-[#4caf50] font-medium mb-1">
                  2FA включена
                </p>
                <p className="text-[13px] text-[#767692]">
                  При входе потребуется код из приложения-аутентификатора
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5b8def]" />
            </div>
            <h2 className="text-[20px] font-medium text-[#21214f]">Активные сессии</h2>
          </div>

          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <div key={idx} className="p-4 border-2 border-[#e6e8ee] rounded-[12px]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[16px] font-medium text-[#21214f]">{session.device}</h3>
                      {session.current && (
                        <span className="px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
                          Текущая
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#767692] mb-1">
                      📍 {session.location}
                    </p>
                    <p className="text-[13px] text-[#767692]">
                      IP: {session.ip} • {session.lastActive}
                    </p>
                  </div>
                  {!session.current && (
                    <button className="px-4 py-2 text-[#d4183d] hover:bg-[#fff5f5] rounded-[8px] text-[13px] font-medium transition-colors">
                      Завершить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[14px] font-medium">
            Завершить все другие сессии
          </button>
        </div>
      </div>
    </AppShell>
  );
}
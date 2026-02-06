import { useState } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Monitor, Sun, Moon, Globe, Clock, Info, ExternalLink, Shield } from 'lucide-react';

/**
 * SettingsPage - Application Settings
 * 
 * Sections:
 * - Appearance: Theme selection (Light/Dark/System) - UI only, Light theme only for now
 * - Language: RU/EN selector
 * - Time zone: Selector with common zones + Auto
 * - About: App version, Status page, Terms/Policy links
 */

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'ru' | 'en';

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('ru');
  const [timezone, setTimezone] = useState('auto');

  const timezones = [
    { value: 'auto', label: 'Автоматически' },
    { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
    { value: 'Europe/London', label: 'Лондон (UTC+0)' },
    { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'Лос-Анджелес (UTC-8)' },
    { value: 'Asia/Tokyo', label: 'Токио (UTC+9)' },
  ];

  return (
    <AppShell title="Настройки">
      <Breadcrumbs items={['Настройки']} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          Настройки
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">
          Управление настройками приложения
        </p>

        {/* Appearance Section */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
              <Monitor className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-[20px] font-medium text-foreground">Внешний вид</h2>
          </div>

          <p className="text-[14px] text-muted-foreground mb-4">
            Выберите тему оформления интерфейса
          </p>

          {/* Theme Selector - Segmented Control */}
          <div className="inline-flex bg-muted rounded-[12px] p-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
                theme === 'light'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="w-4 h-4" />
              Светлая
            </button>
            <button
              onClick={() => setTheme('dark')}
              disabled
              className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all opacity-40 cursor-not-allowed ${
                theme === 'dark'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
              title="Темная тема скоро будет доступна"
            >
              <Moon className="w-4 h-4" />
              Тёмная
            </button>
            <button
              onClick={() => setTheme('system')}
              disabled
              className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all opacity-40 cursor-not-allowed ${
                theme === 'system'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
              title="Автоматическая тема скоро будет доступна"
            >
              <Monitor className="w-4 h-4" />
              Системная
            </button>
          </div>

          <p className="text-[13px] text-muted-foreground mt-3 italic">
            * Темная и системная темы будут доступны в следующих версиях
          </p>
        </div>

        {/* Language Section */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-[20px] font-medium text-foreground">Язык</h2>
          </div>

          <p className="text-[14px] text-muted-foreground mb-4">
            Выберите язык интерфейса
          </p>

          <div className="inline-flex bg-muted rounded-[12px] p-1">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
                language === 'ru'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
                language === 'en'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          <p className="text-[13px] text-muted-foreground mt-3 italic">
            * Переключение языка влияет только на интерфейс
          </p>
        </div>

        {/* Time Zone Section */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-[20px] font-medium text-foreground">Часовой пояс</h2>
          </div>

          <p className="text-[14px] text-muted-foreground mb-4">
            Выберите часовой пояс для отображения времени
          </p>

          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full max-w-[400px] px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground bg-card focus:border-accent focus:outline-none transition-colors"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* About Section */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
              <Info className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-[20px] font-medium text-foreground">О приложении</h2>
          </div>

          <div className="space-y-4">
            {/* Security Link */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[15px] text-muted-foreground">Безопасность</span>
              <a
                href="#/security"
                className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
              >
                Пароль и 2FA
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* App Version */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[15px] text-muted-foreground">Версия приложения</span>
              <span className="text-[15px] font-medium text-foreground">v1.0.0</span>
            </div>

            {/* Status Page Link */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[15px] text-muted-foreground">Статус системы</span>
              <a
                href="#/status"
                className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
              >
                Проверить статус
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Terms Link */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[15px] text-muted-foreground">Условия использования</span>
              <a
                href="#/terms"
                className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
              >
                Читать
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Privacy Policy Link */}
            <div className="flex items-center justify-between py-3">
              <span className="text-[15px] text-muted-foreground">Политика конфиденциальности</span>
              <a
                href="#/privacy"
                className="inline-flex items-center gap-2 text-[14px] text-accent-foreground hover:opacity-80 transition-opacity"
              >
                Читать
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
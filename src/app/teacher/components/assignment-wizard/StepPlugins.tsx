import { Shield, Code, FileCheck, UserX, Settings } from 'lucide-react';
import type { AssignmentFormData } from '../../TeacherCreateAssignmentPage';

/**
 * StepPlugins - Шаг 5: Плагины и автоматические проверки
 * 
 * - Проверка на плагиат
 * - Линтинг кода
 * - Проверка форматов файлов
 * - Анонимизация данных
 */

interface StepPluginsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepPlugins({ data, onUpdate }: StepPluginsProps) {
  const toggleFormatRule = (rule: string) => {
    const rules = data.formatRules || [];
    if (rules.includes(rule)) {
      onUpdate({ formatRules: rules.filter((r) => r !== rule) });
    } else {
      onUpdate({ formatRules: [...rules, rule] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Плагины и проверки
        </h2>
        <p className="text-[15px] text-[#767692]">
          Настройте автоматические проверки для повышения качества работ
        </p>
      </div>

      {/* Plagiarism Check */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-[#f9f9f9] rounded-[8px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                Проверка на плагиат
              </h3>
              <p className="text-[13px] text-[#767692]">
                Автоматическая проверка работ на заимствования и совпадения
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enablePlagiarismCheck}
              onChange={(e) =>
                onUpdate({ enablePlagiarismCheck: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b8def]"></div>
          </label>
        </div>

        {data.enablePlagiarismCheck && (
          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">
              Порог совпадения (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={data.plagiarismThreshold}
                onChange={(e) =>
                  onUpdate({ plagiarismThreshold: parseInt(e.target.value) })
                }
                className="flex-1"
              />
              <span className="text-[16px] font-medium text-[#21214f] w-12 text-right">
                {data.plagiarismThreshold}%
              </span>
            </div>
            <p className="text-[12px] text-[#767692] mt-2">
              Работы с совпадением выше {data.plagiarismThreshold}% будут отмечены
              для проверки
            </p>
          </div>
        )}
      </div>

      {/* Linter */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-[#f9f9f9] rounded-[8px] flex items-center justify-center">
              <Code className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                Линтинг кода
              </h3>
              <p className="text-[13px] text-[#767692]">
                Проверка кода на соответствие стандартам и best practices
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableLinter}
              onChange={(e) => onUpdate({ enableLinter: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b8def]"></div>
          </label>
        </div>

        {data.enableLinter && (
          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            <label className="block text-[13px] font-medium text-[#21214f] mb-2">
              Конфигурация линтера
            </label>
            <select
              value={data.linterConfig}
              onChange={(e) => onUpdate({ linterConfig: e.target.value })}
              className="w-full px-3 py-2 border-2 border-[#e6e8ee] rounded-[8px] text-[14px] focus:outline-none focus:border-[#5b8def] bg-white"
            >
              <option value="">Выберите preset...</option>
              <option value="eslint-recommended">ESLint Recommended</option>
              <option value="airbnb">Airbnb Style Guide</option>
              <option value="google">Google Style Guide</option>
              <option value="standard">JavaScript Standard</option>
              <option value="custom">Пользовательская конфигурация</option>
            </select>
            <p className="text-[12px] text-[#767692] mt-2">
              Результаты линтинга будут показаны студентам до отправки работы
            </p>
          </div>
        )}
      </div>

      {/* Format Check */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-[#f9f9f9] rounded-[8px] flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                Проверка форматов
              </h3>
              <p className="text-[13px] text-[#767692]">
                Ограничение допустимых форматов файлов
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableFormatCheck}
              onChange={(e) => onUpdate({ enableFormatCheck: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b8def]"></div>
          </label>
        </div>

        {data.enableFormatCheck && (
          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            <label className="block text-[13px] font-medium text-[#21214f] mb-3">
              Разрешенные форматы
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                'pdf',
                'docx',
                'txt',
                'zip',
                'rar',
                'jpg',
                'png',
                'py',
                'js',
                'html',
                'css',
                'md',
              ].map((format) => (
                <label
                  key={format}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={data.formatRules?.includes(format) || false}
                    onChange={() => toggleFormatRule(format)}
                    className="w-4 h-4 rounded border-2 border-[#e6e8ee] text-[#5b8def] focus:ring-[#5b8def]"
                  />
                  <span className="text-[13px] text-[#21214f] uppercase">
                    .{format}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-[12px] text-[#767692] mt-3">
              Файлы других форматов будут отклонены при загрузке
            </p>
          </div>
        )}
      </div>

      {/* Anonymization */}
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-[#f9f9f9] rounded-[8px] flex items-center justify-center">
              <UserX className="w-5 h-5 text-[#5b8def]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                Автоматическая анонимизация
              </h3>
              <p className="text-[13px] text-[#767692]">
                Автоматическое удаление имен и персональных данных из работ
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableAnonymization}
              onChange={(e) => onUpdate({ enableAnonymization: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e6e8ee] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b8def]"></div>
          </label>
        </div>

        {data.enableAnonymization && (
          <div className="ml-13 pl-5 border-l-2 border-[#e6e8ee]">
            <p className="text-[13px] text-[#767692]">
              Система автоматически заменит имена студентов и другие идентификаторы
              на анонимные коды перед отправкой на рецензирование.
            </p>
            <div className="mt-3 bg-[#f9f9f9] rounded-[8px] p-3">
              <p className="text-[12px] text-[#21214f] mb-1 font-medium">
                Будут заменены:
              </p>
              <ul className="text-[12px] text-[#767692] space-y-1 ml-4 list-disc">
                <li>ФИО студента</li>
                <li>Email адреса</li>
                <li>Номера студенческих билетов</li>
                <li>Другие идентифицирующие данные</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[#e9f5ff] border border-[#a0b8f1] rounded-[12px] p-4">
        <div className="flex items-start gap-2">
          <Settings className="w-5 h-5 text-[#5b8def] shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#21214f]">
            <p className="font-medium mb-1">Все плагины опциональны</p>
            <p className="text-[#767692]">
              Вы можете включить или отключить любые проверки. Настройки можно
              изменить и после публикации задания.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

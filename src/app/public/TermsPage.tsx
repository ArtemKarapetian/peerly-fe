import { PublicLayout } from '@/app/components/PublicLayout';
import { FileText, Shield, Mail } from 'lucide-react';

/**
 * TermsPage - Terms of Service & Privacy Policy
 * 
 * Clean structured page with:
 * - Table of contents
 * - Terms of use
 * - Privacy policy
 * - Contact information
 */

export default function TermsPage() {
  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PublicLayout maxWidth="lg">
      <div className="py-8 tablet:py-12 desktop:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-8 tablet:mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <FileText className="size-6 text-primary" />
              </div>
              <h1 className="text-[32px] tablet:text-[40px] font-medium text-foreground tracking-[-0.5px]">
                Условия и политика
              </h1>
            </div>
            <p className="text-[15px] text-muted-foreground">
              Последнее обновление: 25 января 2026
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-accent/50 border-2 border-border rounded-xl p-6 mb-8">
            <h2 className="text-[18px] font-medium text-foreground mb-4">
              Содержание
            </h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection('terms-of-use')}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → Условия использования
              </button>
              <button
                onClick={() => scrollToSection('privacy-policy')}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → Политика конфиденциальности
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → Контакты
              </button>
            </nav>
          </div>

          {/* Terms of Use */}
          <section id="terms-of-use" className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 mb-6 scroll-mt-4">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                Условия использования
              </h2>
            </div>

            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  1. Принятие условий
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Используя платформу Peerly, вы соглашаетесь с настоящими условиями использования. 
                  Если вы не согласны с этими условиями, пожалуйста, не используйте сервис.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  2. Использование сервиса
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  Peerly предоставляет платформу для взаимного рецензирования студенческих работ. 
                  Вы обязуетесь:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>Использовать сервис только в образовательных целях</li>
                  <li>Предоставлять честные и конструктивные отзывы</li>
                  <li>Не загружать материалы, нарушающие авторские права</li>
                  <li>Соблюдать академическую честность</li>
                  <li>Уважительно относиться к работам других студентов</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  3. Учётные записи
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Вы несёте ответственность за сохранность данных своей учётной записи. 
                  Немедленно сообщайте о любом несанкционированном использовании вашего аккаунта.
                  Предоставление ложной информации при регистрации может привести к блокировке аккаунта.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  4. Интеллектуальная собственность
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Вы сохраняете все права на загружаемый контент. Загружая работы, вы предоставляете 
                  ограниченную лицензию на использование материалов в рамках процесса обучения и 
                  рецензирования внутри вашего курса.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  5. Ограничение ответственности
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Сервис предоставляется "как есть". Мы не несём ответственности за точность оценок 
                  или отзывов, предоставленных другими пользователями. Финальные оценки определяются 
                  преподавателем курса.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  6. Изменения условий
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Мы оставляем за собой право изменять эти условия в любое время. 
                  Продолжая использовать сервис после изменений, вы принимаете новые условия.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy-policy" className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 mb-6 scroll-mt-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                Политика конфиденциальности
              </h2>
            </div>

            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  1. Сбор данных
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  Мы собираем следующую информацию:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>Имя, email и учебная информация при регистрации</li>
                  <li>Загружаемые академические работы и отзывы</li>
                  <li>Данные об использовании платформы (логи, метрики)</li>
                  <li>Информация о курсах и заданиях</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  2. Использование данных
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  Собранные данные используются для:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>Предоставления и улучшения сервиса</li>
                  <li>Организации процесса peer review</li>
                  <li>Формирования оценок и аналитики</li>
                  <li>Коммуникации с пользователями</li>
                  <li>Обеспечения безопасности платформы</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  3. Доступ к данным
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Загружаемые работы видны только преподавателю курса и студентам, 
                  назначенным для рецензирования (в соответствии с настройками анонимности задания). 
                  Преподаватели имеют доступ ко всем работам и отзывам в своих курсах.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  4. Хранение данных
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Мы храним ваши данные в течение активного использования сервиса и 
                  разумного периода после завершения курса для архивных целей. 
                  Вы можете запросить удаление своих данных в любое время.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  5. Безопасность
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Мы применяем современные меры безопасности для защиты ваших данных, 
                  включая шифрование при передаче и хранении, контроль доступа и 
                  регулярный аудит систем безопасности.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  6. Ваши права
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  Вы имеете право:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>Получить копию своих персональных данных</li>
                  <li>Исправить неточную информацию</li>
                  <li>Запросить удаление данных (с учётом академических требований)</li>
                  <li>Ограничить обработку данных</li>
                  <li>Отозвать согласие на обработку</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 scroll-mt-4">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                Контакты
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                По вопросам условий использования и политики конфиденциальности 
                обращайтесь к нам:
              </p>

              <div className="bg-accent/50 border border-border rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <a 
                    href="mailto:legal@peerly.edu" 
                    className="text-[15px] text-primary hover:underline font-medium"
                  >
                    legal@peerly.edu
                  </a>
                </div>

                <div>
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
                    Поддержка
                  </p>
                  <a 
                    href="mailto:support@peerly.edu" 
                    className="text-[15px] text-primary hover:underline font-medium"
                  >
                    support@peerly.edu
                  </a>
                </div>

                <div>
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
                    Справка
                  </p>
                  <a 
                    href="#/help" 
                    className="text-[15px] text-primary hover:underline font-medium"
                  >
                    Центр помощи
                  </a>
                </div>
              </div>

              <p className="text-[13px] text-muted-foreground pt-4 border-t border-border">
                Мы стремимся ответить на все запросы в течение 2-3 рабочих дней.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

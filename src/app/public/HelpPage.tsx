import { useState, useMemo } from "react";
import { PublicLayout } from "@/app/components/PublicLayout";
import { Search, ChevronDown, MessageCircle, Mail } from "lucide-react";
import { useFeatureFlags } from "@/app/providers/feature-flags.tsx";

/**
 * HelpPage - FAQ и поддержка пользователей
 *
 * Секции:
 * - Getting Started (вход, курсы, сдача, рецензирование)
 * - Troubleshooting (проблемы с входом, курсами, загрузкой)
 * - Contact Support (чат или инструкция связаться с админом)
 *
 * Features:
 * - Accordion UI для FAQ
 * - Поиск по вопросам и ответам (client-side)
 * - Интеграция с feature flag supportChat
 */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "getting-started" | "troubleshooting" | "contact";
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "gs-1",
    question: "Как войти в систему Peerly?",
    answer:
      "Перейдите на страницу входа, введите ваш email и пароль. Если вы новый пользователь, вам необходимо сначала зарегистрироваться или получить приглашение от вашего преподавателя.",
    category: "getting-started",
  },
  {
    id: "gs-2",
    question: "Где я могу найти список своих курсов?",
    answer:
      'После входа в систему перейдите в раздел "Курсы" через боковое меню. Там вы увидите все курсы, в которых вы участвуете как студент или преподаватель.',
    category: "getting-started",
  },
  {
    id: "gs-3",
    question: "Как сдать задание?",
    answer:
      'Откройте нужный курс, выберите задание из списка. Нажмите кнопку "Сдать работу" и загрузите ваш файл или введите текст в соответствующее поле. Убедитесь, что вы соблюдаете формат и дедлайн.',
    category: "getting-started",
  },
  {
    id: "gs-4",
    question: "Как проверить работу другого студента?",
    answer:
      'В разделе "Рецензии" вы увидите работы, назначенные вам для проверки. Откройте работу, изучите материал и заполните рубрику оценивания. Оставьте конструктивный комментарий и отправьте рецензию.',
    category: "getting-started",
  },
  {
    id: "gs-5",
    question: "Что такое рубрика оценивания?",
    answer:
      "Рубрика — это набор критериев для оценки работы. Каждый критерий имеет определенное количество баллов. Преподаватель создает рубрики для каждого задания, чтобы обеспечить объективную оценку.",
    category: "getting-started",
  },
  {
    id: "gs-6",
    question: "Как посмотреть мои оценки?",
    answer:
      'Перейдите в раздел "Журнал оценок" в боковом меню. Там вы увидите все оценки по всем курсам, включая оценки от peer-review и финальные оценки от преподавателя.',
    category: "getting-started",
  },

  // Troubleshooting
  {
    id: "ts-1",
    question: "Не могу войти в систему. Что делать?",
    answer:
      'Убедитесь, что вы вводите правильный email и пароль. Проверьте, не включен ли Caps Lock. Если вы забыли пароль, используйте функцию "Восстановить пароль" на странице входа. Если проблема сохраняется, свяжитесь с администратором.',
    category: "troubleshooting",
  },
  {
    id: "ts-2",
    question: "Я не вижу свой курс в списке",
    answer:
      "Проверьте, что вы зарегистрированы на курс. Обратитесь к преподавателю, чтобы убедиться, что вас добавили в список участников. Попробуйте обновить страницу или выйти и войти заново.",
    category: "troubleshooting",
  },
  {
    id: "ts-3",
    question: "Не загружается файл при сдаче работы",
    answer:
      "Проверьте размер файла (не более 50 МБ) и формат (обычно допускаются PDF, DOC, DOCX, TXT). Убедитесь, что у вас стабильное интернет-соединение. Попробуйте другой браузер или очистите кэш.",
    category: "troubleshooting",
  },
  {
    id: "ts-4",
    question: "Задание исчезло из моего списка",
    answer:
      'Возможно, преподаватель изменил настройки видимости или дедлайн задания. Проверьте в разделе "Завершенные задания" или обратитесь к преподавателю за разъяснениями.',
    category: "troubleshooting",
  },
  {
    id: "ts-5",
    question: "Не получил назначенную мне работу для проверки",
    answer:
      "Распределение работ происходит автоматически после дедлайна сдачи. Если прошло более 24 часов, а работы все еще нет, свяжитесь с преподавателем.",
    category: "troubleshooting",
  },
  {
    id: "ts-6",
    question: "Мой комментарий к рецензии не сохраняется",
    answer:
      'Убедитесь, что вы нажали кнопку "Сохранить" или "Отправить" после написания комментария. Проверьте интернет-соединение и попробуйте еще раз. Скопируйте текст в буфер обмена на случай потери.',
    category: "troubleshooting",
  },

  // Contact Support
  {
    id: "cs-1",
    question: "Как связаться с технической поддержкой?",
    answer:
      "Вы можете связаться с поддержкой через чат в правом нижнем углу экрана (если доступно) или обратитесь к вашему преподавателю/администратору за помощью.",
    category: "contact",
  },
  {
    id: "cs-2",
    question: "Куда сообщить об ошибке в системе?",
    answer:
      "Если вы обнаружили ошибку, опишите проблему максимально подробно (что вы делали, какая ошибка произошла, скриншоты) и отправьте через форму обратной связи или напишите преподавателю.",
    category: "contact",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { flags } = useFeatureFlags();

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Group FAQs by category
  const sections = useMemo(() => {
    return {
      "getting-started": filteredFAQs.filter((item) => item.category === "getting-started"),
      troubleshooting: filteredFAQs.filter((item) => item.category === "troubleshooting"),
      contact: filteredFAQs.filter((item) => item.category === "contact"),
    };
  }, [filteredFAQs]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderFAQItem = (item: FAQItem) => {
    const isOpen = openItems.has(item.id);

    return (
      <div key={item.id} className="border border-border rounded-[12px] overflow-hidden bg-white">
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <span className="font-medium text-foreground pr-4">{item.question}</span>
          <ChevronDown
            className={`size-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && <div className="px-4 pb-4 pt-0 text-muted-foreground">{item.answer}</div>}
      </div>
    );
  };

  return (
    <PublicLayout showTopBar={true} showLoginButton={true} maxWidth="lg">
      <div className="py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl tablet:text-5xl font-semibold text-[#21214f] mb-4">
            Помощь и поддержка
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            Найдите ответы на часто задаваемые вопросы или свяжитесь с поддержкой
          </p>
        </div>

        {/* Search */}
        <div className="max-w-[600px] mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#a0b8f1] focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-[800px] mx-auto space-y-12">
          {/* Getting Started */}
          {sections["getting-started"].length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-[#21214f] mb-6">Начало работы</h2>
              <div className="space-y-3">{sections["getting-started"].map(renderFAQItem)}</div>
            </section>
          )}

          {/* Troubleshooting */}
          {sections.troubleshooting.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-[#21214f] mb-6">Решение проблем</h2>
              <div className="space-y-3">{sections.troubleshooting.map(renderFAQItem)}</div>
            </section>
          )}

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-semibold text-[#21214f] mb-6">Связаться с поддержкой</h2>

            {/* Contact FAQs */}
            {sections.contact.length > 0 && (
              <div className="space-y-3 mb-6">{sections.contact.map(renderFAQItem)}</div>
            )}

            {/* Support Options */}
            <div className="bg-[#d2e1f8] rounded-[20px] p-6 tablet:p-8">
              <h3 className="text-xl font-semibold text-[#21214f] mb-4">
                Не нашли ответ на свой вопрос?
              </h3>

              {flags.supportChat ? (
                // Show chat link if supportChat flag is enabled
                <div className="space-y-4">
                  <p className="text-[#21214f]/80">
                    Свяжитесь с нами через чат, и мы поможем вам в режиме реального времени.
                  </p>
                  <a
                    href="#/support/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d6bc6] hover:bg-[#2f5aaf] text-white font-medium rounded-[12px] transition-colors"
                  >
                    <MessageCircle className="size-5" />
                    Открыть чат поддержки
                  </a>
                </div>
              ) : (
                // Show instructor/admin contact info if chat is disabled
                <div className="space-y-4">
                  <p className="text-[#21214f]/80">
                    Обратитесь к вашему преподавателю или администратору курса за помощью. Они
                    смогут ответить на вопросы, связанные с вашими заданиями и курсами.
                  </p>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-[12px]">
                    <Mail className="size-5 text-[#3d6bc6] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#21214f] mb-1">
                        Свяжитесь с преподавателем
                      </div>
                      <div className="text-sm text-[#21214f]/70">
                        Используйте email или систему объявлений курса для связи с вашим
                        преподавателем
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* No Results */}
          {searchQuery && filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Ничего не найдено по запросу "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Попробуйте изменить поисковый запрос
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

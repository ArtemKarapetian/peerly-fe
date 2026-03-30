import { Search, ChevronDown, MessageCircle, Mail } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useFeatureFlags } from "@/shared/lib/feature-flags-provider";

import { PublicLayout } from "@/widgets/public-layout";

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
  questionKey: string;
  answerKey: string;
  category: "getting-started" | "troubleshooting" | "contact";
}

const faqKeys: FAQItem[] = [
  // Getting Started
  {
    id: "gs-1",
    questionKey: "page.help.faq.gs1q",
    answerKey: "page.help.faq.gs1a",
    category: "getting-started",
  },
  {
    id: "gs-2",
    questionKey: "page.help.faq.gs2q",
    answerKey: "page.help.faq.gs2a",
    category: "getting-started",
  },
  {
    id: "gs-3",
    questionKey: "page.help.faq.gs3q",
    answerKey: "page.help.faq.gs3a",
    category: "getting-started",
  },
  {
    id: "gs-4",
    questionKey: "page.help.faq.gs4q",
    answerKey: "page.help.faq.gs4a",
    category: "getting-started",
  },
  {
    id: "gs-5",
    questionKey: "page.help.faq.gs5q",
    answerKey: "page.help.faq.gs5a",
    category: "getting-started",
  },
  {
    id: "gs-6",
    questionKey: "page.help.faq.gs6q",
    answerKey: "page.help.faq.gs6a",
    category: "getting-started",
  },
  // Troubleshooting
  {
    id: "ts-1",
    questionKey: "page.help.faq.ts1q",
    answerKey: "page.help.faq.ts1a",
    category: "troubleshooting",
  },
  {
    id: "ts-2",
    questionKey: "page.help.faq.ts2q",
    answerKey: "page.help.faq.ts2a",
    category: "troubleshooting",
  },
  {
    id: "ts-3",
    questionKey: "page.help.faq.ts3q",
    answerKey: "page.help.faq.ts3a",
    category: "troubleshooting",
  },
  {
    id: "ts-4",
    questionKey: "page.help.faq.ts4q",
    answerKey: "page.help.faq.ts4a",
    category: "troubleshooting",
  },
  {
    id: "ts-5",
    questionKey: "page.help.faq.ts5q",
    answerKey: "page.help.faq.ts5a",
    category: "troubleshooting",
  },
  {
    id: "ts-6",
    questionKey: "page.help.faq.ts6q",
    answerKey: "page.help.faq.ts6a",
    category: "troubleshooting",
  },
  // Contact Support
  {
    id: "cs-1",
    questionKey: "page.help.faq.cs1q",
    answerKey: "page.help.faq.cs1a",
    category: "contact",
  },
  {
    id: "cs-2",
    questionKey: "page.help.faq.cs2q",
    answerKey: "page.help.faq.cs2a",
    category: "contact",
  },
];

export default function HelpPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { flags } = useFeatureFlags();

  // Build resolved FAQ data from translation keys
  const faqData = useMemo(
    () =>
      faqKeys.map((item) => ({
        ...item,
        question: t(item.questionKey),
        answer: t(item.answerKey),
      })),
    [t],
  );

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    );
  }, [searchQuery, faqData]);

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

  const renderFAQItem = (item: (typeof faqData)[number]) => {
    const isOpen = openItems.has(item.id);

    return (
      <div key={item.id} className="border border-border rounded-[12px] overflow-hidden bg-card">
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors text-left"
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
          <h1 className="text-4xl tablet:text-5xl font-semibold text-foreground mb-4">
            {t("page.help.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            {t("page.help.subtitle")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-[600px] mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("page.help.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-[800px] mx-auto space-y-12">
          {/* Getting Started */}
          {sections["getting-started"].length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t("page.help.gettingStarted")}
              </h2>
              <div className="space-y-3">{sections["getting-started"].map(renderFAQItem)}</div>
            </section>
          )}

          {/* Troubleshooting */}
          {sections.troubleshooting.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t("page.help.troubleshooting")}
              </h2>
              <div className="space-y-3">{sections.troubleshooting.map(renderFAQItem)}</div>
            </section>
          )}

          {/* Contact Support */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {t("page.help.contactSupport")}
            </h2>

            {/* Contact FAQs */}
            {sections.contact.length > 0 && (
              <div className="space-y-3 mb-6">{sections.contact.map(renderFAQItem)}</div>
            )}

            {/* Support Options */}
            <div className="bg-brand-primary-lighter rounded-[20px] p-6 tablet:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {t("page.help.noAnswerFound")}
              </h3>

              {flags.supportChat ? (
                // Show chat link if supportChat flag is enabled
                <div className="space-y-4">
                  <p className="text-foreground/80">{t("page.help.chatSupportDesc")}</p>
                  <Link
                    to="/support/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium rounded-[12px] transition-colors"
                  >
                    <MessageCircle className="size-5" />
                    {t("page.help.openChatSupport")}
                  </Link>
                </div>
              ) : (
                // Show instructor/admin contact info if chat is disabled
                <div className="space-y-4">
                  <p className="text-foreground/80">{t("page.help.contactInstructorDesc")}</p>
                  <div className="flex items-start gap-3 p-4 bg-card rounded-[12px]">
                    <Mail className="size-5 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground mb-1">
                        {t("page.help.contactInstructor")}
                      </div>
                      <div className="text-sm text-foreground/70">
                        {t("page.help.contactInstructorHint")}
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
                {t("page.help.notFoundQuery", { query: searchQuery })}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t("page.help.tryChangingSearch")}
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

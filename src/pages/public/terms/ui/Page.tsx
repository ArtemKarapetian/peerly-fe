import { FileText, Shield, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PublicLayout } from "@/widgets/public-layout";

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
  const { t } = useTranslation();

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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
                {t("page.terms.title")}
              </h1>
            </div>
            <p className="text-[15px] text-muted-foreground">{t("page.terms.lastUpdated")}</p>
          </div>

          {/* Table of Contents */}
          <div className="bg-accent/50 border-2 border-border rounded-xl p-6 mb-8">
            <h2 className="text-[18px] font-medium text-foreground mb-4">{t("page.terms.toc")}</h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection("terms-of-use")}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → {t("page.terms.tocTerms")}
              </button>
              <button
                onClick={() => scrollToSection("privacy-policy")}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → {t("page.terms.tocPrivacy")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block text-[15px] text-primary hover:underline text-left"
              >
                → {t("page.terms.tocContact")}
              </button>
            </nav>
          </div>

          {/* Terms of Use */}
          <section
            id="terms-of-use"
            className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 mb-6 scroll-mt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                {t("page.terms.termsTitle")}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms1Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.terms1Text")}
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms2Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  {t("page.terms.terms2Text")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>{t("page.terms.terms2Item1")}</li>
                  <li>{t("page.terms.terms2Item2")}</li>
                  <li>{t("page.terms.terms2Item3")}</li>
                  <li>{t("page.terms.terms2Item4")}</li>
                  <li>{t("page.terms.terms2Item5")}</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms3Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.terms3Text")}
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms4Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.terms4Text")}
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms5Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.terms5Text")}
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.terms6Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.terms6Text")}
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section
            id="privacy-policy"
            className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 mb-6 scroll-mt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                {t("page.terms.privacyTitle")}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy1Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  {t("page.terms.privacy1Text")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>{t("page.terms.privacy1Item1")}</li>
                  <li>{t("page.terms.privacy1Item2")}</li>
                  <li>{t("page.terms.privacy1Item3")}</li>
                  <li>{t("page.terms.privacy1Item4")}</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy2Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  {t("page.terms.privacy2Text")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>{t("page.terms.privacy2Item1")}</li>
                  <li>{t("page.terms.privacy2Item2")}</li>
                  <li>{t("page.terms.privacy2Item3")}</li>
                  <li>{t("page.terms.privacy2Item4")}</li>
                  <li>{t("page.terms.privacy2Item5")}</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy3Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.privacy3Text")}
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy4Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.privacy4Text")}
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy5Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {t("page.terms.privacy5Text")}
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h3 className="text-[20px] font-medium text-foreground mb-3">
                  {t("page.terms.privacy6Title")}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">
                  {t("page.terms.privacy6Text")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground ml-4">
                  <li>{t("page.terms.privacy6Item1")}</li>
                  <li>{t("page.terms.privacy6Item2")}</li>
                  <li>{t("page.terms.privacy6Item3")}</li>
                  <li>{t("page.terms.privacy6Item4")}</li>
                  <li>{t("page.terms.privacy6Item5")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 scroll-mt-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <Mail className="size-6 text-primary" />
              <h2 className="text-[28px] font-medium text-foreground">
                {t("page.terms.contactTitle")}
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                {t("page.terms.contactText")}
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
                    {t("page.terms.contactSupport")}
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
                    {t("page.terms.contactReference")}
                  </p>
                  <a href="#/help" className="text-[15px] text-primary hover:underline font-medium">
                    {t("page.terms.contactHelpCenter")}
                  </a>
                </div>
              </div>

              <p className="text-[13px] text-muted-foreground pt-4 border-t border-border">
                {t("page.terms.contactResponseTime")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

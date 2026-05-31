import { PublicLayout } from "@/widgets/public-layout";

import { ContactSection } from "./ContactSection";
import { TermsHeader } from "./TermsHeader";
import { TermsSection } from "./TermsSection";
import { TermsTableOfContents } from "./TermsTableOfContents";

export default function TermsPage() {
  return (
    <PublicLayout maxWidth="lg">
      <div className="py-8 tablet:py-12 desktop:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <TermsHeader />
          <TermsTableOfContents />
          <TermsSection />
          <ContactSection />
        </div>
      </div>
    </PublicLayout>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { CourseHeader, CourseTabs } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { CourseAssignmentsTab } from "@/widgets/course-assignments-tab";
import { CourseParticipantsTab } from "@/widgets/course-participants-tab";

interface CoursePageProps {
  courseId?: string;
}

export default function CoursePage({ courseId = "1" }: CoursePageProps) {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [activeTab, setActiveTab] = useState<"assignments" | "participants">("assignments");

  return (
    <AppShell title={t("page.courseDetail.title")}>
      <Breadcrumbs items={[CRUMBS.courses, { label: t("page.courseDetail.title") }]} />
      <div className="mb-2">
        <CourseHeader
          title={t("page.courseDetail.title")}
          teacher={t("page.courseDetail.teacher")}
        />
      </div>

      <CourseTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        assignmentsCount={6}
        participantsCount={24}
      />

      {activeTab === "assignments" && <CourseAssignmentsTab courseId={courseId} />}
      {activeTab === "participants" && <CourseParticipantsTab />}
    </AppShell>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { CourseHeader, CourseTabs } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { CourseAssignmentsTab } from "@/widgets/course-assignments-tab";
import { CourseParticipantsTab } from "@/widgets/course-participants-tab";

export default function CoursePage() {
  const { courseId: courseIdParam } = useParams();
  const courseId = courseIdParam ?? "1";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [activeTab, setActiveTab] = useState<"assignments" | "participants">("assignments");

  return (
    <AppShell title={t("page.courseDetail.title")}>
      <Breadcrumbs items={[CRUMBS.courses, { label: t("page.courseDetail.title") }]} />

      <div className="mt-6 space-y-6">
        <CourseHeader
          title={t("page.courseDetail.title")}
          teacher={t("page.courseDetail.teacher")}
        />

        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          <CourseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            assignmentsCount={6}
            participantsCount={24}
          />

          <div className="p-6">
            {activeTab === "assignments" && <CourseAssignmentsTab courseId={courseId} />}
            {activeTab === "participants" && <CourseParticipantsTab />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

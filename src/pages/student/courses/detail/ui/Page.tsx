import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { CourseHeader, CourseTabs } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { CourseAssignmentsTab } from "@/widgets/course-assignments-tab";
import { CourseParticipantsTab } from "@/widgets/course-participants-tab";

interface CoursePageProps {
  courseId?: string;
}

export default function CoursePage({ courseId = "1" }: CoursePageProps) {
  const [activeTab, setActiveTab] = useState<"assignments" | "participants">("assignments");

  return (
    <AppShell title="Название курса">
      <Breadcrumbs items={[CRUMBS.courses, { label: "Название курса" }]} />
      <div className="mb-2">
        <CourseHeader title="Название курса" teacher="Преподаватель" />
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

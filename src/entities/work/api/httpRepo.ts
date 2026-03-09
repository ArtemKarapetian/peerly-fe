import { http } from "@/shared/api";

import type { ApiSubmission } from "../model/api.types";
import { mapApiSubmission } from "../model/mappers";
import type { DemoSubmission } from "../model/types";

const GROUP_ID = "1"; // hardcoded — backend requires group_id

export const workHttpRepo = {
  getAll: (): Promise<DemoSubmission[]> => Promise.resolve([]),

  getForHomework: (
    studentId: string,
    courseId: string,
    homeworkId: string,
  ): Promise<DemoSubmission | null> =>
    http
      .get<ApiSubmission>(
        `/students/${studentId}/courses/${courseId}/groups/${GROUP_ID}/homeworks/${homeworkId}`,
      )
      .then(mapApiSubmission)
      .catch(() => null),

  update: (
    studentId: string,
    courseId: string,
    homeworkId: string,
    data: { content?: string; files?: string[] },
  ): Promise<DemoSubmission> =>
    http
      .put<ApiSubmission>(
        `/students/${studentId}/courses/${courseId}/groups/${GROUP_ID}/homeworks/${homeworkId}`,
        data,
      )
      .then(mapApiSubmission),
};

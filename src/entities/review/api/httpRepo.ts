import { http } from "@/shared/api";

import type { ApiReview, ApiUpdateReviewPayload } from "../model/api.types";
import { mapApiReview } from "../model/mappers";
import type { DemoReview } from "../model/types";

const GROUP_ID = "1"; // hardcoded — backend requires group_id

export const reviewHttpRepo = {
  getAll: (): Promise<DemoReview[]> => Promise.resolve([]),

  getForHomework: (
    studentId: string,
    courseId: string,
    homeworkId: string,
  ): Promise<DemoReview[]> =>
    http
      .get<
        ApiReview[]
      >(`/students/${studentId}/courses/${courseId}/groups/${GROUP_ID}/homeworks/${homeworkId}/reviews`)
      .then((rs) => rs.map(mapApiReview)),

  update: (
    studentId: string,
    courseId: string,
    homeworkId: string,
    reviewId: string,
    payload: ApiUpdateReviewPayload,
  ): Promise<DemoReview> =>
    http
      .put<ApiReview>(
        `/students/${studentId}/courses/${courseId}/groups/${GROUP_ID}/homeworks/${homeworkId}/reviews/${reviewId}`,
        payload,
      )
      .then(mapApiReview),
};

import {
  type CourseDto,
  type CreateSubmittedReviewRequestBody,
  type CreateSubmittedReviewResponse,
  type GetAssignedReviewResponse,
  type GetSubmittedReviewResponse,
  type GetTeacherSubmittedHomeworkResponse,
  type HomeworkDto,
  type ListAssignedReviewsResponse,
  type SubmittedHomeworkOverviewDto,
  type UpdateSubmittedReviewRequestBody,
  fileFromDto,
  getSession,
  http,
  paged,
} from "@/shared/api";

import { mapDtoToReview } from "../model/mappers";
import type { DemoReview } from "../model/types";

// BE wire shapes — translate to FE-clean shapes inside this module.
type RawListCourses = { courseInfos: CourseDto[] };
type RawListTeacherHomeworks = { teacherHomeworkInfos: HomeworkDto[] };
type RawListSubmissionsOverview = { submittedHomeworks: SubmittedHomeworkOverviewDto[] };

export interface AssignedReviewEntry {
  submissionId: string;
  studentName: string;
  studentId: string;
  homeworkId: string;
}

export interface SubmissionToReview {
  id: string;
  comment: string;
  files: { id: string; name: string; size: number }[];
  checklist: string;
  submittedReviewId: string | null;
}

export const reviewHttpRepo = {
  /**
   * Cross-cutting teacher aggregate — reviews don't have a flat list
   * endpoint, so we derive them by walking submissions. Students get
   * an empty list.
   */
  getAll: async (): Promise<DemoReview[]> => {
    if (getSession()?.role !== "Teacher") return [];
    const courses = await http.get<RawListCourses>(paged("/teacher/courses"));
    const homeworkIdsPerCourse = await Promise.all(
      courses.courseInfos.map(async (c) => {
        try {
          const hws = await http.get<RawListTeacherHomeworks>(
            paged(`/teacher/courses/${c.id}/homeworks`),
          );
          return hws.teacherHomeworkInfos.map((h) => String(h.id));
        } catch {
          return [] as string[];
        }
      }),
    );
    const allHomeworkIds = homeworkIdsPerCourse.flat();

    const reviewLists = await Promise.all(
      allHomeworkIds.map(async (hwId) => {
        try {
          const overview = await http.get<RawListSubmissionsOverview>(
            paged(`/teacher/homeworks/${hwId}/submissions`),
          );
          const perSubmission = await Promise.all(
            overview.submittedHomeworks.map(async (s) => {
              try {
                const det = await http.get<GetTeacherSubmittedHomeworkResponse>(
                  `/teacher/submissions/${s.id}`,
                );
                return det.submittedReviews.map((r) =>
                  mapDtoToReview(r, { submissionId: String(s.id) }),
                );
              } catch {
                return [] as DemoReview[];
              }
            }),
          );
          return perSubmission.flat();
        } catch {
          return [] as DemoReview[];
        }
      }),
    );
    return reviewLists.flat();
  },

  listAssigned: async (homeworkId: string): Promise<AssignedReviewEntry[]> => {
    const res = await http.get<ListAssignedReviewsResponse>(
      paged(`/homeworks/${homeworkId}/assigned-reviews`),
    );
    return res.assignedReviews.map((r) => ({
      submissionId: String(r.submittedHomeworkId),
      studentId: String(r.studentId),
      studentName: r.studentName,
      homeworkId,
    }));
  },

  getAssignedSubmission: async (submissionId: string): Promise<SubmissionToReview> => {
    const res = await http.get<GetAssignedReviewResponse>(`/submissions/${submissionId}/reviews`);
    return {
      id: String(res.submission.submittedHomeworkId),
      comment: res.submission.comment,
      files: res.submission.files.map(fileFromDto),
      checklist: res.submission.checklist,
      submittedReviewId: res.submission.submittedReviewId
        ? String(res.submission.submittedReviewId)
        : null,
    };
  },

  create: async (
    submissionId: string,
    mark: number,
    comment: string,
  ): Promise<{ reviewId: string }> => {
    const body: CreateSubmittedReviewRequestBody = { mark, comment };
    const res = await http.post<CreateSubmittedReviewResponse>(
      `/submissions/${submissionId}/reviews`,
      body,
    );
    return { reviewId: String(res.reviewId) };
  },

  getById: async (reviewId: string): Promise<DemoReview | null> => {
    try {
      const res = await http.get<GetSubmittedReviewResponse>(`/reviews/${reviewId}`);
      return mapDtoToReview(res.submittedReview);
    } catch {
      return null;
    }
  },

  update: async (reviewId: string, mark: number, comment: string): Promise<void> => {
    const body: UpdateSubmittedReviewRequestBody = { mark, comment };
    await http.put<void>(`/reviews/${reviewId}`, body);
  },

  delete: async (reviewId: string): Promise<void> => {
    await http.delete<void>(`/reviews/${reviewId}`);
  },
};

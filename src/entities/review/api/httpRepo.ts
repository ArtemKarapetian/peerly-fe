import {
  ApiError,
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
import type { Review } from "../model/types";

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
  comment: string | null;
  files: { id: string; name: string; size: number }[];
  rubricId: string | null;
  submittedReviewId: string | null;
}

export const reviewHttpRepo = {
  /**
   * Cross-cutting teacher aggregate — reviews don't have a flat list
   * endpoint, so we derive them by walking submissions. Students get
   * an empty list.
   */
  getAll: async (): Promise<Review[]> => {
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
                return [] as Review[];
              }
            }),
          );
          return perSubmission.flat();
        } catch {
          return [] as Review[];
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
      rubricId: res.submission.rubricId != null ? String(res.submission.rubricId) : null,
      submittedReviewId: res.submission.submittedReviewId
        ? String(res.submission.submittedReviewId)
        : null,
    };
  },

  create: async (
    submissionId: string,
    scores: { criterionId: string; score: number; comment?: string | null }[],
    comment: string,
  ): Promise<{ reviewId: string }> => {
    const body: CreateSubmittedReviewRequestBody = {
      scores: scores.map((s) => ({
        rubricCriterionId: Number(s.criterionId),
        score: s.score,
        comment: s.comment ?? null,
      })),
      comment,
    };
    const res = await http.post<CreateSubmittedReviewResponse>(
      `/submissions/${submissionId}/reviews`,
      body,
    );
    return { reviewId: String(res.reviewId) };
  },

  getById: async (reviewId: string): Promise<Review | null> => {
    try {
      const res = await http.get<GetSubmittedReviewResponse>(`/reviews/${reviewId}`);
      return mapDtoToReview(res.submittedReview);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },

  update: async (
    reviewId: string,
    scores: { criterionId: string; score: number; comment?: string | null }[],
    comment: string,
  ): Promise<void> => {
    const body: UpdateSubmittedReviewRequestBody = {
      scores: scores.map((s) => ({
        rubricCriterionId: Number(s.criterionId),
        score: s.score,
        comment: s.comment ?? null,
      })),
      comment,
    };
    await http.put<void>(`/reviews/${reviewId}`, body);
  },

  delete: async (reviewId: string): Promise<void> => {
    await http.delete<void>(`/reviews/${reviewId}`);
  },
};

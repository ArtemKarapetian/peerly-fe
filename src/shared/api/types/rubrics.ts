import type { Id } from "./common";

export interface RubricInfoDto {
  id: Id;
  teacherId: Id;
  name: string;
}

export interface RubricCriterionInfoDto {
  id: Id;
  name: string;
  description?: string;
  maxScore: number;
  commentRequired: boolean;
  position: number;
}

export interface RubricCriterionInputDto {
  name: string;
  description?: string;
  maxScore: number;
  commentRequired: boolean;
  position: number;
}

export interface CreateRubricRequestBody {
  name: string;
  criteria: RubricCriterionInputDto[];
}

export interface CreateRubricResponse {
  rubricId: Id;
}

export interface UpdateRubricRequestBody {
  name: string;
  criteria: RubricCriterionInputDto[];
}

export interface ListRubricsResponse {
  rubrics: RubricInfoDto[];
}

export interface GetRubricResponse {
  rubric?: RubricInfoDto;
  criteria: RubricCriterionInfoDto[];
}

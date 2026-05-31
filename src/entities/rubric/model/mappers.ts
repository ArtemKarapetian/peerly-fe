import type {
  GetRubricResponse,
  RubricCriterionInfoDto,
  RubricCriterionInputDto,
  RubricInfoDto,
} from "@/shared/api";

import type { RubricCriterion, RubricDetail, RubricInput, RubricSummary } from "./types";

export function mapRubricSummary(dto: RubricInfoDto): RubricSummary {
  return {
    id: String(dto.id),
    teacherId: String(dto.teacherId),
    name: dto.name,
  };
}

export function mapRubricCriterion(dto: RubricCriterionInfoDto): RubricCriterion {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? null,
    maxScore: dto.maxScore,
    commentRequired: dto.commentRequired,
    position: dto.position,
  };
}

export function mapRubricDetail(dto: GetRubricResponse): RubricDetail {
  const sortedCriteria = [...dto.criteria]
    .sort((a, b) => a.position - b.position)
    .map(mapRubricCriterion);
  return {
    rubric: dto.rubric ? mapRubricSummary(dto.rubric) : { id: "", teacherId: "", name: "" },
    criteria: sortedCriteria,
  };
}

export function mapInputToBody(input: RubricInput): {
  name: string;
  criteria: RubricCriterionInputDto[];
} {
  return {
    name: input.name,
    criteria: input.criteria.map((c, i) => ({
      name: c.name,
      description: c.description,
      maxScore: c.maxScore,
      commentRequired: c.commentRequired,
      position: c.position ?? i,
    })),
  };
}

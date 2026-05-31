export type {
  RubricSummary,
  RubricCriterion,
  RubricDetail,
  RubricInput,
  RubricCriterionInput,
} from "./model/types";
export {
  useRubrics,
  useRubric,
  useCreateRubric,
  useUpdateRubric,
  useDeleteRubric,
} from "./model/queries";
export { rubricHttpRepo as rubricRepo } from "./api/httpRepo";

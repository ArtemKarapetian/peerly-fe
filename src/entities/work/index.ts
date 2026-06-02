export type { Submission, WorkFile } from "./model/types";
export { workHttpRepo as workRepo } from "./api/httpRepo";
export {
  useMySubmission,
  useAllSubmissions,
  useHomeworkSubmissions,
  useSubmission,
} from "./model/queries";

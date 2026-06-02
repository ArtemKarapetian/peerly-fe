export type {
  Group,
  CreateGroupInput,
  UpdateGroupInput,
  GroupParticipants,
  Participant,
} from "./model/types";
export type { BulkAddStudentsResult } from "./api/httpRepo";
export { groupHttpRepo as groupRepo } from "./api/httpRepo";
export {
  useGroupsByCourse,
  useGroupParticipants,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from "./model/queries";

export interface AddStudentsResult {
  added: number;
  failed: number;
  firstFailure: unknown;
}

export async function addStudentsToGroup(
  groupId: string,
  studentIds: string[],
  add: (gid: string, sid: string) => Promise<void>,
): Promise<AddStudentsResult> {
  const results = await Promise.allSettled(studentIds.map((id) => add(groupId, id)));
  const added = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - added;
  const rejected = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
  const firstFailure: unknown = rejected?.reason;
  return { added, failed, firstFailure };
}

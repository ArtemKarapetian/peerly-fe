import { rubricHttpRepo } from "../api/httpRepo";

export async function loadRubricTotals(rubricIds: readonly string[]): Promise<Map<string, number>> {
  const totals = new Map<string, number>();
  const unique = Array.from(new Set(rubricIds));
  await Promise.all(
    unique.map(async (id) => {
      const detail = await rubricHttpRepo.getById(id).catch(() => null);
      if (!detail) return;
      const total = detail.criteria.reduce((sum, c) => sum + c.maxScore, 0);
      if (total > 0) totals.set(id, total);
    }),
  );
  return totals;
}

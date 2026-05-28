interface RubricCriterion {
  name: string;
  description?: string;
  maxScore: number;
}

interface Rubric {
  id: string;
  criteria: RubricCriterion[];
}

export function buildChecklist(rubrics: Rubric[], rubricId: string | null): string {
  if (!rubricId) return "";
  const rubric = rubrics.find((r) => r.id === rubricId);
  if (!rubric) return "";
  return rubric.criteria
    .map((c) => {
      const head = `${c.name} (${c.maxScore})`;
      return c.description ? `${head}: ${c.description}` : head;
    })
    .join("\n");
}

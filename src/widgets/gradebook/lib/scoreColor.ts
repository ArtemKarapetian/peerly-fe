export function getScoreColor(score: number, max: number): string {
  const percentage = (score / max) * 100;
  if (percentage >= 75) return "text-success";
  if (percentage >= 60) return "text-warning";
  return "text-error";
}

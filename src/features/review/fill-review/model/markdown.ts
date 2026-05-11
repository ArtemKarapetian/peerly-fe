import type { CriterionScore, RubricCriterion } from "./rubric";

const OVERALL_HEADER = "Общий комментарий";

export interface SerializedReview {
  scores: CriterionScore[];
  overallComment: string;
}

export function serializeReview(input: SerializedReview, criteria: RubricCriterion[]): string {
  const blocks: string[] = [];

  for (const criterion of criteria) {
    const score = input.scores.find((s) => s.criterionId === criterion.id);
    if (!score || score.score === null) continue;
    const body = score.comment.trim();
    blocks.push(`## ${criterion.title}\n**Оценка:** ${score.score}${body ? `\n\n${body}` : ""}`);
  }

  if (input.overallComment.trim()) {
    blocks.push(`## ${OVERALL_HEADER}\n\n${input.overallComment.trim()}`);
  }

  return blocks.join("\n\n");
}

export interface ParsedReview {
  criteria: RubricCriterion[];
  scores: CriterionScore[];
  overallComment: string;
}

export function parseReview(markdown: string): ParsedReview {
  const criteria: RubricCriterion[] = [];
  const scores: CriterionScore[] = [];
  let overallComment = "";

  for (const section of splitSections(markdown)) {
    if (section.title === OVERALL_HEADER) {
      overallComment = section.body.trim();
      continue;
    }
    const { score, comment } = extractScoreAndComment(section.body);
    if (score === null) continue;
    criteria.push({ id: section.title, title: section.title });
    scores.push({ criterionId: section.title, score, comment });
  }

  return { criteria, scores, overallComment };
}

interface ParsedSection {
  title: string;
  body: string;
}

function splitSections(md: string): ParsedSection[] {
  const lines = md.split("\n");
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const m = /^##\s+(.+)$/.exec(line.trim());
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);
  return sections;
}

function extractScoreAndComment(body: string): { score: number | null; comment: string } {
  const m = /\*\*Оценка:\*\*\s*(\d)/.exec(body);
  const score = m ? Math.max(1, Math.min(5, parseInt(m[1], 10))) : null;
  const withoutScoreLine = body.replace(/\*\*Оценка:\*\*\s*\d\s*/u, "").trim();
  return { score, comment: withoutScoreLine };
}

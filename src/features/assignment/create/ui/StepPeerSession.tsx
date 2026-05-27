import { Scale, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AssignmentFormData } from "../model/types";

interface StepPeerSessionProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

const DISCREPANCY_MAX_POINTS = 10;

export function StepPeerSession({ data, onUpdate }: StepPeerSessionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.peerSession.title")}
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.peerSession.reviewsPerSubmissionLabel")}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={data.reviewsPerSubmission}
            onChange={(e) => onUpdate({ reviewsPerSubmission: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={data.reviewsPerSubmission}
              onChange={(e) =>
                onUpdate({ reviewsPerSubmission: clamp(parseInt(e.target.value) || 1, 1, 10) })
              }
              className="w-16 px-3 py-2 border-2 border-border rounded-sm text-15 font-medium text-center focus:outline-none focus:border-brand-primary"
            />
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-13 text-muted-foreground mt-2">
          {t("feature.assignmentCreate.peerSession.reviewsHint", {
            count: data.reviewsPerSubmission,
          })}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          {t("feature.assignmentCreate.peerSession.discrepancyLabel")}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max={DISCREPANCY_MAX_POINTS}
            step="1"
            value={data.discrepancyThreshold}
            onChange={(e) => onUpdate({ discrepancyThreshold: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={DISCREPANCY_MAX_POINTS}
              value={data.discrepancyThreshold}
              onChange={(e) =>
                onUpdate({
                  discrepancyThreshold: clamp(
                    parseInt(e.target.value) || 2,
                    1,
                    DISCREPANCY_MAX_POINTS,
                  ),
                })
              }
              className="w-20 px-3 py-2 border-2 border-border rounded-sm text-15 font-medium text-center focus:outline-none focus:border-brand-primary"
            />
            <Scale className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-13 text-muted-foreground mt-2">
          {t("feature.assignmentCreate.peerSession.discrepancyHint", {
            value: data.discrepancyThreshold,
          })}
        </p>
      </div>
    </div>
  );
}

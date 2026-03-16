// Helper to format extension status
import i18n from "@/shared/lib/i18n/config";

import { ExtensionStatus, ExtensionType } from "@/entities/extension";

export function getExtensionStatusLabel(status: ExtensionStatus): string {
  const keys: Record<ExtensionStatus, string> = {
    manual: "entity.extension.statusManual",
    requested: "entity.extension.statusRequested",
    approved: "entity.extension.statusApproved",
    denied: "entity.extension.statusDenied",
  };
  return i18n.t(keys[status]);
}

// Helper to get extension type label
export function getExtensionTypeLabel(type: ExtensionType): string {
  const keys: Record<ExtensionType, string> = {
    submission: "entity.extension.typeSubmission",
    review: "entity.extension.typeReview",
    both: "entity.extension.typeBoth",
  };
  return i18n.t(keys[type]);
}

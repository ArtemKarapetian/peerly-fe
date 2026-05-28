import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  blankFormData,
  clearDraftStorage,
  loadDraftFromStorage,
  saveDraft,
  STORAGE_KEY,
} from "./draftStorage";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("blankFormData", () => {
  it("defaults discrepancyThreshold to 2", () => {
    expect(blankFormData().discrepancyThreshold).toBe(2);
  });
  it("defaults reviewsPerSubmission to 3", () => {
    expect(blankFormData().reviewsPerSubmission).toBe(3);
  });
  it("defaults groupId to null and rubricId to null", () => {
    const data = blankFormData();
    expect(data.groupId).toBeNull();
    expect(data.rubricId).toBeNull();
  });
});

describe("saveDraft + loadDraftFromStorage roundtrip", () => {
  it("returns null when nothing stored", () => {
    expect(loadDraftFromStorage()).toBeNull();
  });

  it("preserves formData and currentStep", () => {
    const data = blankFormData();
    data.courseId = "c-1";
    data.title = "Hello";
    data.submissionDeadline = new Date("2026-07-01T10:00:00Z");
    data.reviewDeadline = new Date("2026-07-05T10:00:00Z");

    saveDraft(data, 3);
    const loaded = loadDraftFromStorage();

    expect(loaded).not.toBeNull();
    expect(loaded!.currentStep).toBe(3);
    expect(loaded!.formData.courseId).toBe("c-1");
    expect(loaded!.formData.title).toBe("Hello");
    expect(loaded!.formData.submissionDeadline?.toISOString()).toBe("2026-07-01T10:00:00.000Z");
    expect(loaded!.formData.reviewDeadline?.toISOString()).toBe("2026-07-05T10:00:00.000Z");
  });

  it("preserves null deadlines", () => {
    saveDraft(blankFormData(), 1);
    const loaded = loadDraftFromStorage()!;
    expect(loaded.formData.submissionDeadline).toBeNull();
    expect(loaded.formData.reviewDeadline).toBeNull();
  });
});

describe("loadDraftFromStorage — corrupt input", () => {
  it("returns null when JSON is invalid", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadDraftFromStorage()).toBeNull();
  });

  it("falls back to currentStep=1 when missing", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData: {
          ...blankFormData(),
          submissionDeadline: null,
          reviewDeadline: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    expect(loadDraftFromStorage()!.currentStep).toBe(1);
  });

  it("clamps non-integer currentStep to 1", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData: {
          ...blankFormData(),
          submissionDeadline: null,
          reviewDeadline: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        currentStep: 1.5,
      }),
    );
    expect(loadDraftFromStorage()!.currentStep).toBe(1);
  });

  it("returns null Date when stored deadline is garbage", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData: {
          ...blankFormData(),
          submissionDeadline: "not-a-date",
          reviewDeadline: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        currentStep: 1,
      }),
    );
    const loaded = loadDraftFromStorage()!;
    expect(loaded.formData.submissionDeadline).toBeNull();
  });

  it("backfills discrepancyThreshold=2 when missing", () => {
    const formData = blankFormData();
    const stored = {
      formData: {
        ...formData,
        submissionDeadline: null,
        reviewDeadline: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      currentStep: 1,
    };

    delete (stored.formData as any).discrepancyThreshold;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const loaded = loadDraftFromStorage()!;
    expect(loaded.formData.discrepancyThreshold).toBe(2);
  });

  it("reads legacy v1 payload (just formData, no wrapper)", () => {
    const legacy = {
      ...blankFormData(),
      submissionDeadline: null,
      reviewDeadline: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      courseId: "c-legacy",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

    const loaded = loadDraftFromStorage()!;
    expect(loaded.formData.courseId).toBe("c-legacy");
    expect(loaded.currentStep).toBe(1);
  });
});

describe("clearDraftStorage", () => {
  it("removes the stored payload", () => {
    saveDraft(blankFormData(), 2);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    clearDraftStorage();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

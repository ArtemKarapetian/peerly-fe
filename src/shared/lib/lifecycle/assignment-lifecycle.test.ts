import { describe, expect, it } from "vitest";

import {
  canTransition,
  getNextTransitions,
  getPhaseIndex,
  hasPermission,
  PHASE_ORDER,
  TRANSITIONS,
} from "./assignment-lifecycle";

describe("assignment-lifecycle", () => {
  describe("getNextTransitions", () => {
    it("returns transitions originating from a given phase", () => {
      const transitions = getNextTransitions("DRAFT");
      expect(transitions).toHaveLength(1);
      expect(transitions[0]).toMatchObject({ from: "DRAFT", to: "PUBLISHED" });
    });

    it("returns multiple transitions when phase has several outputs", () => {
      const transitions = getNextTransitions("REVIEW_OPEN");
      expect(transitions.length).toBeGreaterThanOrEqual(2);
    });

    it("returns empty array for a terminal phase", () => {
      const transitions = getNextTransitions("COMPLETED");
      expect(transitions).toHaveLength(0);
    });
  });

  describe("canTransition", () => {
    it("returns the target phase when the trigger matches", () => {
      expect(canTransition("DRAFT", "publish")).toBe("PUBLISHED");
      expect(canTransition("GRADED", "appeal_window_closes")).toBe("COMPLETED");
    });

    it("returns null when no matching transition exists", () => {
      expect(canTransition("DRAFT", "review_deadline")).toBeNull();
      expect(canTransition("COMPLETED", "publish")).toBeNull();
    });
  });

  describe("getPhaseIndex", () => {
    it("returns the position of the phase in PHASE_ORDER", () => {
      expect(getPhaseIndex("DRAFT")).toBe(0);
      expect(getPhaseIndex("COMPLETED")).toBe(PHASE_ORDER.length - 1);
    });
  });

  describe("hasPermission", () => {
    it("returns true when role has the action in that phase", () => {
      expect(hasPermission("DRAFT", "teacher", "edit")).toBe(true);
      expect(hasPermission("PUBLISHED", "student", "submit")).toBe(true);
    });

    it("returns false for actions the role does not have", () => {
      expect(hasPermission("DRAFT", "student", "edit")).toBe(false);
      expect(hasPermission("REVIEW_CLOSED", "student", "fill_review")).toBe(false);
    });
  });

  describe("TRANSITIONS", () => {
    it("contains the expected number of transitions", () => {
      expect(TRANSITIONS.length).toBeGreaterThanOrEqual(7);
    });
  });
});

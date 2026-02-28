import { DemoFeatureFlag } from "../model/types";

const demoFeatureFlags: DemoFeatureFlag[] = [
  { id: "ff1", name: "New UI", key: "new_ui", enabled: false, rolloutPercentage: 10 },
  { id: "ff2", name: "AI Assistant", key: "ai_assistant", enabled: true, rolloutPercentage: 100 },
  { id: "ff3", name: "Video Reviews", key: "video_reviews", enabled: false, rolloutPercentage: 5 },
];

export const featureFlagRepo = {
  getAll: (): DemoFeatureFlag[] => demoFeatureFlags,
};

export interface DemoFeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
}

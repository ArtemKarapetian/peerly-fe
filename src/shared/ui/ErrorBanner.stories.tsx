import type { Meta, StoryObj } from "@storybook/react";

import { ErrorBanner } from "./ErrorBanner";

const meta: Meta<typeof ErrorBanner> = {
  title: "UI/ErrorBanner",
  component: ErrorBanner,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorBanner>;

export const Default: Story = {
  args: { message: "Failed to load data. Please try again." },
};

export const WithRetry: Story = {
  args: {
    message: "Network error. Check your connection.",
    onRetry: () => alert("Retrying..."),
  },
};

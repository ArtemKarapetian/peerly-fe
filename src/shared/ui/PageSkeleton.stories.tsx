import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageSkeleton } from "./PageSkeleton";

const meta: Meta<typeof PageSkeleton> = {
  title: "UI/PageSkeleton",
  component: PageSkeleton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageSkeleton>;

export const Loading: Story = {};

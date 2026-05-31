import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox } from "lucide-react";

import { Button } from "./button";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const MessageOnly: Story = {
  args: { message: "Nothing here yet." },
};

export const WithIconAndTitle: Story = {
  args: {
    icon: Inbox,
    title: "No assignments",
    message: "Created assignments will appear in this list.",
  },
};

export const WithAction: Story = {
  args: {
    icon: Inbox,
    title: "Empty inbox",
    message: "Browse courses to find something to do.",
    action: <Button>Explore courses</Button>,
  },
};

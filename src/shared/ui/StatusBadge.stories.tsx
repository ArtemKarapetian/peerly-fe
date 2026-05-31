import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle, Clock } from "lucide-react";

import { StatusBadge } from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = { args: { children: "Pending" } };
export const Success: Story = {
  args: { variant: "success", icon: CheckCircle, children: "Submitted" },
};
export const Warning: Story = { args: { variant: "warning", icon: Clock, children: "Due soon" } };
export const Errored: Story = { args: { variant: "error", children: "Failed" } };
export const Info: Story = { args: { variant: "info", children: "In review" } };

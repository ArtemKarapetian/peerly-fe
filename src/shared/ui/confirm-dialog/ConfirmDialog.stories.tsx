import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  args: {
    onConfirm: () => alert("confirmed"),
    onCancel: () => alert("cancelled"),
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    open: true,
    title: "Delete course?",
    description: "This will permanently remove the course.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
};

export const Destructive: Story = {
  args: {
    open: true,
    title: "Drop all data",
    description: "All progress will be lost.",
    confirmLabel: "Yes, drop",
    cancelLabel: "Cancel",
    destructive: true,
  },
};

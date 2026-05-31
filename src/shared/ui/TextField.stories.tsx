import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "UI/TextField",
  component: TextField,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { placeholder: "Type here..." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Frozen value" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "you@example.com" },
};

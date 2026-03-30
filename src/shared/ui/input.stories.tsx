import type { Meta, StoryObj } from "@storybook/react";

import { Input, PasswordInput } from "./input";

const inputMeta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default inputMeta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithLabel: Story = {
  args: { label: "Email", placeholder: "you@example.com" },
};

export const WithError: Story = {
  args: { label: "Email", placeholder: "you@example.com", error: "Invalid email address" },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    placeholder: "johndoe",
    helperText: "3-20 characters, letters and numbers only",
  },
};

export const Disabled: Story = {
  args: { label: "Disabled Field", placeholder: "Cannot edit", disabled: true },
};

// Password Input stories — uses the same meta, shown as separate stories
export const Password: StoryObj<typeof PasswordInput> = {
  render: () => <PasswordInput label="Password" placeholder="Enter password" />,
};

export const PasswordWithError: StoryObj<typeof PasswordInput> = {
  render: () => (
    <PasswordInput label="Password" placeholder="Enter password" error="Password is too short" />
  ),
};

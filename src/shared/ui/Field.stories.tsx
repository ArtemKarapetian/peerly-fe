import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "./Field";
import { TextField } from "./TextField";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Basic: Story = {
  args: {
    label: "Email",
    children: <TextField placeholder="you@example.com" />,
  },
};

export const WithHtmlFor: Story = {
  args: {
    label: "Password",
    htmlFor: "pwd",
    children: <TextField id="pwd" type="password" />,
  },
};

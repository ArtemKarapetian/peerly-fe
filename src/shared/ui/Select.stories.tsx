import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./select";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <option>Apple</option>
        <option>Banana</option>
        <option>Cherry</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <option>Frozen</option>,
  },
};

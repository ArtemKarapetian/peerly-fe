import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: { title: "Courses" },
};

export const TitleAndSubtitle: Story = {
  args: { title: "Courses", subtitle: "Manage all your courses in one place" },
};

export const WithAction: Story = {
  args: {
    title: "Courses",
    subtitle: "Manage all your courses",
    action: <Button>Create course</Button>,
  },
};

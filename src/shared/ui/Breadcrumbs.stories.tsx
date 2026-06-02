import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "UI/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const TwoLevels: Story = {
  args: {
    items: [{ label: "Courses", href: "/courses" }, { label: "Algebra" }],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "Courses", href: "/courses" },
      { label: "Algebra", href: "/courses/1" },
      { label: "Lecture 5" },
    ],
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Mail, ArrowRight } from "lucide-react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Primary Button", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Secondary Button", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Ghost Button", variant: "ghost" },
};

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

export const Outline: Story = {
  args: { children: "Outline Button", variant: "outline" },
};

export const WithLeftIcon: Story = {
  args: { children: "Send Email", variant: "primary", leftIcon: <Mail className="w-4 h-4" /> },
};

export const WithRightIcon: Story = {
  args: {
    children: "Continue",
    variant: "primary",
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: { children: "Saving...", variant: "primary", isLoading: true },
};

export const Disabled: Story = {
  args: { children: "Disabled", variant: "primary", disabled: true },
};

export const Small: Story = {
  args: { children: "Small", variant: "primary", size: "sm" },
};

export const Large: Story = {
  args: { children: "Large Button", variant: "primary", size: "lg" },
};

export const FullWidth: Story = {
  args: { children: "Full Width", variant: "primary", fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>
    </div>
  ),
};

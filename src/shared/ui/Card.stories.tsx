import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <p className="text-foreground">Default card content with padding & border.</p>,
  },
};

export const Section: Story = {
  args: {
    variant: "section",
    children: <p className="text-foreground">Section variant with softer shadow.</p>,
  },
};

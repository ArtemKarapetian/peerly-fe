import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SimplePagination } from "./simple-pagination";

const meta: Meta<typeof SimplePagination> = {
  title: "UI/SimplePagination",
  component: SimplePagination,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SimplePagination>;

function Controlled({ total }: { total: number }) {
  const [page, setPage] = useState(1);
  return <SimplePagination currentPage={page} totalPages={total} onPageChange={setPage} />;
}

export const FivePages: Story = {
  render: () => <Controlled total={5} />,
};

export const HundredPages: Story = {
  render: () => <Controlled total={100} />,
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "./Field";
import { FiltersCard } from "./FiltersCard";
import { Select } from "./select";
import { TextField } from "./TextField";

const meta: Meta<typeof FiltersCard> = {
  title: "UI/FiltersCard",
  component: FiltersCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FiltersCard>;

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: (
      <>
        <Field label="Status">
          <Select>
            <option>All</option>
            <option>Active</option>
          </Select>
        </Field>
        <Field label="Search">
          <TextField placeholder="Type to search..." />
        </Field>
      </>
    ),
  },
};

export const WithResultsAndReset: Story = {
  args: {
    columns: 3,
    showReset: true,
    onReset: () => alert("reset"),
    resultsLabel: <>Found: 12 items</>,
    children: (
      <>
        <Field label="A">
          <TextField />
        </Field>
        <Field label="B">
          <TextField />
        </Field>
        <Field label="C">
          <TextField />
        </Field>
      </>
    ),
  },
};

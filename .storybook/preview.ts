import type { Preview } from "@storybook/react-vite";

import "../src/shared/styles/index.css";
import "../src/shared/lib/i18n/config";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
};

export default preview;

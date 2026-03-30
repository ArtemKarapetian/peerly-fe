import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import type { StorybookConfig } from "@storybook/react-vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default config;

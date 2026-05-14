/// <reference types="cypress" />

import "@testing-library/cypress/add-commands";
import { mount, type MountOptions, type MountReturn } from "cypress/react";
import type { ReactNode } from "react";

import "@/shared/styles/index.css";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: (jsx: ReactNode, options?: MountOptions) => Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add("mount", mount);

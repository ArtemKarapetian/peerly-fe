import { MemoryRouter } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

describe("<Breadcrumbs>", () => {
  it("renders nothing when items is empty", () => {
    cy.mount(
      <MemoryRouter>
        <Breadcrumbs items={[]} />
      </MemoryRouter>,
    );
    cy.findAllByRole("button").should("have.length", 0);
  });

  it("renders every item in order", () => {
    cy.mount(
      <MemoryRouter>
        <Breadcrumbs
          items={[
            { label: "Курсы", href: "/teacher/courses" },
            { label: "Курс A", href: "/teacher/courses/1" },
            { label: "Настройки" },
          ]}
        />
      </MemoryRouter>,
    );
    cy.contains("Курсы").should("be.visible");
    cy.contains("Курс A").should("be.visible");
    cy.contains("Настройки").should("be.visible");
  });

  it("renders the current item as text and not as a clickable button", () => {
    cy.mount(
      <MemoryRouter>
        <Breadcrumbs items={[{ label: "Root", href: "/" }, { label: "Final" }]} />
      </MemoryRouter>,
    );
    cy.findByRole("button", { name: "Root" }).should("exist");
    cy.findAllByRole("button").should("have.length", 1);
    cy.contains("Final").should("be.visible");
  });
});

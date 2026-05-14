import { useState } from "react";

import { SimplePagination } from "@/shared/ui/simple-pagination";

function Harness({ total }: { total: number }) {
  const [page, setPage] = useState(1);
  return (
    <div>
      <div data-cy="page-marker">page-{page}</div>
      <SimplePagination currentPage={page} totalPages={total} onPageChange={setPage} />
    </div>
  );
}

describe("<SimplePagination>", () => {
  it("renders nothing when there is only one page", () => {
    cy.mount(<Harness total={1} />);
    cy.findAllByRole("button").should("have.length", 0);
  });

  it("advances to the next page when the next button is clicked", () => {
    cy.mount(<Harness total={3} />);
    cy.get("[data-cy=page-marker]").should("contain", "page-1");
    cy.findByRole("button", { name: /pagination\.next/ }).click();
    cy.get("[data-cy=page-marker]").should("contain", "page-2");
  });

  it("disables the previous button on the first page", () => {
    cy.mount(<Harness total={3} />);
    cy.findByRole("button", { name: /pagination\.previous/ }).should("be.disabled");
    cy.findByRole("button", { name: /pagination\.next/ }).should("not.be.disabled");
  });
});

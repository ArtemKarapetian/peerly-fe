import { ApiError } from "@/shared/api/httpClient";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";

describe("<ErrorBanner>", () => {
  it("renders a plain string message", () => {
    cy.mount(<ErrorBanner message="something broke" />);
    cy.contains("something broke").should("be.visible");
  });

  it("humanizes ProblemDetails-shaped ApiError into a readable message", () => {
    const apiBody = {
      title: "Bad Request",
      errors: { "*": ["Validation failed: \n -- Name must not be empty. Severity: Error"] },
    };
    const err = new ApiError(400, apiBody, "HTTP 400: /foo");
    cy.mount(<ErrorBanner error={err} />);
    cy.contains("Name must not be empty").should("be.visible");
    cy.contains("HTTP 400").should("not.exist");
  });

  it("shows the retry button when onRetry is provided and forwards clicks", () => {
    const onRetry = cy.stub().as("retry");
    cy.mount(<ErrorBanner message="oops" onRetry={onRetry} />);
    cy.findByRole("button").click();
    cy.get("@retry").should("have.been.called");
  });

  it("hides the retry button when onRetry is omitted", () => {
    cy.mount(<ErrorBanner message="oops" />);
    cy.findAllByRole("button").should("have.length", 0);
  });
});

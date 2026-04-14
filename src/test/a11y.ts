/**
 * Accessibility testing helpers.
 *
 * Uses axe-core under the hood to run WCAG 2.1 AA checks.
 * Import `checkA11y` in component tests to verify compliance.
 */

import { axe } from "vitest-axe";

/**
 * Run axe-core on an HTML element and return results.
 *
 * Usage:
 * ```ts
 * const { container } = render(<Button>Click</Button>);
 * const results = await checkA11y(container);
 * expect(results.violations).toHaveLength(0);
 * ```
 */
export async function checkA11y(container: Element) {
  return axe(container);
}

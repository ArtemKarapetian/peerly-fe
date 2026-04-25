// Прогоняет axe-core по DOM-узлу для проверок WCAG 2.1 AA в компонентных тестах

import { axe } from "vitest-axe";

export async function checkA11y(container: Element) {
  return axe(container);
}

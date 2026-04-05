/**
 * Type-safe i18n helpers.
 *
 * We export the full key union for opt-in type safety when calling t().
 * We DON'T augment the i18next module globally because many places
 * (admin pages, dynamic feature flags) build keys dynamically.
 *
 * Usage for strict typing:
 *   const key: TranslationKey = "common.save";
 *   t(key);
 */

import type ru from "./locales/ru.json";

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? NestedKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type TranslationKey = NestedKeys<typeof ru>;

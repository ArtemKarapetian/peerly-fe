// Опциональный union ключей для строгой типизации t() — не augment'им i18next глобально,
// потому что много мест собирают ключи динамически

import type ru from "./locales/ru.json";

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? NestedKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type TranslationKey = NestedKeys<typeof ru>;

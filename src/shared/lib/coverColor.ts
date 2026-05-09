const PALETTE = [
  "#b0e9fb",
  "#b7bdff",
  "#9cf38d",
  "#ffb8b8",
  "#ffd4a3",
  "#d4b8ff",
  "#b8ffd4",
  "#ffc9e8",
  "#c9e8ff",
  "#e8c9ff",
  "#c9ffd4",
  "#f2b2d6",
];

export function coverColorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export const className = (classes: Record<string, boolean>): string =>
  Object.entries(classes)
    .filter(([, v]) => v === true)
    .map(([k]) => k)
    .join(" ");

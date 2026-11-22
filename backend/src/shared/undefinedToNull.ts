export const undefinedToNull = <T>(value: T | undefined): T | null =>
  value === undefined ? null : value;

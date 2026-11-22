export const allowedRoles = [
  "ADMIN",
  "DEVELOPER",
  "DESIGNER",
  "MARKETING",
  "QA",
  "FINANCE",
  "SALES",
] as const;

export type UserRole = (typeof allowedRoles)[number];

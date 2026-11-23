export const allowedTaskStatus = [
  "PENDING",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type TaskStatus = (typeof allowedTaskStatus)[number];

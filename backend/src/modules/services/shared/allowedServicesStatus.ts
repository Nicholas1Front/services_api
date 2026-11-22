export const allowedServicesStatus = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ServiceStatus = (typeof allowedServicesStatus)[number];

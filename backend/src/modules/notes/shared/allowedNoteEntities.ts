export const allowedNoteEntities = [
  "users",
  "tasks",
  "services",
] as const;

export type NoteEntity = (typeof allowedNoteEntities)[number];

import { prisma } from "../../config/prisma.js";
import type { NoteEntity } from "./shared/allowedNoteEntities.js";
import type { FindNotesByFiltersInput } from "./notes.schema.js";

const noteInclude = {
  user: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
};

export const notesRepository = {
  findEntity(entityTable: NoteEntity, entityId: string) {
    switch (entityTable) {
      case "users":
        return prisma.user.findUnique({
          where: { id: entityId },
          select: { id: true },
        });
      case "tasks":
        return prisma.task.findUnique({
          where: { id: entityId },
          select: { id: true },
        });
      case "services":
        return prisma.service.findUnique({
          where: { id: entityId },
          select: { id: true },
        });
    }
  },

  create(data: {
    title: string;
    content: string;
    entityId: string;
    entityTable: NoteEntity;
    userId: string;
  }) {
    return prisma.note.create({
      data,
      include: noteInclude,
    });
  },

  findById(id: string) {
    return prisma.note.findUnique({
      where: { id },
      include: noteInclude,
    });
  },

  findByFilters(
    filters: FindNotesByFiltersInput,
    actor: { id: string; role: string },
  ) {
    const where = {
      ...(filters.title && {
        title: { contains: filters.title, mode: "insensitive" as const },
      }),
      ...(filters.entityId && { entityId: filters.entityId }),
      ...(filters.entityTable && { entityTable: filters.entityTable }),
      ...(actor.role !== "ADMIN" ? { userId: actor.id } : {}),
      ...(actor.role === "ADMIN" && filters.userId
        ? { userId: filters.userId }
        : {}),
    };

    const skip = (filters.page - 1) * filters.limit;

    return Promise.all([
      prisma.note.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: "desc" },
        include: noteInclude,
      }),
      prisma.note.count({ where }),
    ]);
  },

  update(id: string, data: { title?: string; content?: string }) {
    return prisma.note.update({
      where: { id },
      data,
      include: noteInclude,
    });
  },

  delete(id: string) {
    return prisma.note.delete({
      where: { id },
      select: { id: true },
    });
  },
};

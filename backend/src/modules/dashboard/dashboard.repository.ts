import { prisma } from "../../config/prisma.js";
import type { AuthenticatedUser } from "../../types/auth.js";

const dashboardTaskInclude = {
  creator: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
};

const serviceAccessWhere = (actor: AuthenticatedUser) =>
  actor.role === "ADMIN"
    ? {}
    : {
        OR: [
          { ownerId: actor.id },
          { visibility: { some: { role: actor.role } } },
        ],
      };

const taskAccessWhere = (actor: AuthenticatedUser) =>
  actor.role === "ADMIN"
    ? {}
    : {
        OR: [
          { creatorId: actor.id },
          { assignedToId: actor.id },
          {
            AND: [
              { visibility: { some: { role: actor.role } } },
              { service: { visibility: { some: { role: actor.role } } } },
            ],
          },
        ],
      };

export const dashboardRepository = {
  findServicesByStatus(actor: AuthenticatedUser, status: string) {
    return prisma.service.findMany({
      where: {
        ...serviceAccessWhere(actor),
        status,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  },

  findTasksByStatus(actor: AuthenticatedUser, status: string) {
    return prisma.task.findMany({
      where: {
        ...taskAccessWhere(actor),
        status,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        ...dashboardTaskInclude,
        service: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
  },

  findNotes(actor: AuthenticatedUser) {
    return prisma.note.findMany({
      where: actor.role === "ADMIN" ? {} : { userId: actor.id },
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  },

  findServiceDetails(serviceId: string, actor: AuthenticatedUser) {
    return prisma.service.findFirst({
      where: {
        id: serviceId,
        ...serviceAccessWhere(actor),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        tasks: {
          where: taskAccessWhere(actor),
          orderBy: { updatedAt: "desc" },
          include: dashboardTaskInclude,
        },
      },
    });
  },
};

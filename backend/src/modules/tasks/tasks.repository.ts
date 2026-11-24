import { prisma } from "../../config/prisma.js";
import type { FindTasksByFiltersInput } from "./tasks.schema.js";

const taskInclude = {
  service: {
    select: {
      id: true,
      title: true,
      ownerId: true,
      visibility: {
        select: {
          role: true,
        },
      },
    },
  },
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
  visibility: {
    select: {
      role: true,
    },
  },
};

export const tasksRepository = {
  create(data: {
    serviceId: string;
    title: string;
    description: string;
    status: string;
    creatorId: string;
    assignedToId?: string | null;
    deliveryDate?: Date | null;
    observations?: string | null;
    roles: string[];
  }) {
    const { roles, ...taskData } = data;

    return prisma.task.create({
      data: {
        ...taskData,
        visibility: {
          create: roles.map((role) => ({ role })),
        },
      },
      include: taskInclude,
    });
  },

  findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
  },

  findByFilters(
    filters: FindTasksByFiltersInput,
    actor: { id: string; role: string },
  ) {
    const where = {
      ...(filters.title && {
        title: { contains: filters.title, mode: "insensitive" as const },
      }),
      ...(filters.status && { status: filters.status }),
      ...(filters.serviceId && { serviceId: filters.serviceId }),
      ...(filters.assignedToId && { assignedToId: filters.assignedToId }),
      ...(actor.role !== "ADMIN" && {
        OR: [
          { creatorId: actor.id },
          { assignedToId: actor.id },
          { visibility: { some: { role: actor.role } } },
          {
            AND: [
              { visibility: { some: { role: actor.role } } },
              { service: { visibility: { some: { role: actor.role } } } },
            ],
          },
        ],
      }),
    };

    const skip = (filters.page - 1) * filters.limit;

    return Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: "desc" },
        include: taskInclude,
      }),
      prisma.task.count({ where }),
    ]);
  },

  update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      assignedToId?: string | null;
      observations?: string | null;
    },
  ) {
    return prisma.task.update({
      where: { id },
      data,
      include: taskInclude,
    });
  },

  updateDeliveryDate(id: string, deliveryDate: Date | null) {
    return prisma.task.update({
      where: { id },
      data: { deliveryDate },
      include: taskInclude,
    });
  },

  delete(id: string) {
    return prisma.task.delete({
      where: { id },
      select: { id: true },
    });
  },
};

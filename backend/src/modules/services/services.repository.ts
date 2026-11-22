import { prisma } from "../../config/prisma.js";
import type { FindServicesByFiltersInput } from "./services.schema.js";

const serviceInclude = {
  owner: {
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

export const servicesRepository = {
  create(data: {
    title: string;
    description?: string;
    status: string;
    ownerId: string;
  }) {
    return prisma.service.create({
      data,
      include: serviceInclude,
    });
  },

  findById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });
  },

  findByFilters(
    filters: FindServicesByFiltersInput,
    actor: { id: string; role: string },
  ) {
    const where = {
      ...(filters.title && {
        title: { contains: filters.title, mode: "insensitive" as const },
      }),
      ...(filters.status && { status: filters.status }),
      ...(filters.ownerId && { ownerId: filters.ownerId }),
      ...(actor.role !== "ADMIN" && {
        OR: [
          { ownerId: actor.id },
          { visibility: { some: { role: actor.role } } },
        ],
      }),
    };

    const skip = (filters.page - 1) * filters.limit;

    return Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: "desc" },
        include: serviceInclude,
      }),
      prisma.service.count({ where }),
    ]);
  },

  update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      status?: string;
    },
  ) {
    return prisma.service.update({
      where: { id },
      data,
      include: serviceInclude,
    });
  },

  delete(id: string) {
    return prisma.service.delete({
      where: { id },
      select: { id: true },
    });
  },

  addVisibility(serviceId: string, roles: string[]) {
    return prisma.serviceVisibility.createMany({
      data: roles.map((role) => ({ serviceId, role })),
      skipDuplicates: true,
    });
  },

  async updateVisibility(serviceId: string, roles: string[]) {
    await prisma.$transaction(async (transaction) => {
      await transaction.serviceVisibility.deleteMany({
        where: { serviceId },
      });

      if (roles.length > 0) {
        await transaction.serviceVisibility.createMany({
          data: roles.map((role) => ({ serviceId, role })),
        });
      }
    });

    return this.findById(serviceId);
  },
};

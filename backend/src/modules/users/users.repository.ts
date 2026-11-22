import { prisma } from "../../config/prisma.js";
import type { FindUsersByFiltersInput } from "./users.schema.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const usersRepository = {
  create(data: { name: string; email: string; passwordHash: string; role: string }) {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  findRoleById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
  },

  findByFilters(filters: FindUsersByFiltersInput) {
    const where = {
      ...(filters.name && {
        name: { contains: filters.name, mode: "insensitive" as const },
      }),
      ...(filters.email && {
        email: { contains: filters.email, mode: "insensitive" as const },
      }),
      ...(filters.role && { role: filters.role }),
    };

    const skip = (filters.page - 1) * filters.limit;

    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: "desc" },
        select: userSelect,
      }),
      prisma.user.count({ where }),
    ]);
  },

  update(
    id: string,
    data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: string;
    },
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  },
};

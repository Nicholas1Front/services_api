import { prisma } from "../../config/prisma.js";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });
  },
};

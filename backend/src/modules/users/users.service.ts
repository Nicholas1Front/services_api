import bcrypt from "bcrypt";
import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { allowedRoles, type UserRole } from "./shared/allowedRoles.js";
import type {
  CreateUserInput,
  FindUsersByFiltersInput,
  UpdateOwnUserInput,
  UpdateUserInput,
} from "./users.schema.js";
import { usersRepository } from "./users.repository.js";

const PASSWORD_SALT_ROUNDS = 12;

const throwIfPrismaError = (error: unknown): never => {
  if (error && typeof error === "object" && "code" in error) {
    if (error.code === "P2002") {
      throw new AppError("Email is already in use", 409, "EMAIL_ALREADY_EXISTS");
    }

    if (error.code === "P2003") {
      throw new AppError("User has related records and cannot be deleted", 409, "USER_HAS_RELATED_RECORDS");
    }

    if (error.code === "P2025") {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
  }

  throw error;
};

const ensureAdmin = async (actor: AuthenticatedUser) => {
  const currentUser = await usersRepository.findRoleById(actor.id);

  if (!currentUser) {
    throw new AppError("User not found", 401, "AUTHENTICATED_USER_NOT_FOUND");
  }

  if (currentUser.role !== "ADMIN") {
    throw new AppError("Administrator access required", 403, "FORBIDDEN");
  }
};

const ensureAllowedRole = (role: string): role is UserRole => {
  if (!allowedRoles.includes(role as UserRole)) {
    throw new AppError("Invalid user role", 400, "INVALID_USER_ROLE");
  }

  return true;
};

export const usersService = {
  async createUser(actor: AuthenticatedUser, input: CreateUserInput) {
    await ensureAdmin(actor);
    ensureAllowedRole(input.role);

    const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

    try {
      return await usersRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
      });
    } catch (error) {
      throwIfPrismaError(error);
    }
  },

  async getOwnProfile(actor: AuthenticatedUser) {
    const user = await usersRepository.findById(actor.id);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  },

  async updateOwnProfile(actor: AuthenticatedUser, input: UpdateOwnUserInput) {
    const data: { name?: string; email?: string; passwordHash?: string } = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
    };

    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
    }

    try {
      return await usersRepository.update(actor.id, data);
    } catch (error) {
      throwIfPrismaError(error);
    }
  },

  async findUsersByFilters(actor: AuthenticatedUser, filters: FindUsersByFiltersInput) {
    await ensureAdmin(actor);

    const [users, total] = await usersRepository.findByFilters(filters);

    return {
      users,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  },

  async findUserById(actor: AuthenticatedUser, userId: string) {
    await ensureAdmin(actor);

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  },

  async updateUser(actor: AuthenticatedUser, userId: string, input: UpdateUserInput) {
    await ensureAdmin(actor);

    if (input.role !== undefined) {
      ensureAllowedRole(input.role);

      if (userId === actor.id) {
        throw new AppError("Use your own profile endpoint to update personal data", 400, "SELF_ROLE_UPDATE_NOT_ALLOWED");
      }
    }

    const data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: string;
    } = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.role !== undefined && { role: input.role }),
    };

    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
    }

    try {
      return await usersRepository.update(userId, data);
    } catch (error) {
      throwIfPrismaError(error);
    }
  },

  async deleteUser(actor: AuthenticatedUser, userId: string) {
    await ensureAdmin(actor);

    if (userId === actor.id) {
      throw new AppError("You cannot delete your own account", 400, "SELF_DELETE_NOT_ALLOWED");
    }

    try {
      return await usersRepository.delete(userId);
    } catch (error) {
      throwIfPrismaError(error);
    }
  },
};

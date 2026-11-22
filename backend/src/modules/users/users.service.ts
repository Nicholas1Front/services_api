import bcrypt from "bcrypt";
import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { removeUndefinedProperties } from "../../shared/removeUndefinedProperties.js";
import { allowedRoles, type UserRole } from "./shared/allowedRoles.js";
import type {
  CreateUserInput,
  FindUsersByFiltersInput,
  UpdateOwnUserInput,
  UpdateUserInput,
} from "./users.schema.js";
import { usersRepository } from "./users.repository.js";

const PASSWORD_SALT_ROUNDS = 12;

const ensureAdmin = (actor: AuthenticatedUser) => {
  if (actor.role !== "ADMIN") {
    throw new AppError("Administrator access required", 403, "FORBIDDEN");
  }
};

const ensureAllowedRole = (role: string) => {
  if (!allowedRoles.includes(role as UserRole)) {
    throw new AppError("Invalid user role", 400, "INVALID_USER_ROLE");
  }
};

const handlePrismaError = (error: unknown): never => {
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

export const usersService = {
  async createUser(actor: AuthenticatedUser, input: CreateUserInput) {
    ensureAdmin(actor);
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
      handlePrismaError(error);
    }
  },

  async getOwnProfile(actor: AuthenticatedUser) {
    const user = await usersRepository.findById(actor.id);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  },

  async updateUser(
    actor: AuthenticatedUser,
    userId: string,
    input: UpdateOwnUserInput | UpdateUserInput,
  ) {
    const isOwner = actor.id === userId;
    const isAdmin = actor.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      throw new AppError("You cannot update this user", 403, "FORBIDDEN");
    }

    if (input.role !== undefined) {
      if (!isAdmin) {
        throw new AppError("Only administrators can change user roles", 403, "FORBIDDEN");
      }

      if (isOwner) {
        throw new AppError("You cannot change your own role", 400, "SELF_ROLE_UPDATE_NOT_ALLOWED");
      }

      ensureAllowedRole(input.role);
    }

    const passwordHash = input.password
      ? await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS)
      : undefined;

    const data = removeUndefinedProperties({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    try {
      return await usersRepository.update(userId, data);
    } catch (error) {
      handlePrismaError(error);
    }
  },

  async findUsersByFilters(actor: AuthenticatedUser, filters: FindUsersByFiltersInput) {
    ensureAdmin(actor);

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
    ensureAdmin(actor);

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;
  },

  async deleteUser(actor: AuthenticatedUser, userId: string) {
    ensureAdmin(actor);

    if (userId === actor.id) {
      throw new AppError("You cannot delete your own account", 400, "SELF_DELETE_NOT_ALLOWED");
    }

    try {
      return await usersRepository.delete(userId);
    } catch (error) {
      handlePrismaError(error);
    }
  },
};

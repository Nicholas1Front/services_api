import type { RequestHandler } from "express";
import { AppError } from "../../config/app-error.js";
import { usersService } from "./users.service.js";
import {
  createUserSchema,
  findUsersByFiltersSchema,
  updateOwnUserSchema,
  updateUserSchema,
} from "./users.schema.js";

export const getOwnProfile: RequestHandler = async (req, res) => {
  const user = await usersService.getOwnProfile(req.user!);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const updateOwnProfile: RequestHandler = async (req, res) => {
  const parsedBody = updateOwnUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid user data", 400, "INVALID_USER_DATA");
  }

  const user = await usersService.updateOwnProfile(req.user!, parsedBody.data);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const createUser: RequestHandler = async (req, res) => {
  const parsedBody = createUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid user data", 400, "INVALID_USER_DATA");
  }

  const user = await usersService.createUser(req.user!, parsedBody.data);

  res.status(201).json({
    status: "success",
    data: user,
  });
};

export const findUsersByFilters: RequestHandler = async (req, res) => {
  const parsedQuery = findUsersByFiltersSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new AppError("Invalid user filters", 400, "INVALID_USER_FILTERS");
  }

  const result = await usersService.findUsersByFilters(req.user!, parsedQuery.data);

  res.status(200).json({
    status: "success",
    data: result.users,
    pagination: result.pagination,
  });
};

export const findUserById: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
  }

  const user = await usersService.findUserById(req.user!, userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const updateUser: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
  }

  const parsedBody = updateUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid user data", 400, "INVALID_USER_DATA");
  }

  const user = await usersService.updateUser(req.user!, userId, parsedBody.data);

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    throw new AppError("User ID is required", 400, "USER_ID_REQUIRED");
  }

  const result = await usersService.deleteUser(req.user!, userId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

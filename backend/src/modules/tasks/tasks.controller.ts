import type { RequestHandler } from "express";
import { AppError } from "../../config/app-error.js";
import { tasksService } from "./tasks.service.js";
import {
  createTaskSchema,
  findTasksByFiltersSchema,
  updateTaskDeliveryDateSchema,
  updateTaskSchema,
} from "./tasks.schema.js";

export const createTask: RequestHandler = async (req, res) => {
  const parsedBody = createTaskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid task data", 400, "INVALID_TASK_DATA");
  }

  const task = await tasksService.createTask(req.user!, parsedBody.data);

  res.status(201).json({
    status: "success",
    data: task,
  });
};

export const getTask: RequestHandler = async (req, res) => {
  const taskId = req.params.id as string;

  if (!taskId) {
    throw new AppError("Task ID is required", 400, "TASK_ID_REQUIRED");
  }

  const task = await tasksService.getTask(req.user!, taskId);

  res.status(200).json({
    status: "success",
    data: task,
  });
};

export const findTasksByFilters: RequestHandler = async (req, res) => {
  const parsedQuery = findTasksByFiltersSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new AppError("Invalid task filters", 400, "INVALID_TASK_FILTERS");
  }

  const result = await tasksService.findTasksByFilters(req.user!, parsedQuery.data);

  res.status(200).json({
    status: "success",
    data: result.tasks,
    pagination: result.pagination,
  });
};

export const updateTask: RequestHandler = async (req, res) => {
  const taskId = req.params.id as string;

  if (!taskId) {
    throw new AppError("Task ID is required", 400, "TASK_ID_REQUIRED");
  }

  const parsedBody = updateTaskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid task data", 400, "INVALID_TASK_DATA");
  }

  const task = await tasksService.updateTask(req.user!, taskId, parsedBody.data);

  res.status(200).json({
    status: "success",
    data: task,
  });
};

export const updateTaskDeliveryDate: RequestHandler = async (req, res) => {
  const taskId = req.params.id as string;

  if (!taskId) {
    throw new AppError("Task ID is required", 400, "TASK_ID_REQUIRED");
  }

  const parsedBody = updateTaskDeliveryDateSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid task delivery date", 400, "INVALID_TASK_DELIVERY_DATE");
  }

  const task = await tasksService.updateTaskDeliveryDate(
    req.user!,
    taskId,
    parsedBody.data,
  );

  res.status(200).json({
    status: "success",
    data: task,
  });
};

export const deleteTask: RequestHandler = async (req, res) => {
  const taskId = req.params.id as string;

  if (!taskId) {
    throw new AppError("Task ID is required", 400, "TASK_ID_REQUIRED");
  }

  const result = await tasksService.deleteTask(req.user!, taskId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

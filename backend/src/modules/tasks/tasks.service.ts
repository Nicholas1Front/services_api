import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { servicesRepository } from "../services/services.repository.js";
import type {
  CreateTaskInput,
  FindTasksByFiltersInput,
  UpdateTaskDeliveryDateInput,
  UpdateTaskInput,
} from "./tasks.schema.js";
import { tasksRepository } from "./tasks.repository.js";

const findTaskOrFail = async (taskId: string) => {
  const task = await tasksRepository.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
  }

  return task;
};

const ensureTaskCreator = (
  actor: AuthenticatedUser,
  creatorId: string,
) => {
  if (actor.id !== creatorId) {
    throw new AppError("Only the task creator can perform this action", 403, "FORBIDDEN");
  }
};

const ensureTaskEditor = (
  actor: AuthenticatedUser,
  task: { creatorId: string; assignedToId: string | null },
) => {
  if (actor.id !== task.creatorId && actor.id !== task.assignedToId) {
    throw new AppError("You cannot modify this task", 403, "FORBIDDEN");
  }
};

const ensureTaskVisibility = (
  actor: AuthenticatedUser,
  task: {
    creatorId: string;
    assignedToId: string | null;
    visibility: { role: string }[];
    service: { visibility: { role: string }[] };
  },
) => {
  const canView =
    actor.role === "ADMIN" ||
    actor.id === task.creatorId ||
    actor.id === task.assignedToId ||
    (task.visibility.some((item) => item.role === actor.role) &&
      task.service.visibility.some((item) => item.role === actor.role));

  if (!canView) {
    throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
  }
};

export const tasksService = {
  async createTask(
    actor: AuthenticatedUser,
    input: CreateTaskInput,
  ) {
    const service = await servicesRepository.findById(input.serviceId);

    if (!service) {
      throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
    }

    ensureTaskCreator(actor, service.ownerId);

    const unavailableRoles = input.roles.filter(
      (role) => !service.visibility.some((item) => item.role === role),
    );

    if (unavailableRoles.length > 0) {
      throw new AppError(
        "Task roles must be enabled for the service",
        400,
        "TASK_ROLES_NOT_ALLOWED",
      );
    }

    const { serviceId, roles, ...taskData } = input;

    return tasksRepository.create({
      ...taskData,
      serviceId,
      creatorId: service.ownerId,
      roles,
    });
  },

  async getTask(actor: AuthenticatedUser, taskId: string) {
    const task = await findTaskOrFail(taskId);
    ensureTaskVisibility(actor, task);
    return task;
  },

  async findTasksByFilters(
    actor: AuthenticatedUser,
    filters: FindTasksByFiltersInput,
  ) {
    const [tasks, total] = await tasksRepository.findByFilters(filters, actor);

    return {
      tasks,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  },

  async updateTask(
    actor: AuthenticatedUser,
    taskId: string,
    input: UpdateTaskInput,
  ) {
    const task = await findTaskOrFail(taskId);
    ensureTaskEditor(actor, task);

    if (Object.hasOwn(input, "assignedToId")) {
      ensureTaskCreator(actor, task.creatorId);
    } else {
      ensureTaskEditor(actor, task);
    }

    return tasksRepository.update(taskId, input);
  },

  async updateTaskDeliveryDate(
    actor: AuthenticatedUser,
    taskId: string,
    input: UpdateTaskDeliveryDateInput,
  ) {
    const task = await findTaskOrFail(taskId);
    ensureTaskCreator(actor, task.creatorId);

    return tasksRepository.updateDeliveryDate(taskId, input.deliveryDate);
  },

  async deleteTask(actor: AuthenticatedUser, taskId: string) {
    const task = await findTaskOrFail(taskId);
    ensureTaskCreator(actor, task.creatorId);

    return tasksRepository.delete(taskId);
  },
};

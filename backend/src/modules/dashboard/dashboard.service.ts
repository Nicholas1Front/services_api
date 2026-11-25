import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { allowedServicesStatus } from "../services/shared/allowedServicesStatus.js";
import { allowedTaskStatus } from "../tasks/shared/allowedTaskStatus.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async getDashboard(actor: AuthenticatedUser) {
    const [
      servicesPending,
      servicesInProgress,
      servicesCompleted,
      servicesCancelled,
      tasksPending,
      tasksInProgress,
      tasksBlocked,
      tasksCompleted,
      tasksCancelled,
      notes,
    ] = await Promise.all([
      dashboardRepository.findServicesByStatus(actor, allowedServicesStatus[0]),
      dashboardRepository.findServicesByStatus(actor, allowedServicesStatus[1]),
      dashboardRepository.findServicesByStatus(actor, allowedServicesStatus[2]),
      dashboardRepository.findServicesByStatus(actor, allowedServicesStatus[3]),
      dashboardRepository.findTasksByStatus(actor, allowedTaskStatus[0]),
      dashboardRepository.findTasksByStatus(actor, allowedTaskStatus[1]),
      dashboardRepository.findTasksByStatus(actor, allowedTaskStatus[2]),
      dashboardRepository.findTasksByStatus(actor, allowedTaskStatus[3]),
      dashboardRepository.findTasksByStatus(actor, allowedTaskStatus[4]),
      dashboardRepository.findNotes(actor),
    ]);

    return {
      services: {
        pending: servicesPending,
        inProgress: servicesInProgress,
        completed: servicesCompleted,
        cancelled: servicesCancelled,
      },
      tasks: {
        pending: tasksPending,
        inProgress: tasksInProgress,
        blocked: tasksBlocked,
        completed: tasksCompleted,
        cancelled: tasksCancelled,
      },
      notes,
    };
  },

  async getServiceDetails(actor: AuthenticatedUser, serviceId: string) {
    const result = await dashboardRepository.findServiceDetails(serviceId, actor);

    if (!result) {
      throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
    }

    const { tasks, ...service } = result;

    return {
      ...service,
      tasks: {
        pending: tasks.filter((task) => task.status === allowedTaskStatus[0]),
        inProgress: tasks.filter((task) => task.status === allowedTaskStatus[1]),
        blocked: tasks.filter((task) => task.status === allowedTaskStatus[2]),
        completed: tasks.filter((task) => task.status === allowedTaskStatus[3]),
        cancelled: tasks.filter((task) => task.status === allowedTaskStatus[4]),
      },
    };
  },
};

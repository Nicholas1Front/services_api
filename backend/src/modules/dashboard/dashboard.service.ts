import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async getDashboard(actor: AuthenticatedUser) {
    const [
      servicesInProgress,
      servicesCompleted,
      tasksInProgress,
      tasksCompleted,
      notes,
    ] = await Promise.all([
      dashboardRepository.findServicesByStatus(actor, "IN_PROGRESS"),
      dashboardRepository.findServicesByStatus(actor, "COMPLETED"),
      dashboardRepository.findTasksByStatus(actor, "IN_PROGRESS"),
      dashboardRepository.findTasksByStatus(actor, "COMPLETED"),
      dashboardRepository.findNotes(actor),
    ]);

    return {
      services: {
        inProgress: servicesInProgress,
        completed: servicesCompleted,
      },
      tasks: {
        inProgress: tasksInProgress,
        completed: tasksCompleted,
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
        inProgress: tasks.filter((task) => task.status === "IN_PROGRESS"),
        completed: tasks.filter((task) => task.status === "COMPLETED"),
      },
    };
  },
};

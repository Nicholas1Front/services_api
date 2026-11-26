import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { invalidateDashboardCache } from "../dashboard/dashboard.cache.js";
import type {
  AddServiceVisibilityInput,
  CreateServiceInput,
  FindServicesByFiltersInput,
  UpdateServiceInput,
  UpdateServiceVisibilityInput,
} from "./services.schema.js";
import { servicesRepository } from "./services.repository.js";

const ensureAdmin = (actor: AuthenticatedUser) => {
  if (actor.role !== "ADMIN") {
    throw new AppError("Administrator access required", 403, "FORBIDDEN");
  }
};

const findServiceOrFail = async (serviceId: string) => {
  const service = await servicesRepository.findById(serviceId);

  if (!service) {
    throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
  }

  return service;
};

const ensureServiceOwner = (
  actor: AuthenticatedUser,
  ownerId: string,
) => {
  if (actor.id !== ownerId) {
    throw new AppError("Only the service owner can change its visibility", 403, "FORBIDDEN");
  }
};

export const servicesService = {
  async createService(actor: AuthenticatedUser, input: CreateServiceInput) {
    ensureAdmin(actor);

    const service = await servicesRepository.create({
      ...input,
      ownerId: actor.id,
    });

    await invalidateDashboardCache();

    return service;
  },

  async getService(actor: AuthenticatedUser, serviceId: string) {
    const service = await findServiceOrFail(serviceId);
    const canView =
      actor.role === "ADMIN" ||
      service.ownerId === actor.id ||
      service.visibility.some((item) => item.role === actor.role);

    if (!canView) {
      throw new AppError("Service not found", 404, "SERVICE_NOT_FOUND");
    }

    return service;
  },

  async findServicesByFilters(
    actor: AuthenticatedUser,
    filters: FindServicesByFiltersInput,
  ) {
    const [services, total] = await servicesRepository.findByFilters(filters, actor);

    return {
      services,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  },

  async updateService(
    actor: AuthenticatedUser,
    serviceId: string,
    input: UpdateServiceInput,
  ) {
    ensureAdmin(actor);

    const updatedService = await servicesRepository.update(serviceId, input);

    await invalidateDashboardCache();

    return updatedService;
  },

  async deleteService(actor: AuthenticatedUser, serviceId: string) {
    ensureAdmin(actor);

    const deletedService = await servicesRepository.delete(serviceId);

    await invalidateDashboardCache();

    return deletedService;
  },

  async addServiceVisibility(
    actor: AuthenticatedUser,
    serviceId: string,
    input: AddServiceVisibilityInput,
  ) {
    const service = await findServiceOrFail(serviceId);
    ensureServiceOwner(actor, service.ownerId);

    await servicesRepository.addVisibility(serviceId, input.roles);
    await invalidateDashboardCache();

    return servicesRepository.findById(serviceId);
  },

  async updateServiceVisibility(
    actor: AuthenticatedUser,
    serviceId: string,
    input: UpdateServiceVisibilityInput,
  ) {
    const service = await findServiceOrFail(serviceId);
    ensureServiceOwner(actor, service.ownerId);

    const updatedVisibility = await servicesRepository.updateVisibility(
      serviceId,
      input.roles,
    );

    await invalidateDashboardCache();

    return updatedVisibility;
  },
};

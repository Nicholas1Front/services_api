import { AppError } from "../../config/app-error.js";
import type { AuthenticatedUser } from "../../types/auth.js";
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

    return servicesRepository.create({
      ...input,
      ownerId: actor.id,
    });
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
    return servicesRepository.update(serviceId, input);
  },

  async deleteService(actor: AuthenticatedUser, serviceId: string) {
    ensureAdmin(actor);
    return servicesRepository.delete(serviceId);
  },

  async addServiceVisibility(
    actor: AuthenticatedUser,
    serviceId: string,
    input: AddServiceVisibilityInput,
  ) {
    const service = await findServiceOrFail(serviceId);
    ensureServiceOwner(actor, service.ownerId);

    await servicesRepository.addVisibility(serviceId, input.roles);

    return servicesRepository.findById(serviceId);
  },

  async updateServiceVisibility(
    actor: AuthenticatedUser,
    serviceId: string,
    input: UpdateServiceVisibilityInput,
  ) {
    const service = await findServiceOrFail(serviceId);
    ensureServiceOwner(actor, service.ownerId);

    return servicesRepository.updateVisibility(serviceId, input.roles);
  },
};

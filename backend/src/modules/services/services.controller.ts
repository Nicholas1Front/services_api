import type { RequestHandler } from "express";
import { AppError } from "../../config/app-error.js";
import { servicesService } from "./services.service.js";
import {
  addServiceVisibilitySchema,
  createServiceSchema,
  findServicesByFiltersSchema,
  updateServiceSchema,
  updateServiceVisibilitySchema,
} from "./services.schema.js";

export const createService: RequestHandler = async (req, res) => {
  const parsedBody = createServiceSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid service data", 400, "INVALID_SERVICE_DATA");
  }

  const service = await servicesService.createService(req.user!, parsedBody.data);

  res.status(201).json({
    status: "success",
    data: service,
  });
};

export const getService: RequestHandler = async (req, res) => {
  const serviceId = req.params.id as string;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400, "SERVICE_ID_REQUIRED");
  }

  const service = await servicesService.getService(req.user!, serviceId);

  res.status(200).json({
    status: "success",
    data: service,
  });
};

export const findServicesByFilters: RequestHandler = async (req, res) => {
  const parsedQuery = findServicesByFiltersSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new AppError("Invalid service filters", 400, "INVALID_SERVICE_FILTERS");
  }

  const result = await servicesService.findServicesByFilters(req.user!, parsedQuery.data);

  res.status(200).json({
    status: "success",
    data: result.services,
    pagination: result.pagination,
  });
};

export const updateService: RequestHandler = async (req, res) => {
  const serviceId = req.params.id as string;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400, "SERVICE_ID_REQUIRED");
  }

  const parsedBody = updateServiceSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid service data", 400, "INVALID_SERVICE_DATA");
  }

  const service = await servicesService.updateService(
    req.user!,
    serviceId,
    parsedBody.data,
  );

  res.status(200).json({
    status: "success",
    data: service,
  });
};

export const deleteService: RequestHandler = async (req, res) => {
  const serviceId = req.params.id as string;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400, "SERVICE_ID_REQUIRED");
  }

  const result = await servicesService.deleteService(req.user!, serviceId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const addServiceVisibility: RequestHandler = async (req, res) => {
  const serviceId = req.params.id as string;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400, "SERVICE_ID_REQUIRED");
  }

  const parsedBody = addServiceVisibilitySchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid service visibility", 400, "INVALID_SERVICE_VISIBILITY");
  }

  const service = await servicesService.addServiceVisibility(
    req.user!,
    serviceId,
    parsedBody.data,
  );

  res.status(201).json({
    status: "success",
    data: service,
  });
};

export const updateServiceVisibility: RequestHandler = async (req, res) => {
  const serviceId = req.params.id as string;

  if (!serviceId) {
    throw new AppError("Service ID is required", 400, "SERVICE_ID_REQUIRED");
  }

  const parsedBody = updateServiceVisibilitySchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid service visibility", 400, "INVALID_SERVICE_VISIBILITY");
  }

  const service = await servicesService.updateServiceVisibility(
    req.user!,
    serviceId,
    parsedBody.data,
  );

  res.status(200).json({
    status: "success",
    data: service,
  });
};

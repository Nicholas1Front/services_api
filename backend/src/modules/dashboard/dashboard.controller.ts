import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../../config/app-error.js";
import { dashboardService } from "./dashboard.service.js";

export const getDashboard: RequestHandler = async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.user!);

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
};

export const getServiceDetails: RequestHandler = async (req, res) => {
  const parsedId = z.string().uuid().safeParse(req.params.id);

  if (!parsedId.success) {
    throw new AppError("Invalid service ID", 400, "INVALID_SERVICE_ID");
  }

  const service = await dashboardService.getServiceDetails(
    req.user!,
    parsedId.data,
  );

  res.status(200).json({
    status: "success",
    data: service,
  });
};

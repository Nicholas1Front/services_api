import type { RequestHandler } from "express";
import { AppError } from "../../config/app-error.js";
import { notesService } from "./notes.service.js";
import {
  createNoteSchema,
  findNotesByFiltersSchema,
  updateNoteSchema,
} from "./notes.schema.js";

export const createNote: RequestHandler = async (req, res) => {
  const parsedBody = createNoteSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid note data", 400, "INVALID_NOTE_DATA");
  }

  const note = await notesService.createNote(req.user!, parsedBody.data);

  res.status(201).json({
    status: "success",
    data: note,
  });
};

export const getNote: RequestHandler = async (req, res) => {
  const noteId = req.params.id as string;

  if (!noteId) {
    throw new AppError("Note ID is required", 400, "NOTE_ID_REQUIRED");
  }

  const note = await notesService.getNote(req.user!, noteId);

  res.status(200).json({
    status: "success",
    data: note,
  });
};

export const findNotesByFilters: RequestHandler = async (req, res) => {
  const parsedQuery = findNotesByFiltersSchema.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new AppError("Invalid note filters", 400, "INVALID_NOTE_FILTERS");
  }

  const result = await notesService.findNotesByFilters(req.user!, parsedQuery.data);

  res.status(200).json({
    status: "success",
    data: result.notes,
    pagination: result.pagination,
  });
};

export const updateNote: RequestHandler = async (req, res) => {
  const noteId = req.params.id as string;

  if (!noteId) {
    throw new AppError("Note ID is required", 400, "NOTE_ID_REQUIRED");
  }

  const parsedBody = updateNoteSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError("Invalid note data", 400, "INVALID_NOTE_DATA");
  }

  const note = await notesService.updateNote(req.user!, noteId, parsedBody.data);

  res.status(200).json({
    status: "success",
    data: note,
  });
};

export const deleteNote: RequestHandler = async (req, res) => {
  const noteId = req.params.id as string;

  if (!noteId) {
    throw new AppError("Note ID is required", 400, "NOTE_ID_REQUIRED");
  }

  const result = await notesService.deleteNote(req.user!, noteId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

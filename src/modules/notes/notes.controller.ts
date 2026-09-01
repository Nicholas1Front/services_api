import type {Request, Response} from "express";
import {AppError} from "@/errors/AppError";

import notesService from "@/modules/notes/notes.service";

import {
    createNoteSchema,
    updateNoteSchema,
    getNotesFiltersSchema
} from "@/modules/notes/notes.schema";

class NotesController{
    async createNote(
        req: Request,
        res: Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const data = createNoteSchema.parse(req.body);

        const note = await notesService.createNote(data, req.user.id);

        return res.status(200).json({
            message : "Note created successfully",
            data : note
        })
    }

    async updateNote(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const data = updateNoteSchema.parse(req.body);

        const note = await notesService.updateNote(
            req.params.id as string,
            req.user.id,
            data
        );

        return res.status(200).json({
            message : "Note updated successfully",
            data : note
        })
    }

    async getNotesByFilters(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const filters = getNotesFiltersSchema.parse(req.query);

        const notes = await notesService.getNotesByFilters(
            req.user.role,
            filters
        )

        return res.status(200).json({
            message : "Notes retrieved successfully",
            data : notes
        })
    }

    async getUserNotes(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const notes = await notesService.getUserNotes(req.user.id);

        return res.status(200).json({
            message : "Notes retrieved successfully",
            data : notes
        })
    }

    async deleteNoteById(
        req : Request,
        res : Response
    ){
        if(!req.user){
            throw new AppError({
                message : 'Unauthorized',
                statusCode : 401,
                code : 'UNAUTHORIZED'
            })
        }

        const result = await notesService.deleteNoteById(
            req.params.id as string,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            message : "Note deleted successfully"
        })
    }
}

export default new NotesController();

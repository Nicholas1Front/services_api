import notesRepository from "@/modules/notes/notes.repository";

import {AppError} from '@/errors/AppError';

import type {
    createNoteDTO,
    updateNoteDTO,
    getNotesFiltersDTO
} from '@/modules/notes/notes.dto';

import {tablesList} from '@/shared/entity.tables.list';

import {cacheKeys} from '@/shared/cache/cache.keys';
import {cacheService} from '@/shared/cache/cache.service';

class NotesService{
    async createNote(
        data : createNoteDTO,
        userId : string
    ){
        if(!tablesList.includes(data.entityTable)){
            throw new AppError({
                message : 'Invalid entity table',
                statusCode : 400,
                code : 'INVALID_ENTITY_TABLE'
            })
        }

        const verifiedEntity = await notesRepository.verifyEntity(data.entityId);

        if(verifiedEntity[0] === null){
            throw new AppError({
                message : 'Entity not found',
                statusCode : 404,
                code : 'ENTITY_NOT_FOUND'
            })
        }

        if(data.title === undefined){
            data.title = `Nota de ${data.entityTable} ${data.entityId} (${userId})`
        }

        const note = await notesRepository.createNote(
            data.title,
            data.content,
            data.entityId,
            data.entityTable,
            userId
        )

        if(!note){
            throw new AppError({
                message : 'Note not created',
                statusCode : 400,
                code : 'NOTE_NOT_CREATED'
            })
        }

        return note
    }

    async updateNote(
        requesterId : string,
        noteId : string,
        data : updateNoteDTO
    ){

        const existingNote = await notesRepository.getNoteById(noteId)

        if(!existingNote){
            throw new AppError({
                message : 'Note not found',
                statusCode : 404,
                code : 'NOTE_NOT_FOUND'
            })
        }

        if(existingNote.userId !== requesterId){
            throw new AppError({
                message : 'Forbidden access to update note',
                statusCode : 403,
                code : 'FORBIDDEN_ACCESS'
            })
        }

        if(data.title !== undefined){
            existingNote.title = data.title;
        }

        if(data.content !== undefined){
            existingNote.content = data.content;
        }

        if(data.entityId !== undefined || data.entityTable !== undefined){
            const verifiedEntity = await notesRepository.verifyEntity(data.entityId as string);

            if(verifiedEntity[0] === null){
                throw new AppError({
                    message : 'Entity not found',
                    statusCode : 404,
                    code : 'ENTITY_NOT_FOUND'
                })
            }

            existingNote.entityId = data.entityId as string;
            existingNote.entityTable = data.entityTable as string;
        }

        const updatedNote = await notesRepository.updateNote(existingNote, noteId);

        if(!updatedNote){
            throw new AppError({
                message : 'Note not updated',
                statusCode : 400,
                code : 'NOTE_NOT_UPDATED'
            })
        }

        return updatedNote
    }

    async getNotesByFilters(
        requesterRole : string,
        filters : getNotesFiltersDTO
    ){
        if(requesterRole !== 'ADMIN'){
            throw new AppError({
                message : 'Cannot get notes - Forbidden access',
                statusCode : 403,
                code : 'CANNOT_GET_NOTES_FORBBIDEN_ACCESS'
            })
        }

        const refinedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        );

        const cacheKey = cacheKeys.notes.filters(refinedFilters);

        const cachedNotes = await cacheService.get(cacheKey);

        if(cachedNotes){
            return {
                cache : `Returning cached notes`,
                data : cachedNotes
            }
        }

        const notes = await notesRepository.getNotesByFilters(filters);

        if(!notes){
            throw new AppError({
                message : 'Notes not found',
                statusCode : 404,
                code : 'NOTES_NOT_FOUND'
            })
        }

        return notes
    }

    async getUserNotes(
        userId : string
    ){
        const cacheKey = cacheKeys.notes.user(userId);

        const cachedNotes = await cacheService.get(cacheKey);

        if(cachedNotes){
            return {
                cache : `Returning cached notes for user ${userId}`,
                data : cachedNotes
            }
        }

        const notes = await notesRepository.getUserNotes(userId);

        if(!notes){
            throw new AppError({
                message : 'Notes not found',
                statusCode : 404,
                code : 'NOTES_NOT_FOUND'
            })
        }

        await cacheService.set(cacheKey, notes)

        return notes
    }

    async deleteNoteById(
        noteId : string,
        requesterId : string,
        requesterRole : string
    ){
        const existingNote = await notesRepository.getNoteById(noteId);

        if(!existingNote){
            throw new AppError({
                message : 'Note not found',
                statusCode : 404,
                code : 'NOTE_NOT_FOUND'
            })
        }

        if(requesterRole !== 'ADMIN' && existingNote.userId !== requesterId){
            throw new AppError({
                message : 'Cannot delete note - Forbidden access',
                statusCode : 403,
                code : 'CANNOT_DELETE_NOTE_FORBBIDEN_ACCESS'
            })
        }

        const result = await notesRepository.deleteNoteById(noteId);

        if(!result){
            throw new AppError({
                message : 'Note not deleted',
                statusCode : 400,
                code : 'NOTE_NOT_DELETED'
            })
        }

        return true
    }
}

export default new NotesService();
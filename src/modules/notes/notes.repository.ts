import {prisma} from '@/config/prisma';

class NotesRepository{
    //helpers

    async verifyEntity(
        entityId : string
    ){
        const entity = await Promise.all([
            await prisma.service.findUnique({
                where : {
                    id : entityId
                }
            }),
            await prisma.task.findUnique({
                where : {
                    id : entityId
                }
            }),
            await prisma.user.findUnique({
                where : {
                    id : entityId
                }
            })
        ]);

        return entity
    }
    
    async createNote(
        title : string,
        content : string,
        entityId : string,
        entityTable : string,
        userId : string
    ){
        const note = await prisma.note.create({
            data : {
                title,
                content,
                entityId,
                entityTable,
                user : {
                    connect : {
                        id : userId
                    }
                }
            }
        })

        return note
    }

    async updateNote(
        data : any,
        noteId : string
    ){
        const note = await prisma.note.update({
            where : {
                id : noteId
            },
            data
        });

        return note
    }

    async getNotesByFilters(
        filters : any
    ){
        const notes = await prisma.note.findMany({
            where : {
                id : filters.id,
                userId : filters.userId,
                title : filters.title,
                content : filters.content,
                entityId : filters.entityId,
                entityTable : filters.entityTable
            }
       })

        return notes
    }

    async getUserNotes(
        userId : string
    ){
        const notes = await prisma.note.findMany({
            where : {
                userId
            }
        })

        return notes
    }

    async getNoteById(
        noteId : string
    ){
        const note = await prisma.note.findUnique({
            where : {
                id : noteId
            }
        })

        return note
    }

    async deleteNoteById(
        noteId : string
    ){
        await prisma.note.delete({
            where : {
                id : noteId
            }
        })

        return true
    }
}

export default new NotesRepository();
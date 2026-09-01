import {z} from 'zod';

import {
    createNoteSchema,
    updateNoteSchema,
    getNotesFiltersSchema
} from '@/modules/notes/notes.schema';

export type createNoteDTO = z.infer<typeof createNoteSchema>;
export type updateNoteDTO = z.infer<typeof updateNoteSchema>;
export type getNotesFiltersDTO = z.infer<typeof getNotesFiltersSchema>;
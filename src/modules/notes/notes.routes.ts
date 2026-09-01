import {Router} from 'express';
import {authMiddleware} from '@/middlewares/auth.middleware';
import notesController from '@/modules/notes/notes.controller';

const router = Router();

router.use(authMiddleware);

router.post('/create-note', notesController.createNote);

router.put('/update-note/:id', notesController.updateNote);

router.get('/get-notes-by-filters', notesController.getNotesByFilters);

router.get('/get-user-notes', notesController.getUserNotes);

router.delete('/delete-note/:id', notesController.deleteNoteById);

export default router;

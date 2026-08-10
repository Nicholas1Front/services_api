import { Router } from 'express';

import { AppError } from '@/errors/AppError';

// routes
import authRoutes from '@/modules/auth/auth.routes';

export const routes = Router();

routes.get('/health', (_, response) => {
  return response.status(200).json({
    success: true,
    message: 'Service API is running!',
  });
});

routes.get('/error', () => {
  throw new AppError({
    message: 'This is a test error.',
    statusCode: 400,
    code: 'TEST_ERROR',
  });
});

routes.use('/auth', authRoutes);
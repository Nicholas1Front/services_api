import {Router} from 'express';
import {authMiddleware} from '@/middlewares/auth.middleware';
import servicesController from '@/modules/services/services.controller';

const router = Router();

router.use(authMiddleware);

router.post(
    '/create-service',
    servicesController.createService
)

router.post(
    '/add-visibility-to-service',
    servicesController.addVisibilityToService
)

router.put(
    '/update-service-info/:id',
    servicesController.updateServiceInfo
)

router.patch(
    '/update-service-status/:id',
    servicesController.updateServiceStatus
)

router.get(
    '/get-services',
    servicesController.getServicesByFilters
)

router.get(
    '/get-user-services',
    servicesController.getServicesVisibleToUser
)

router.delete(
    '/delete-service/:id',
    servicesController.deleteService
)

router.delete(
    '/delete-visibility',
    servicesController.deleteVisibilityFromService
)

export default router;
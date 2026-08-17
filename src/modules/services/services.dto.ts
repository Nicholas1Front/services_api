import {z} from 'zod';

import {
    createServiceSchema,
    updateServiceInfoSchema,
    updateServiceStatusSchema,
    getServicesFiltersSchema,
    addVisibilityToServiceSchema,
    deleteVisibilityFromServiceSchema
} from '@/modules/services/services.schema';

export type createServiceDTO = z.infer<typeof createServiceSchema>;

export type updateServiceInfoDTO = z.infer<typeof updateServiceInfoSchema>;

export type updateServiceStatusDTO = z.infer<typeof updateServiceStatusSchema>;

export type getServicesFiltersDTO = z.infer<typeof getServicesFiltersSchema>;

export type addVisibilityToServiceDTO = z.infer<typeof addVisibilityToServiceSchema>;

export type deleteVisibilityFromServiceDTO = z.infer<typeof deleteVisibilityFromServiceSchema>;
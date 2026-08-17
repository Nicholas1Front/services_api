import {z} from 'zod';

export const optionalToNullSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.nullish().transform((val) => (val == null ? null : val));
};
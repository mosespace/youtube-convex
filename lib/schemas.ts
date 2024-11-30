import * as z from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be more than 1 charater')
    .max(12, 'Title must be 12 characters or less'),
  description: z
    .string()
    .min(1, 'Description  must be more than 1 charater')
    .max(100, 'Description must be 100 characters or less'),
});

export type PostFormData = z.infer<typeof postSchema>;

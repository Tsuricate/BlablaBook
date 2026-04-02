import z from 'zod';

export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
  lang: z.string().min(2).default('fr'),
});

export const subjectSchema = z.string().min(1);

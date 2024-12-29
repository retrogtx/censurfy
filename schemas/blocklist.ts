import { z } from 'zod';

export const keywordSchema = z.object({
  keyword: z
    .string()
    .min(2, 'Keyword must be at least 2 characters')
    .max(50, 'Keyword too long')
    .refine((keyword) => !keyword.includes('safe-word'), {
      message: 'This keyword cannot be blocked',
    }),
}); 
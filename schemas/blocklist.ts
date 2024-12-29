import { z } from 'zod';

export const urlSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL')
    .refine((url) => !url.includes('safe-domain.com'), {
      message: 'This domain cannot be blocked',
    }),
}); 
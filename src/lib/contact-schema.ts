import { z } from 'zod'

export const ContactFieldsSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: 'Please enter a valid email address' })),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
})

export const ContactSubmissionSchema = ContactFieldsSchema.extend({
  captchaToken: z.string().min(1),
})

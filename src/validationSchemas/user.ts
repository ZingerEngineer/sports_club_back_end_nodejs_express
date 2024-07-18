import { z, ZodType } from 'zod'

const userSignUpPayLoadSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'A first name is required.' })
      .max(20, { message: 'Invalid first name.' }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: 'A last name is required.' })
      .max(20, { message: 'Invalid last name.' }),
    email: z
      .string()
      .trim()
      .email()
      .min(1, { message: 'An email is required.' })
      .max(200, { message: 'Invalid email address' }),
    phone: z
      .string()
      .trim()
      .min(1, { message: 'A phone number is required.' })
      .max(15, { message: 'Invalid phone number.' }),
    password: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' }),
    confirmPassword: z.string(),
    gender: z
      .string()
      .trim()
      .min(1, { message: 'A gender is required.' })
      .max(6, { message: 'Invalid gender.' }),
    dob: z.date({ message: 'Invaid date.' }),
    job: z
      .string()
      .trim()
      .min(1, { message: 'A job is required.' })
      .max(12, { message: 'Invalid job.' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'] // path of error
  })

const userLoginPayLoadSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .min(1, { message: 'An email is required.' })
      .max(200, { message: 'Invalid email address' }),
    phone: z
      .string()
      .trim()
      .min(1, { message: 'A phone number is required.' })
      .max(15, { message: 'Invalid phone number.' }),
    password: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'] // path of error
  })

export { userLoginPayLoadSchema, userSignUpPayLoadSchema }

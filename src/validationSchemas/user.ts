import { z } from 'zod'

const userPatchEmailPayLoadSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .toLowerCase()
    .min(1, { message: 'An email is required.' })
    .max(200, { message: 'Invalid email address' })
})

const userPatchPasswordPayLoadSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' }),
    confirmNewPassword: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'] // path of error
  })

const userPatchProfilePictureSchema = z.object({
  profilePicture: z.string().url()
})

const userPatchFirstNameSchema = z.object({
  newFirstName: z
    .string()
    .trim()
    .min(1, { message: 'A first name is required.' })
    .max(20, { message: 'Invalid first name.' })
})
const userPatchLastNameSchema = z.object({
  newLastName: z
    .string()
    .trim()
    .min(1, { message: 'A last name is required.' })
    .max(20, { message: 'Invalid last name.' })
})

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
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' }),
    gender: z
      .number()
      .min(0, { message: 'Invalid gender.' })
      .max(1, { message: 'Invalid gender.' }),
    dob: z.string().date('Invalid date.'),
    job: z
      .number()
      .min(0, { message: 'Invalid job.' })
      .max(2, { message: 'Invalid job.' })
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
      .max(200, { message: 'Invalid email address' })
      .optional(),
    phone: z
      .string()
      .trim()
      .min(1, { message: 'A phone number is required.' })
      .max(15, { message: 'Invalid phone number.' })
      .optional(),
    password: z
      .string()
      .trim()
      .min(1, { message: 'A password name is required.' })
      .max(45, { message: 'Password exceeded the maximum length.' })
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either phone or email must be provided.'
  })

export {
  userLoginPayLoadSchema,
  userSignUpPayLoadSchema,
  userPatchEmailPayLoadSchema,
  userPatchPasswordPayLoadSchema,
  userPatchProfilePictureSchema,
  userPatchFirstNameSchema,
  userPatchLastNameSchema
}

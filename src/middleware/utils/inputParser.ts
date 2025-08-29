import z from "zod"

export const userSignupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string()
})

export const userSignInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const channelInputParser = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string()
})

export const sessionInputSchema = z.object({
  title: z.string().min(1)
})
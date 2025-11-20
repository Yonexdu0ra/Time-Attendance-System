import z from "zod";

export const accountSchema = z.object({
    provider: z.string().min(1, "Provider is required").trim(),
    providerAccountId: z.string().min(1, "Provider Account ID is required").trim(),
    type: z.string().min(1, "Type is required").trim(),
    access_token: z.string().optional(),
    refresh_token: z.string().optional(),
    userId: z.string().uuid().min(1, "User ID is required").trim(),
    expires_at: z.number().optional(),
    id_token: z.string().optional(),
    token_type: z.string().optional(),
    scope: z.string().optional(),
    session_state: z.string().optional(),
    password: z.string().optional(),
})
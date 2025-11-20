import z from "zod";

export const loginCredentialsSchema = z.object({
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").trim(),
})
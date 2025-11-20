import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Tên phải có ít nhất 3 ký tự").trim(),
    email: z.string().trim().pipe(z.email()),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").trim(),
})
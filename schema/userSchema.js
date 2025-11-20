import z from "zod";

export const userSchema = z.object({
    name: z.string().min(3, "Tên phải có ít nhất 3 ký tự").trim(),
    email: z.string().trim().pipe(z.email()),
    image: z.string().pipe(z.url()).optional(),
})
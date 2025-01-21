import { z } from "zod";

export const createProductSchema = z.object({
    id: z.string().uuid().optional(),
    name: z
        .string()
        .trim()
        .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
        .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
    price: z.coerce
        .number()
        .min(0.01, { message: "O preço deve ser maior que 0" }),
    stock: z.coerce
        .number()
        .positive({ message: "O estoque deve ser maior que 0" })
        .int({ message: "O estoque deve ser um número inteiro" }),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
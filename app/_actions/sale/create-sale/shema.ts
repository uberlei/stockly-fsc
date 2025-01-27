import { z } from "zod";

export const createSaleShema = z.object({
    products: z.array(z.object({
        id: z.string().uuid(),
        quantity: z.coerce
            .number()
            .int()
            .positive(),
    }))
});

export type CreateSaleSchema = z.infer<typeof createSaleShema>;
"use server";

import { db } from "@/app/_lib/prisma";
import { deleteProductSchema, DeleteProductSchema } from "./shema";
import { revalidatePath } from "next/cache";


export async function deleteProduct({ id }: DeleteProductSchema) {
    deleteProductSchema.parse({ id });
    await db.product.delete({
        where: {
            id: id,
        },
    });
    revalidatePath("/products");
}

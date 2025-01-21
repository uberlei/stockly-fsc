"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { createProductSchema, CreateProductSchema } from "./shema";

export const upsertProduct = async (data: CreateProductSchema) => {
    createProductSchema.parse(data);

    await db.product.upsert({
        where: { id: data.id ?? "" },
        update: data,
        create: data,
    });
    revalidatePath("/products");
    // revalidateTag("get-products"); revalidar apenas um cache
};


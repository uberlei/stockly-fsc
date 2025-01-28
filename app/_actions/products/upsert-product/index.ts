"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { createProductSchema } from "./shema";
import { actionClient } from "@/app/_lib/safe-action";

export const upsertProduct = actionClient.schema(createProductSchema).action(async ({ parsedInput: { id, ...data } }) => {
    await db.product.upsert({
        where: { id: id ?? "" },
        update: data,
        create: data,
    });
    revalidatePath("/products");
    // revalidateTag("get-products"); revalidar apenas um cache
});


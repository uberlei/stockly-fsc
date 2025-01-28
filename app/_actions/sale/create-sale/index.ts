"use server"

import { db } from "@/app/_lib/prisma";
import { createSaleShema } from "./shema";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/app/_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const createSale = actionClient.schema(createSaleShema).action(async ({ parsedInput: { products } }) => {

    await db.$transaction(async (trx) => {

        const sale = await trx.sale.create({
            data: {
                date: new Date(),
            },
        });

        for (const product of products) {
            const productFromDB = await db.product.findUnique({
                where: {
                    id: product.id,
                },
            });

            if (!productFromDB) {
                returnValidationErrors(createSaleShema, { _errors: [`Product with id ${product.id} not found`] });
            }

            if (productFromDB.stock < product.quantity) {
                returnValidationErrors(createSaleShema, { _errors: [`Product with id ${product.id} has insufficient stock`] });
            }

            await trx.saleProduct.create({
                data: {
                    saleId: sale.id,
                    productId: product.id,
                    quantity: product.quantity,
                    unitPrice: productFromDB.price,
                },
            });

            await trx.product.update({ where: { id: product.id }, data: { stock: { decrement: product.quantity } } });
        }
    });

    revalidatePath("/sales");
    revalidatePath("/products");

});
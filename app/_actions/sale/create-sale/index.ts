"use server"

import { db } from "@/app/_lib/prisma";
import { CreateSaleSchema, createSaleShema } from "./shema";
import { revalidatePath } from "next/cache";

export const createSale = async (data: CreateSaleSchema) => {
    createSaleShema.parse(data);

    await db.$transaction(async (trx) => {

        const sale = await trx.sale.create({
            data: {
                date: new Date(),
            },
        });

        for (const product of data.products) {
            const productFromDB = await db.product.findUnique({
                where: {
                    id: product.id,
                },
            });

            if (!productFromDB) {
                throw new Error(`Product with id ${product.id} not found`);
            }

            if (productFromDB.stock < product.quantity) {
                throw new Error(`Product with id ${product.id} has insufficient stock`);
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
}
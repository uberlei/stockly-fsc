import "server-only";
import { db } from "@/app/_lib/prisma";
import { Product } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getProducts = async (): Promise<Product[]> => {
    const products = await db.product.findMany();
    return products;
};

export const cacheGetMemoizedProducts = cache(getProducts);

export const cacheGetProducts = unstable_cache(getProducts, ["getProducts"], {
    tags: ["get-products"],
    revalidate: 60,
});

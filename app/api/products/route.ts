import { db } from "@/app/_lib/prisma";

export async function GET() {
    const products = await db.product.findMany();
    return Response.json(products, { status: 200 });
}

export async function POST(request: Request) {

    const { name, price, stock } = await request.json();
    const product = await db.product.create({
        data: { name, price, stock },
    });
    return Response.json(product, { status: 201 });
}

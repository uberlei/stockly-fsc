import { db } from "@/app/_lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const product = await db.product.findUnique({
        where: { id },
    });


    if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await db.product.delete({
        where: { id },
    });
    return Response.json({ message: "Product deleted" }, { status: 200 });
}

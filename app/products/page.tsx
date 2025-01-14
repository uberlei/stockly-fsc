import { PlusIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { productTableColumns } from "./_components/table-columns";

const Products = async () => {
  const products = await db.product.findMany({});

  return (
    <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8 px-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de produtos
          </span>
          <h2 className="text-2xl font-semibold">Produtos</h2>
        </div>
        <Button className="gap-2">
          <PlusIcon />
          Novo Produto
        </Button>
      </div>
      <DataTable columns={productTableColumns} data={products} />
    </div>
  );
};

export default Products;

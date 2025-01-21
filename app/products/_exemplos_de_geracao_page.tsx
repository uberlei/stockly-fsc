import { PlusIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { DataTable } from "../_components/ui/data-table";
import { productTableColumns } from "./_components/product-table-columns";
import { cacheGetProducts } from "../_data-acess/product/get-product";

// Deixa a pagina dinâmica quando requisao é feito utilizando banco de dados const products = await getProduct();
// export const dynamic = "force-dynamic";

// Pagina revalidada a cada 5 segundos Incremental Static Regeneration
// export const revalidate = 5;

const Products = async () => {
  // Deixa a pagina dinâmica e quando usa parametros tbm
  // const cookieStore = cookies();
  // const headersList = headers();
  // const response = await fetch("", {
  //   method: "GET",
  //   cache: "no-store",
  // });

  const products = await cacheGetProducts();
  // const products = await getProducts();
  // Pagina cacheada Static Generation
  // const response = await fetch("http://localhost:3000/api/products", {
  //   method: "GET",
  // });
  // const products = await response.json();
  // Pagina não cacheada Server Side Rendering
  // const response = await fetch("http://localhost:3000/api/products", {
  //   method: "GET",
  //   cache: "no-store",
  // });
  // const products = await response.json();
  // Pagina revalidada a cada 5 segundos Incremental Static Regeneration
  // const response = await fetch("http://localhost:3000/api/products", {
  //   method: "GET",
  //   next: {
  //     revalidate: 5,
  //   },
  // });
  // const products = await response.json();

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
      <DataTable
        columns={productTableColumns}
        data={JSON.parse(JSON.stringify(products))}
      />
      {/* <ProductList /> */}
    </div>
  );
};

export default Products;

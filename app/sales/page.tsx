import { ComboboxOption } from "../_components/ui/combobox";
import { getProducts } from "../_data-acess/product/get-product";
import CreateSaleButton from "./_components/create-sale-button";

const SalesPage = async () => {
  const products = await getProducts();
  const productOptions: ComboboxOption[] = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8 px-8">
      <div className="flex w-full items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500">
            Gestão de vendas
          </span>
          <h2 className="text-2xl font-semibold">Vendas</h2>
        </div>

        <CreateSaleButton productOptions={productOptions} products={products} />
      </div>
      {/* <DataTable columns={productTableColumns} data={products} /> */}
    </div>
  );
};

export default SalesPage;

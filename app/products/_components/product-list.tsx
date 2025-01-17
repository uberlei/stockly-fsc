import { cacheGetMemoizedProducts } from "@/app/_data-acess/product/get-product";

const ProductList = async () => {
  // const response = await fetch("http://localhost:3000/api/products", {
  //   method: "GET",
  // });
  // const products = await response.json();
  // Cacheado com memoização
  const products = await cacheGetMemoizedProducts();
  return (
    <ul>
      {products.map((product: any) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;

"use client";

import { Input } from "@/app/_components/ui/input";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Combobox, ComboboxOption } from "@/app/_components/ui/combobox";
import { Button } from "@/app/_components/ui/button";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Product } from "@prisma/client";
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableCaption,
  TableBody,
  TableCell,
  TableFooter,
} from "@/app/_components/ui/table";
import { formatCurrency } from "@/app/_helpers/currency";
import TableSaleDropdownMenu from "./table-sale-dropdown-menu";
import { CheckIcon } from "lucide-react";
import { createSale } from "@/app/_actions/sale/create-sale";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { flattenValidationErrors } from "next-safe-action";

const formSchema = z.object({
  productId: z.string().uuid({
    message: "Produto é obrigatório",
  }),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: "Quantidade deve ser maior que 0" }),
});

type FormSchema = z.infer<typeof formSchema>;

interface UpsertSaleSheetContentProps {
  products: Product[];
  productOptions: ComboboxOption[];
  setSheetIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const UpsertSaleSheetContent = ({
  products,
  productOptions,
  setSheetIsOpen,
}: UpsertSaleSheetContentProps) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const { execute: executeCreateSale } = useAction(createSale, {
    onSuccess: () => {
      form.reset();
      toast.success("Venda realizada com sucesso");
      setSheetIsOpen(false);
    },
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedErrors = flattenValidationErrors(validationErrors);
      toast.error(serverError ?? flattenedErrors.formErrors.join("\n"));
    },
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  const onSubmit = (data: FormSchema) => {
    const selectedProduct = products.find(
      (product) => product.id === data.productId,
    );
    if (!selectedProduct) return;

    setSelectedProducts((currentProducts) => {
      const existingProduct = currentProducts.find(
        (product) => product.id === selectedProduct.id,
      );
      if (existingProduct) {
        if (existingProduct.quantity + data.quantity > selectedProduct.stock) {
          form.setError("quantity", {
            message: "Quantidade de produto não disponível em estoque",
          });
          return currentProducts;
        }

        return currentProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, quantity: product.quantity + data.quantity }
            : product,
        );
      }

      if (data.quantity > selectedProduct.stock) {
        form.setError("quantity", {
          message: "Quantidade de produto não disponível em estoque",
        });
        return currentProducts;
      }

      return [
        ...currentProducts,
        {
          ...selectedProduct,
          price: Number(selectedProduct.price),
          quantity: data.quantity,
        },
      ];
    });

    form.reset();
  };

  const productsTotal = useMemo(
    () =>
      selectedProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
    [selectedProducts],
  );

  const onDeleteProduct = (productId: string) => {
    setSelectedProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  const onSubmitSale = async () => {
    executeCreateSale({
      products: selectedProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    });
  };

  return (
    <SheetContent className="!max-w-[700px]">
      <SheetHeader>
        <SheetTitle>Nova venda</SheetTitle>
        <SheetDescription>
          Preencha os campos abaixo para criar uma nova venda.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    options={productOptions}
                    placeholder="Selecione um produto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite a quantidade"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" variant="secondary">
            Adicionar produto a venda
          </Button>
        </form>
      </Form>
      <Table>
        <TableCaption>Lista de produtos adicionados a venda</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Preço unitário</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price * product.quantity)}
              </TableCell>
              <TableCell>
                <TableSaleDropdownMenu
                  product={product}
                  onDelete={onDeleteProduct}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(productsTotal)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter className="pt-6">
        <Button
          className="w-full gap-2"
          disabled={!selectedProducts.length}
          onClick={onSubmitSale}
        >
          <CheckIcon size={20} />
          Finalizar venda
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default UpsertSaleSheetContent;

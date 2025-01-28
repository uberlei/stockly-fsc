"use client";

import { Input } from "@/app/_components/ui/input";
import { NumericFormat } from "react-number-format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertProduct } from "@/app/_actions/products/upsert-product";
import { Button } from "@/app/_components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  CreateProductSchema,
  createProductSchema,
} from "@/app/_actions/products/upsert-product/shema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/app/_components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { flattenValidationErrors } from "next-safe-action";
import { Dispatch, SetStateAction } from "react";

interface UpsertProductDialogContentProps {
  defaultValues?: CreateProductSchema;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const UpsertProductDialogContent = ({
  defaultValues,
  setDialogOpen,
}: UpsertProductDialogContentProps) => {
  const { execute: executeUpsertProduct } = useAction(upsertProduct, {
    onSuccess: () => {
      toast.success("Produto salvo com sucesso.");
      setDialogOpen(false);
    },
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedErrors = flattenValidationErrors(validationErrors);

      toast.error(serverError ?? flattenedErrors.formErrors.join("\n"));
    },
  });

  const form = useForm<CreateProductSchema>({
    shouldUnregister: true,
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultValues ?? {
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const isEditing = !!defaultValues;

  const onSubmit = (data: CreateProductSchema) =>
    executeUpsertProduct({ ...data, id: defaultValues?.id });
  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Criar"} Produto</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite um produto para o seu estoque."
                : "Crie um novo produto para o seu estoque."}
            </DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input placeholder="digite o nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço do produto</FormLabel>
                <FormControl>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale={true}
                    decimalScale={2}
                    prefix="R$"
                    allowNegative={false}
                    customInput={Input}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    {...field}
                    onChange={() => {}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque do produto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="digite o estoque do produto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="reset" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="gap-1.5"
            >
              {form.formState.isSubmitting && (
                <Loader2Icon className="animate-spin" size={16} />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertProductDialogContent;

"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  price: z.coerce
    .number()
    .min(0.01, { message: "O preço deve ser maior que 0" }),
  stock: z.coerce
    .number()
    .positive({ message: "O estoque deve ser maior que 0" })
    .int({ message: "O estoque deve ser um número inteiro" }),
});

type FormSchema = z.infer<typeof formSchema>;

export function AddProductButton() {
  const form = useForm<FormSchema>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Criar Produto</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Crie um novo produto para o seu estoque.
            </DialogDescription>
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
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

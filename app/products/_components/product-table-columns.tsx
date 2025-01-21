"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon } from "lucide-react";
import ProductTableDropdownMenu from "./product-table-dropdown-menu";

const getStatusLabel = (status: string) => {
  return status === "IN_STOCK" ? "Em estoque" : "Fora de estoque";
};

export const productTableColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome do produto",
  },
  {
    accessorKey: "price",
    header: "Valor unitário",
    cell: (row) => {
      return Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(row.row.original.price));
    },
  },
  {
    accessorKey: "stock",
    header: "Estoque",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const label = getStatusLabel(row.row.original.status);

      return (
        <Badge
          variant={label === "Em estoque" ? "default" : "destructive"}
          className="gap-1.5"
        >
          <CircleIcon
            size={14}
            className={`${label === "Em estoque" ? "fill-primary-foreground" : "fill-destructive-foreground"}`}
          />
          {label}
        </Badge>
      );
    },
  },
  {
    header: "Ações",
    accessorKey: "actions",
    cell: (row) => {
      const product = row.row.original;
      return <ProductTableDropdownMenu product={product} />;
    },
  },
];

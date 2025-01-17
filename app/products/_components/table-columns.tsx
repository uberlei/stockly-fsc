"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleIcon,
  ClipboardListIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";

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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="gap-1.5"
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              <ClipboardListIcon size={16} />
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-1.5">
              <EditIcon size={16} />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-1.5">
              <TrashIcon size={16} />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

import { Button } from "@/app/_components/ui/button";
import { ClipboardListIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Product } from "@prisma/client";

interface TableSaleDropdownMenuProps {
  product: Pick<Product, "id">;
  onDelete: (productId: string) => void;
}

const TableSaleDropdownMenu = ({
  product,
  onDelete,
}: TableSaleDropdownMenuProps) => {
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
        <DropdownMenuItem
          className="gap-1.5"
          onClick={() => onDelete(product.id)}
        >
          <TrashIcon size={16} />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableSaleDropdownMenu;

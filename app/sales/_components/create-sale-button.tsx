"use client";

import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import UpsertSaleSheetContent from "./upsert-sale-sheet-content";
import { useState } from "react";
import { Product } from "@prisma/client";
import { ComboboxOption } from "@/app/_components/ui/combobox";

interface CreateSaleButtonProps {
  productOptions: ComboboxOption[];
  products: Product[];
}

const CreateSaleButton = (pros: CreateSaleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Nova venda</Button>
      </SheetTrigger>
      <UpsertSaleSheetContent setSheetIsOpen={setIsOpen} {...pros} />
    </Sheet>
  );
};

export default CreateSaleButton;

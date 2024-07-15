"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { publicNavItems } from "@/constants/data";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import PublicNav from "../public-nav";

type Props = {};

const PublicMobileSidebar = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Platven
              </h2>
              <div className="space-y-1">
                <PublicNav items={publicNavItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PublicMobileSidebar;

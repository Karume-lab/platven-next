"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type Props = {
  property: Property;
};

export const PropertyActions: FC<Props> = ({ property }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { push, refresh } = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const response = await fetch(`/api/properties/${property.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) {
      refresh();
      toast({
        title: "Success!",
        description: "Property deleted successfully!",
      });
      setOpen(false);

    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {((property as any).payment?.complete === false ||
            !(property as any).payment) && (
            <DropdownMenuItem
              onClick={() => push(`/dashboard/properties/${property.id}/pay`)}
            >
              Pay for listing
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => push(`/dashboard/properties/${property.id}/preview`)}
          >
            View Property
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => push(`/dashboard/properties/${property.id}`)}
          >
            Update property
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

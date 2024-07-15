"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { objectToFormData } from "@/lib/utils";
import { PropertyType } from "@prisma/client";
import clsx from "clsx";
import { PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { AlertModal } from "@/components/modal/alert-modal";

type Props = {
  type: PropertyType;
};

const TypeCardControlls: FC<Props> = ({ type: { isActive, id, title } }) => {
  const { refresh, push } = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleTogleActivate = async () => {
    const response = await fetch(`/api/property-types/${id}`, {
      method: "PUT",
      body: objectToFormData({ title, isActive: !isActive }),
    });
    if (response.ok) {
      refresh();
      toast({
        title: "Success!",
        description: "Property type active status updated successfully!",
      });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const response = await fetch(`/api/property-types/${id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) {
      refresh();
      toast({
        title: "Success!",
        description: "Property type deleted successfully!",
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
      <Badge
        className={clsx("absolute bottom-2 right-2 cursor-pointer", {
          "bg-destructive": isActive,
          "bg-green-900": !isActive,
        })}
        onClick={handleTogleActivate}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Badge>
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button
          variant={"default"}
          size={"icon"}
          className="bg-green-600"
          onClick={() => push(`/dashboard/properties/types/${id}`)}
        >
          <PencilLine />
        </Button>
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash2 />
        </Button>
      </div>
    </>
  );
};

export default TypeCardControlls;

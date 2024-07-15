"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Advert } from "@prisma/client";
import { PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { AlertModal } from "@/components/modal/alert-modal";

type Props = {
  advert: Advert;
};

const AdvertCardControlls: FC<Props> = ({ advert: { id, title } }) => {
  const { refresh, push } = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const response = await fetch(`/api/adverts/${id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) {
      refresh();
      toast({
        title: "Success!",
        description: "Advert deleted successfully!",
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
      <div className="absolute top-2 right-2 flex space-x-2">
        <Button
          variant={"default"}
          size={"icon"}
          className="bg-green-600"
          onClick={() => push(`/dashboard/adverts/${id}`)}
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

export default AdvertCardControlls;

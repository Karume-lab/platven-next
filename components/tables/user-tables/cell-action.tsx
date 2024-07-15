"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import useSessionContext from "@/hooks/useSessionContext";
import { objectToFormData } from "@/lib/utils";
import { User } from "@prisma/client";
import {
  BadgeCheck,
  BadgeX,
  Edit,
  Eye,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();
  const { user } = useSessionContext();
  const handleTogleActivate = async () => {
    const response = await fetch(`/api/user/${data.id}`, {
      method: "PUT",
      body: objectToFormData({
        name: data.name,
        isActive: !data.isActive,
        address: data.address,
        email: data.email,
        phoneNumber: data.phoneNumber,
        identificationNumber: data.identificationNumber,
        type: data.type,
      }),
    });
    if (response.ok) {
      router.refresh();
      toast({
        title: "Success!",
        description: "User active status updated successfully!",
      });
    }
  };

  const onConfirm = async () => {
    setLoading(true);
    const response = await fetch(`/api/user/${data.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (response.ok) {
      router.refresh();
      toast({
        title: "Success!",
        description: "User deleted successfully!",
      });
      setOpen(false);

    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
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
          <DropdownMenuItem onClick={handleTogleActivate}>
            {data.isActive ? (
              <BadgeX className="mr-2 h-4 w-4" />
            ) : (
              <BadgeCheck className="mr-2 h-4 w-4" />
            )}
            {data.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/user/${data.id}/profile`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          {pathName.startsWith("/dashboard/staff") && (
            <DropdownMenuItem
              onClick={() => {
                if (pathName.startsWith("/dashboard/user"))
                  router.push(`/dashboard/user/${data.id}`);
                else router.push(`/dashboard/staff/${data.id}`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          )}
          {pathName.startsWith("/dashboard/user") && (
            <DropdownMenuItem
              onClick={() => {
                router.push(`/dashboard/user/${data.id}/make-staff`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Make Staff
            </DropdownMenuItem>
          )}
          {user?.isSuperUser && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

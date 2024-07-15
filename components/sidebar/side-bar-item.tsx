"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

type Props = {
  href: string;
  title: string;
  disabled?: boolean;
  prefixIcon?: string;
  onClick?: () => void;
  children?: [];
};
const SidebarItem: FC<Props> = ({
  disabled,
  href,
  onClick,
  prefixIcon,
  title,
  children = [],
}) => {
  const open = useState(false);
  const pathname = usePathname();
  const isActive = new URL(href, "http://localhost").pathname === pathname;
  const Icon = (Icons as any)[prefixIcon || "arrowRight"];
  return (
    <Link href={disabled ? "/" : href} onClick={onClick}>
      <span
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent" : "transparent",
          disabled && "cursor-not-allowed opacity-80",
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </span>
    </Link>
  );
};

export default SidebarItem;

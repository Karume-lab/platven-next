"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSessionContext from "@/hooks/useSessionContext";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export function UserNav() {
  const { user, signOut } = useSessionContext();
  const { push } = useRouter();
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>
              {(user.name ?? user.email)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => push("/dashboard/profile")}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className={cn("flex items-center rounded-full border border-gray-300 px-4 py-2 bg-white")}>
      <Link href="/sign-in" className="block md:hidden">
        <User2 className="w-6 h-6" />
      </Link>
      <div className="hidden md:flex items-center">
        <Link href="/sign-in">
          <span
            className={cn(
              "group flex items-center text-sm font-medium hover:text-accent-foreground",
              "opacity-80 hover:opacity-100"
            )}
          >
            Login
          </span>
        </Link>
        <span className="mx-2 opacity-80">|</span>
        <Link href="/sign-up">
          <span
            className={cn(
              "group flex items-center text-sm font-medium hover:text-accent-foreground",
              "opacity-80 hover:opacity-100"
            )}
          >
            Register
          </span>
        </Link>
      </div>
    </div>
  );
};

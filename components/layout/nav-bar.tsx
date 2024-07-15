"use client";
import useSessionContext from "@/hooks/useSessionContext";
import { cn } from "@/lib/utils";
import { Check, Heart, Search, Text, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../Logo";
import { Input } from "../ui/input";
import PublicMobileSidebar from "./public-mobile-sidebar";
import PublicNavItems from "./public-nav-items";
import ThemeToggle from "./ThemeToggle/theme-toggle";
import { UserNav } from "./user-nav";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";
import { PropertyType } from "@prisma/client";
import Image from "next/image";

type Props = {};

const NavBar = (props: Props) => {
  const { user } = useSessionContext();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const [types, setTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/property-types");
      if (response.ok) {
        const data: PropertyType[] = await response.json();
        setTypes(data);
      }
    })();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur z-20">
      <nav>
        <div className="h-14 flex items-center justify-between px-4">
          <div className="hidden lg:block">
            <Link href={"/"} target="_blank">
              <Logo />
            </Link>
          </div>
          <div className={cn("block lg:!hidden")}>
            <PublicMobileSidebar />
          </div>
          <div className={cn("hidden lg:!block")}>
            <PublicNavItems />
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
            <ThemeToggle />
          </div>
        </div>
        <div className="hidden md:flex h-16 bg-accent">
          <div className="bg-green-700 h-full w-1/12" />
          <div className="bg-primary h-full w-3/12 flex items-center space-x-2 text-green-500 p-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent flex items-center space-x-2 rounded-none hover:bg-transparent hover:text-green-500 active:bg-transparent active:text-green-500 focus:bg-transparent focus:text-green-500 data-[state=open]:bg-transparent text-sm">
                    <Text />
                    <span>Browse categories</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 grid-cols-1">
                      {types.map((component, index) => (
                        <Link
                          href={`/properties?typeId=${component.id}`}
                          key={index}
                          className="p-2 hover:bg-green-700 hover:bg-opacity-20 flex space-x-2 items-center rounded"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          <span className="text-sm">{component.title}</span>
                        </Link>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Input
            className="w-4/12 h-full outline-none active:outline-none rounded-none text-sm"
            placeholder="Search property ..."
            defaultValue={search}
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <Link
            className="bg-green-700 flex items-center w-1/12 h-full text-background justify-center"
            href={`/properties?search=${search}`}
          >
            <Search />
          </Link>
          <div className="bg-primary w-2/12 h-full flex text-background items-center p-3 space-x-2">
            <User2 className="w-8 h-8" />
            <Link
              className="flex flex-col text-sm"
              href={user ? "/dashboard/profile" : "/sign-in"}
            >
              <span>My Account</span>
              <span>{user ? user.name ?? user.email : "Hello, sign in"}</span>
            </Link>
          </div>
          <div className="w-1/12 bg-green-700 h-full" />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

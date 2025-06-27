"use client";

import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
    img?: string;
  }
>(({ className, title, children, href, img, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "group hover:bg-light block rounded-lg p-4 text-center transition-all",
            className,
          )}
          {...props}
        >
          {img && (
            <div className="relative mb-3 h-32 w-full overflow-hidden rounded">
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <h4 className="text-primary mb-1 text-sm font-semibold">{title}</h4>
          <p className="text-secondary text-xs">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default ListItem;

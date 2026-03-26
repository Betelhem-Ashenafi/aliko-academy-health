"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className, activeClassName, end, ...props }, ref) => {
    const pathname = usePathname() || "";
    const isActive = end 
      ? pathname === href 
      : pathname.startsWith(href);

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };

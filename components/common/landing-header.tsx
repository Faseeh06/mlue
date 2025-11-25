"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface LandingHeaderProps {
  backHref?: string;
}

export function LandingHeader({ backHref }: LandingHeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");
  const rightLinkLabel = isDashboard ? "ADD FINANCES" : "DASHBOARD";

  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center space-x-3">
        {backHref ? (
          <Link href={backHref} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="sr-only">Back</span>
            <div className="flex space-x-2">
              <div className="h-2 w-2 rounded-full bg-black"></div>
              <div className="h-2 w-2 rounded-full bg-black"></div>
            </div>
          </Link>
        ) : (
          <div className="flex space-x-2">
            <div className="h-2 w-2 rounded-full bg-black"></div>
            <div className="h-2 w-2 rounded-full bg-black"></div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="text-sm hover:underline font-medium">
          {rightLinkLabel}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex flex-col space-y-1" aria-label="Open menu">
              <span className="h-0.5 w-6 bg-black"></span>
              <span className="h-0.5 w-6 bg-black"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>EN</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">Contact Us</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default LandingHeader;








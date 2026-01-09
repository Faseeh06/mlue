"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LandingHeaderProps {
  backHref?: string;
}

export function LandingHeader({ backHref }: LandingHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-6 bg-transparent sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        {backHref ? (
          <Link href={backHref} className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <span className="sr-only">Back</span>
            <div className="flex space-x-1">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/60"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/60"></div>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/mlue.png" 
              alt="Mlue" 
              width={120} 
              height={120}
              className="h-16 w-auto"
            />
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6">
        {pathname !== "/dashboard" && !pathname?.startsWith("/dashboard/") && (
          <>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors hidden sm:inline-block uppercase tracking-wider px-5 py-2.5 rounded-full border border-foreground/30 bg-transparent"
            >
              DASHBOARD
            </Link>
            <Link href="/dashboard" className="sm:hidden">
              <Button size="sm" variant="outline" className="rounded-full border border-foreground/30 bg-transparent text-foreground hover:bg-transparent text-sm px-5 py-2.5">
                DASHBOARD
              </Button>
            </Link>
          </>
        )}
        {pathname !== "/" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex flex-col space-y-1.5 p-2 hover:bg-transparent rounded-full border border-foreground/30 bg-transparent transition-colors" 
              aria-label="Open menu"
            >
              <span className="h-0.5 w-5 bg-foreground"></span>
              <span className="h-0.5 w-5 bg-foreground"></span>
              <span className="h-0.5 w-5 bg-foreground"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border-border">
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="w-full">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>EN</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default LandingHeader;




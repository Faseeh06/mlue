"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface LandingHeaderProps {
  backHref?: string;
}

export function LandingHeader({ backHref }: LandingHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-6 bg-transparent sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <Link href={backHref || "/"} className="flex items-center">
          <Image 
            src="/images/mlue.png" 
            alt="Mlue" 
            width={120} 
            height={120}
            className="h-16 w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4 sm:space-x-6">
        {pathname !== "/dashboard" && !pathname?.startsWith("/dashboard/") && (
          <>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors hidden sm:inline-block px-8 py-3 rounded-full border border-foreground/30 bg-transparent"
            >
              Dashboard
            </Link>
            <Link href="/dashboard" className="sm:hidden">
              <Button size="lg" variant="outline" className="rounded-full border border-foreground/30 bg-transparent text-foreground hover:bg-transparent h-12 px-8">
                Dashboard
              </Button>
            </Link>
          </>
        )}
        {pathname !== "/" && (
          <Link 
            href="/settings"
            className="p-2 hover:bg-secondary/50 rounded-full bg-transparent transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </Link>
        )}
      </div>
    </header>
  );
}

export default LandingHeader;




import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="flex items-center justify-between p-6">
        <div className="flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-black"></div>
          <div className="h-2 w-2 rounded-full bg-black"></div>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm hover:underline font-medium">
            DASHBOARD
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

      <main className="relative px-6 pt-12">
        {/* Gradient blob */}
        <div
          className="absolute right-0 top-0 h-[300px] w-[300px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 opacity-70 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <h1 className="max-w-3xl text-6xl font-light leading-tight tracking-tight">
            WE CREATE
            <br />
            BEST DIGITAL
            <br />
            PRODUCTS.
          </h1>

          <div className="mt-24 flex justify-between">
            <div className="max-w-md">
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full border-2 px-8 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 transition-all duration-300">
                  <span className="relative">EXPLORE FINANCE APP</span>
                </Button>
              </Link>
              <p className="mt-8 text-sm leading-relaxed text-gray-600">
                AI-POWERED FINANCE MANAGEMENT
                <br />
                JUST TALK TO YOUR MONEY ASSISTANT.
              </p>
            </div>

            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <span className="text-sm">WHO WE ARE</span>
                <span className="h-px w-12 bg-black"></span>
              </div>
            </div>
          </div>

          <p className="mt-24 max-w-xl text-sm leading-relaxed text-gray-600">
            We create quality content and cool ideas. We create websites, applications, 3D design, motion design and
            animation. Now featuring an AI-powered finance assistant that understands natural language to automatically track your income and expenses.
          </p>
        </div>
      </main>
    </div>
  )
}

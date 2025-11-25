"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f6f3] font-sans relative overflow-hidden">
      {/* Gradient Blobs */}
      <div className="absolute right-0 top-20 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 opacity-40 blur-3xl -z-10" />
      <div className="absolute left-0 bottom-20 h-[350px] w-[350px] animate-pulse rounded-full bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 opacity-30 blur-3xl -z-10" />

      {/* Grid Lines - 2 horizontal, 2 vertical close together */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(61, 40, 23, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(61, 40, 23, 0.08) 1px, transparent 1px),
          linear-gradient(0deg, rgba(61, 40, 23, 0.08) 1px, transparent 1px),
          linear-gradient(0deg, rgba(61, 40, 23, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: '30% 0, 32% 0, 0 28%, 0 30%'
      }} />

      {/* Header */}
      <header className="relative border-b border-dotted border-gray-400/40">
        <div className="grid grid-cols-4 gap-0">
          <div className="p-8 border-r border-dotted border-gray-400/40">
            <Link href="/" className="text-2xl font-normal tracking-wide text-[#3d2817] hover:opacity-70 transition-opacity">
              LEDGER AI
            </Link>
          </div>
           <div className="p-8 col-span-3 flex items-center justify-end border-r border-dotted border-gray-400/40">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0 text-white">
                DASHBOARD
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative grid grid-cols-4 grid-rows-2 min-h-[calc(100vh-120px)]">

        {/* Top Left - Tagline */}
        <div className="p-12 border-r border-b border-dotted border-gray-400/40 flex flex-col items-start justify-center">
          <div className="text-sm text-[#3d2817] font-light tracking-wide">
            <div>SMART TRANSACTION</div>
            <div>INTERPRETER</div>
          </div>
        </div>

        {/* Top Right - Empty space */}
        <div className="p-12 col-span-3 border-b border-dotted border-gray-400/40">
        </div>

        {/* Bottom Left - Empty space */}
        <div className="p-12 border-r border-dotted border-gray-400/40 flex items-center">
        </div>

        {/* Bottom Right - Description */}
        <div className="p-12 col-span-3 flex items-center">
          <p className="text-xl md:text-2xl text-[#3d2817] leading-relaxed max-w-4xl">
            Transform plain-language transaction descriptions into structured ledger entries instantly. Our AI interprets your business transactions and shows exactly how they affect your accounts—<span className="text-[#e59866] font-semibold">no accounting knowledge required.</span>
          </p>
        </div>
      </main>
    </div>
  )
}

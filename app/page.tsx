"use client";

import Link from "next/link"
import Orb from "@/components/common/orb"

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
              MLUE
            </Link>
          </div>
          <div className="p-8 col-span-3 flex items-center justify-between border-r border-dotted border-gray-400/40">
            <nav className="flex items-center gap-12 text-sm text-[#3d2817]">
              <Link href="#features" className="hover:opacity-70 transition-opacity">ABILITIES</Link>
              <Link href="/dashboard" className="hover:opacity-70 transition-opacity">DASHBOARD</Link>
            </nav>
            <div className="flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm text-[#3d2817] hover:opacity-70 transition-opacity">HOW IT WORKS</Link>
              <Link href="/settings" className="text-sm text-[#3d2817] hover:opacity-70 transition-opacity">STAY CONNECTED</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative grid grid-cols-4 grid-rows-2 min-h-[calc(100vh-120px)]">

        {/* Top Left - Tagline + Logo */}
        <div className="p-12 border-r border-b border-dotted border-gray-400/40 flex flex-col items-start justify-start">
          <div className="text-sm text-[#3d2817] font-light tracking-wide mb-16">
            <div>INTELLIGENT</div>
            <div>FINANCE MANAGEMENT</div>
          </div>

          {/* Interactive Orb */}
          <div className="w-32 h-32 relative border border-orange-200/20 rounded-full bg-white">
            <Orb
              hue={30}
              hoverIntensity={0.3}
              rotateOnHover={true}
              forceHoverState={false}
            />
          </div>
        </div>

        {/* Top Right - Empty space */}
        <div className="p-12 col-span-3 border-b border-dotted border-gray-400/40">
        </div>

        {/* Bottom Left - Main Headline */}
        <div className="p-12 border-r border-dotted border-gray-400/40 flex items-center">
          <h1 className="text-6xl md:text-7xl font-light text-[#3d2817] leading-tight">
            Meet Mlue
          </h1>
        </div>

        {/* Bottom Right - Description */}
        <div className="p-12 col-span-3 flex items-center">
          <p className="text-xl md:text-2xl text-[#3d2817] leading-relaxed max-w-4xl">
            Mlue redefines personal finance management, empowering you to track spending, protect your budget, and make smarter decisions—unlocking your <span className="text-[#e59866] font-semibold">financial potential.</span>
          </p>
        </div>
      </main>
    </div>
  )
}

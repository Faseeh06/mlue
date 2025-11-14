import Link from "next/link"
import { Button } from "@/components/ui/button"
import LandingHeader from "@/components/common/landing-header"

export default function Page() {
  return (
    <div className="h-screen bg-[#FAF9F6] relative overflow-hidden">
      {/* 4 solid lines forming a square pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical line (middle) */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" 
          style={{ backgroundColor: 'rgba(45, 40, 23, 0.15)' }}
        />
        {/* Horizontal line (middle) */}
        <div 
          className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" 
          style={{ backgroundColor: 'rgba(45, 40, 23, 0.15)' }}
        />
        {/* Vertical line (left side - forms square) */}
        <div 
          className="absolute top-0 bottom-0 w-px" 
          style={{ 
            backgroundColor: 'rgba(45, 40, 23, 0.15)',
            left: 'calc(50% - 25vh)'
          }}
        />
        {/* Horizontal line (top side - forms square) */}
        <div 
          className="absolute top-1/4 left-0 right-0 h-px -translate-y-1/2" 
          style={{ backgroundColor: 'rgba(45, 40, 23, 0.15)' }}
        />
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <LandingHeader />
      </div>

      {/* Main content with grid layout */}
      <main className="relative z-10 h-[calc(100vh-80px)] grid grid-cols-2 grid-rows-2 px-6 gap-0">
        {/* Top-left quadrant */}
        <div className="flex flex-col justify-start pt-2">
          {/* Empty space */}
        </div>

        {/* Top-right quadrant */}
        <div className="flex flex-col items-end justify-end">
          {/* Empty space */}
        </div>

        {/* Bottom-left quadrant */}
        <div className="flex flex-col justify-end pb-4">
          <h1 className="max-w-3xl text-6xl font-light leading-tight tracking-tight mb-4" style={{ color: '#2C1810' }}>
            WE CREATE
            <br />
            BEST DIGITAL
            <br />
            PRODUCTS.
          </h1>
          <div className="max-w-md">
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-md border-2 px-6 py-2 mb-4 hover:bg-gray-50 transition-all duration-300 text-xs" style={{ borderColor: '#2C1810', color: '#2C1810' }}>
                EXPLORE FINANCE APP
              </Button>
            </Link>
            <p className="text-xs leading-relaxed uppercase" style={{ color: '#2C1810' }}>
              AI-POWERED FINANCE MANAGEMENT
              <br />
              JUST TALK TO YOUR MONEY ASSISTANT.
            </p>
          </div>
        </div>

        {/* Bottom-right quadrant */}
        <div className="flex flex-col items-end justify-end pb-4">
          <div className="text-right max-w-md">
            <div className="flex items-center justify-end space-x-2 mb-2">
              <span className="text-xs" style={{ color: '#2C1810' }}>WHO WE ARE</span>
              <span className="h-px w-8" style={{ backgroundColor: '#2C1810' }}></span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#2C1810' }}>
              We create quality content and cool ideas. We create websites, applications, 3D design, motion design and
              animation. Now featuring an AI-powered finance assistant that understands natural language to automatically track your income and expenses.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

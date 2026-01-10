"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import LandingHeader from "@/components/common/landing-header"
import { Smartphone, Download, Phone } from "lucide-react"

export default function DownloadPage() {
  const { irisRgb, lilacRgb } = useTheme();
  return (
    <main className="min-h-screen bg-background">
      {/* Download Section with integrated header */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Header - integrated and transparent */}
        <div className="relative z-20">
          <LandingHeader backHref="/" />
        </div>

        {/* Download Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
          {/* Gradient blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none">
            <div 
              className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-40"
              style={{
                background: `linear-gradient(to bottom, rgba(${lilacRgb}, 0.35), rgba(${irisRgb}, 0.25), rgba(217, 249, 157, 0.2))`
              }}
            />
          </div>
          {/* Additional gradient */}
          <div className="absolute bottom-0 right-0 w-[700px] h-[500px] pointer-events-none">
            <div 
              className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
              style={{
                background: `linear-gradient(to top right, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.2), rgba(217, 249, 157, 0.15))`
              }}
            />
          </div>

          <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="mb-8">
            <Smartphone className="h-16 w-16 mx-auto mb-6 text-iris" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6">
              Download Mlue
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the app on your device and take control of your finances on the go.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
            {/* iOS Download */}
            <div className="bg-secondary rounded-xl p-8 border border-border hover:scale-[0.98] transition-transform cursor-pointer" data-clickable>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
                  <Smartphone className="h-8 w-8 text-background" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">Download for iOS</h3>
                <p className="text-muted-foreground text-sm mb-6 text-center">
                  Available on the App Store
                </p>
                <Button 
                  size="lg" 
                  variant="default" 
                  className="w-full h-12 rounded-full"
                  onClick={() => {
                    // Replace with actual App Store URL
                    window.open('https://apps.apple.com', '_blank')
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download for iOS
                </Button>
              </div>
            </div>

            {/* Android Download */}
            <div className="bg-secondary rounded-xl p-8 border border-border hover:scale-[0.98] transition-transform cursor-pointer" data-clickable>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
                  <Phone className="h-8 w-8 text-background" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">Download for Android</h3>
                <p className="text-muted-foreground text-sm mb-6 text-center">
                  Available on Google Play
                </p>
                <Button 
                  size="lg" 
                  variant="default" 
                  className="w-full h-12 rounded-full"
                  onClick={() => {
                    // Replace with actual Google Play URL
                    window.open('https://play.google.com', '_blank')
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download for Android
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}


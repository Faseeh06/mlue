"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LandingHeader from "@/components/common/landing-header"
import { TrendingUp, Shield, Zap, BarChart3, ArrowRight, CheckCircle2, DollarSign, Smartphone } from "lucide-react"
import { getCurrentTheme, getThemeColors } from "@/lib/theme"

export default function Page() {
  const [theme, setTheme] = useState(getCurrentTheme());
  
  useEffect(() => {
    // Listen for theme changes
    const updateTheme = () => {
      setTheme(getCurrentTheme());
    };
    
    const interval = setInterval(updateTheme, 500);
    const handleStorageChange = () => {
      updateTheme();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const themeColors = getThemeColors(theme);
  const irisRgb = themeColors.irisRgb;
  const lilacRgb = themeColors.lilacRgb;
  
  return (
    <main className="bg-background">
      {/* Hero Section with integrated header */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
        {/* Navigation - integrated into hero */}
        <div className="relative z-20">
          <LandingHeader />
        </div>
        
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
          {/* Gradient blob - extends into next section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-full max-h-[900px] aspect-square pointer-events-none" style={{ bottom: '-200px' }}>
            <div 
              className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-40"
              style={{
                background: `linear-gradient(to bottom, rgba(${lilacRgb}, 0.35), rgba(${irisRgb}, 0.25), rgba(217, 249, 157, 0.2))`
              }}
            />
          </div>
          
          <div className="relative max-w-6xl mx-auto text-center z-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-tight mb-8">
              Manage your <span className="text-iris" style={{ textShadow: `0 0 8px rgba(${irisRgb}, 0.4)` }}>money</span>,
              <br />
              <em className="italic">effortlessly.</em>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border border-foreground/30 bg-transparent text-foreground hover:bg-transparent">
                  Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/download">
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-0 bg-iris text-white hover:bg-iris/90">
                  Download Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2 animate-bounce">
              <div className="w-1 h-2 rounded-full bg-foreground/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-background px-6 py-32 overflow-hidden">
        {/* Gradient blob - connects from hero and flows down */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-100px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        {/* Additional gradient for flow */}
        <div className="absolute bottom-0 right-0 w-full max-w-[700px] h-[350px] sm:h-[500px] aspect-[7/5] pointer-events-none" style={{ bottom: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
            style={{
              background: `linear-gradient(to top right, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.2), rgba(217, 249, 157, 0.15))`
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-center text-iris">
            Stop tracking receipts.
            <br />
            Start controlling your finances.
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-background px-6 py-24 overflow-hidden">
        {/* Gradient blob - connects from manifesto */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.25), rgba(217, 249, 157, 0.2))`
            }}
          />
        </div>
        {/* Gradient blob - flows to next section */}
        <div className="absolute bottom-0 right-0 w-full max-w-[700px] h-[350px] sm:h-[500px] aspect-[7/5] pointer-events-none" style={{ bottom: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
            style={{
              background: `linear-gradient(to top right, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto z-10">
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-8 text-center">
            Features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Assistant Card */}
            <div className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col hover:scale-[0.98] transition-transform cursor-pointer" data-clickable>
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-xl text-foreground">AI-Powered Assistant</h3>
                <p className="text-muted-foreground text-sm mt-1">Just talk to your money assistant. Natural language processing makes expense tracking effortless.</p>
              </div>
            </div>

            {/* Smart Budgeting Card */}
            <div className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col hover:scale-[0.98] transition-transform cursor-pointer" data-clickable>
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-xl text-foreground">Smart Budgeting</h3>
                <p className="text-muted-foreground text-sm mt-1">Set budgets, track spending, and get real-time insights. Never overspend again.</p>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col hover:scale-[0.98] transition-transform cursor-pointer" data-clickable>
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-xl text-foreground">Bank-Level Security</h3>
                <p className="text-muted-foreground text-sm mt-1">Your financial data is encrypted and secure. We protect your information with industry-leading measures.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Showcase Section */}
      <section className="relative bg-secondary px-6 py-24 overflow-hidden">
        {/* Gradient blob - connects from features */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        {/* Gradient blob - flows to next section */}
        <div className="absolute bottom-0 right-0 w-full max-w-[700px] h-[350px] sm:h-[500px] aspect-[7/5] pointer-events-none" style={{ bottom: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
            style={{
              background: `linear-gradient(to top right, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.2), rgba(217, 249, 157, 0.2))`
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif text-foreground mb-4">100%</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Accurate Tracking</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif text-foreground mb-4">24%</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Average Savings Increase</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-serif text-foreground mb-4">1M+</div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Transactions Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="relative bg-background px-6 py-24 overflow-hidden">
        {/* Gradient blob - connects from stats */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2), rgba(217, 249, 157, 0.2))`
            }}
          />
        </div>
        {/* Gradient blob - flows to CTA */}
        <div className="absolute bottom-0 right-0 w-full max-w-[700px] h-[350px] sm:h-[500px] aspect-[7/5] pointer-events-none" style={{ bottom: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
            style={{
              background: `linear-gradient(to top right, rgba(217, 249, 157, 0.15), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-3">
              <DollarSign className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-serif text-lg text-foreground">Expense Tracking</h4>
              <p className="text-muted-foreground text-sm mt-1">Automatically categorize and track every transaction.</p>
            </div>
            <div className="flex flex-col gap-3">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-serif text-lg text-foreground">Visual Analytics</h4>
              <p className="text-muted-foreground text-sm mt-1">Beautiful charts help you understand spending patterns.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Smartphone className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-serif text-lg text-foreground">Mobile First</h4>
              <p className="text-muted-foreground text-sm mt-1">Access your finances anywhere, anytime.</p>
            </div>
            <div className="flex flex-col gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
              <h4 className="font-serif text-lg text-foreground">Real-Time Sync</h4>
              <p className="text-muted-foreground text-sm mt-1">All your devices stay in perfect sync.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background px-6 py-24 relative overflow-hidden">
        {/* Gradient blob - connects from previous section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        {/* Gradient blob - flows to footer */}
        <div className="absolute bottom-0 right-0 w-full max-w-[700px] h-[350px] sm:h-[500px] aspect-[7/5] pointer-events-none" style={{ bottom: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-30"
            style={{
              background: `linear-gradient(to top right, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.3), rgba(217, 249, 157, 0.2))`
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
            Ready to transform your finances?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users taking control of their financial future with Mlue.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="default" className="h-12 px-8">
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-muted-foreground text-sm mt-6">No credit card required • Set up in minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-background px-6 py-24 border-t border-border overflow-hidden">
        {/* Gradient blob - connects from CTA */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[600px] aspect-[4/3] pointer-events-none" style={{ top: '-150px' }}>
          <div 
            className="absolute inset-0 bg-gradient-to-b blur-3xl rounded-full opacity-35"
            style={{
              background: `linear-gradient(to bottom, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`
            }}
          />
        </div>
        {/* Final gradient blob */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] sm:h-[500px] aspect-[8/5] pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-tr blur-3xl rounded-full opacity-40"
            style={{
              background: `linear-gradient(to top right, rgba(${lilacRgb}, 0.3), rgba(${irisRgb}, 0.25), rgba(217, 249, 157, 0.3))`
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
            <div>
              <h2 className="text-6xl md:text-8xl font-serif text-foreground mb-8">
                MLUE.
              </h2>
              <nav className="flex flex-wrap gap-6">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </nav>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-4">Get updates on new features and improvements.</p>
              <p className="text-foreground text-sm">© {new Date().getFullYear()} Mlue. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
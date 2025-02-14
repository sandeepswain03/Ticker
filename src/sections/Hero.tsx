"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const Hero = () => {
  return (
    <section className="h-[85vh] bg-gradient-to-b from-[#E8EFFF] via-[#7B96FF] to-[#3461FF] overflow-hidden">
      <div className="container h-full flex items-start justify-center">
        <div className="flex flex-col items-center max-w-3xl mx-auto pt-10">
          <button className="group relative grid overflow-hidden rounded-full px-2 py-1 shadow-[0_1000px_0_0_hsl(0_0%_100%/0.1)_inset] transition-colors duration-200">
            <span className="z-10 p-1 text-sm text-[#1A1A1A] bg-[#3461FF]/20 rounded-full flex items-center ">
              <span className="px-2 py-[0.5px] h-[18px] tracking-wide flex items-center justify-center rounded-full bg-[#3461FF] text-[9px] font-medium mr-2 text-white">
                NEW
              </span>
              Explore the 2024 recap
            </span>
          </button>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1A1A1A] mt-6 text-center">
            Investing Ka
            <br />
            Search Engine
          </h1>

          <p className="text-xl text-[#1A1A1A]/80 tracking-tight mt-6 text-center max-w-2xl">
            The mordern Stock Screener that helps you find the best stocks for your investment portfolio.
          </p>

          <div className="w-full max-w-2xl mt-10">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search stocks..."
                className="w-full h-14 pl-12 pr-4 rounded-full bg-white/95 shadow-lg text-lg border-0 focus-visible:ring-2 focus-visible:ring-white/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    window.location.href = `/${value}`;
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3461FF] h-6 w-6" />
            </div>

            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              <strong className="text-lg text-[#1A1A1A] tracking-tight ">
                What&apos;s Trending :
              </strong>
              {["ITC", "RELIANCE", "HDFCBANK", "YESBANK", "IRCTC"].map((item) => (
                <button
                  onClick={() => window.location.href = `/${item}`}
                  key={item}
                  className="px-4 py-1.5 rounded-full bg-white/20 text-sm text-white hover:bg-white/30 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


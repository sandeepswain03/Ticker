"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/stock`);
      const { data } = await response.json();

      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = data.filter((stock: any) =>
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Use the useDebounce hook to debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelection = (symbol: string) => {
    setSearchTerm(symbol);
    setShowSuggestions(false);
    window.location.href = `/${symbol}`;
  };

  return (
    <section className="h-[85vh] bg-gradient-to-b from-[#E8EFFF] via-[#7B96FF] to-[#3461FF] overflow-hidden">
      <div className="container h-full flex items-start justify-center">
        <div className="flex flex-col items-center max-w-3xl mx-auto pt-10">
          <button className="group relative grid overflow-hidden rounded-full px-2 py-1 shadow-[0_1000px_0_0_hsl(0_0%_100%/0.1)_inset] transition-colors duration-200">
            <span className="z-10 p-1 text-sm text-[#1A1A1A] bg-[#3461FF]/20 rounded-full flex items-center">
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
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Type a company name or stock symbol"
                className="w-full h-14 pl-12 pr-4 rounded-full bg-white/95 shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-white/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm) {
                    handleSelection(searchTerm);
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3461FF] h-6 w-6" />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {suggestions.map((stock) => (
                    <div
                      key={stock.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelection(stock.symbol)}
                    >
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-gray-600">{stock.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              <strong className="text-lg text-[#1A1A1A] tracking-tight">
                What&apos;s Trending :
              </strong>
              {["ITC", "RELIANCE", "HDFCBANK", "YESBANK", "IRCTC"].map((item) => (
                <button
                  onClick={() => handleSelection(item)}
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
  );
};

export default Hero;
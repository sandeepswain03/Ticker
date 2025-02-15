"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface Stock {
  id: string;
  symbol: string;
  name: string;
}

export const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/stock`);
      const { data } = await response.json();

      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = data.filter((stock: Stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const trendingStocks = [
    { symbol: "ITC", name: "ITC Limited" },
    { symbol: "RELIANCE", name: "Reliance Industries" },
    { symbol: "YESBANK", name: "Yes Bank" },
    { symbol: "IRCTC", name: "Indian Railway Catering" }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-gradient-to-br from-[#E8EFFF] via-[#7B96FF] to-[#3461FF] overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50" />

      <div className="container h-full flex items-start justify-center relative">
        <div className="flex flex-col items-center max-w-4xl mx-auto pt-16 md:pt-20">
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative grid overflow-hidden rounded-full px-3 py-1.5 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <span className="z-10 text-sm text-[#1A1A1A] flex items-center font-medium">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                className="px-2.5 py-1 h-[20px] tracking-wide flex items-center justify-center rounded-full bg-[#3461FF] text-[10px] font-semibold mr-2 text-white"
              >
                NEW
              </motion.span>
              Explore the 2024 Market Recap
            </span>
          </motion.button>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-[#1A1A1A] mt-8 text-center leading-tight"
          >
            Investing Ka
            <br />
            <span className="bg-gradient-to-r from-[#3461FF] to-[#8B9FFF] text-transparent bg-clip-text">
              Search Engine
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-[#1A1A1A]/90 tracking-tight mt-8 text-center max-w-2xl font-medium"
          >
            The modern Stock Screener that helps you find the best stocks for your investment portfolio.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-2xl mt-12"
          >
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search company name or stock symbol..."
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/95 shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-[#3461FF] transition-all duration-300 hover:shadow-2xl text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm) {
                    handleSelection(searchTerm);
                  }
                }}
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#3461FF] h-6 w-6" />

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-3 bg-white rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50 border border-gray-100"
                  >
                    {suggestions.map((stock, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={stock.id}
                        className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b last:border-b-0"
                        onClick={() => handleSelection(stock.symbol)}
                      >
                        <div className="font-semibold text-[#1A1A1A] text-lg">{stock.symbol}</div>
                        <div className="text-base text-gray-600 mt-1">{stock.name}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mt-8 justify-center flex-wrap items-center"
            >
              <strong className="text-lg text-[#1A1A1A] tracking-tight font-semibold">
                Trending Stocks:
              </strong>
              {trendingStocks.map((stock, index) => (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelection(stock.symbol)}
                  key={stock.symbol}
                  className="px-5 py-2.5 rounded-full bg-white/90 text-sm font-medium text-[#3461FF] hover:bg-white hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                >
                  {stock.symbol}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

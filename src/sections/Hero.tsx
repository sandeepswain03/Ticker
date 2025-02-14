"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/stock`);
      const { data } = await response.json();

      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      const filteredSuggestions = data.filter((stock) =>
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
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

  const handleSelection = (symbol) => {
    setSearchTerm(symbol);
    setShowSuggestions(false);
    window.location.href = `/${symbol}`;
  };

  const trendingStocks = [
    { symbol: "ITC", name: "ITC Limited" },
    { symbol: "RELIANCE", name: "Reliance Industries" },
    { symbol: "HDFCBANK", name: "HDFC Bank" },
    { symbol: "YESBANK", name: "Yes Bank" },
    { symbol: "IRCTC", name: "Indian Railway Catering" }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[85vh] bg-gradient-to-b from-[#E8EFFF] via-[#7B96FF] to-[#3461FF] overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container h-full flex items-start justify-center relative">
        <div className="flex flex-col items-center max-w-3xl mx-auto pt-10">
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative grid overflow-hidden rounded-full px-2 py-1 shadow-[0_1000px_0_0_hsl(0_0%_100%/0.1)_inset] transition-colors duration-200"
          >
            <span className="z-10 p-1 text-sm text-[#1A1A1A] bg-[#3461FF]/20 rounded-full flex items-center">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                className="px-2 py-[0.5px] h-[18px] tracking-wide flex items-center justify-center rounded-full bg-[#3461FF] text-[9px] font-medium mr-2 text-white"
              >
                NEW
              </motion.span>
              Explore the 2024 recap
            </span>
          </motion.button>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1A1A1A] mt-6 text-center"
          >
            Investing Ka
            <br />
            Search Engine
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-[#1A1A1A]/80 tracking-tight mt-6 text-center max-w-2xl"
          >
            The modern Stock Screener that helps you find the best stocks for your investment portfolio.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-2xl mt-10"
          >
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Type a company name or stock symbol"
                className="w-full h-14 pl-12 pr-4 rounded-full bg-white/95 shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-white/50 transition-all duration-200 hover:shadow-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm) {
                    handleSelection(searchTerm);
                  }
                }}
              />
              {isLoading ? (
                <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3461FF] h-6 w-6 animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3461FF] h-6 w-6" />
              )}

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {suggestions.map((stock, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={stock.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b last:border-b-0"
                        onClick={() => handleSelection(stock.symbol)}
                      >
                        <div className="font-medium text-[#1A1A1A]">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
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
              className="flex gap-3 mt-6 justify-center flex-wrap items-center"
            >
              <strong className="text-lg text-[#1A1A1A] tracking-tight">
                What&apos;s Trending:
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
                  className="px-4 py-2 rounded-full bg-white/20 text-sm text-white hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
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

export default Hero;
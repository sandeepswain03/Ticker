"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Newspaper, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
    title: string;
    description: string;
    date: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    link: string;
}

interface NewsData {
    articles: NewsItem[];
}

const MarketDashboard = () => {
    const router = useRouter();
    const [symbol, setSymbol] = useState('NIFTY');
    const [newsData, setNewsData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockPrices, setStockPrices] = useState<Record<string, number>>({});

    const stocksList = [
        "ABB", "ADANIENSOL", "ADANIENT", "ADANIGREEN", "ADANIPORTS", "ADANIPOWER", "ATGL",
        "AMBUJACEM", "APOLLOHOSP", "ASIANPAINT", "DMART", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE",
        "BAJAJFINSV", "BAJAJHLDNG", "BANKBARODA", "BEL", "BHEL", "BPCL", "BHARTIARTL", "BOSCHLTD",
        "BRITANNIA", "CANBK", "CHOLAFIN", "CIPLA", "COALINDIA", "DLF", "DABUR", "DIVISLAB",
        "DRREDDY", "EICHERMOT", "GAIL", "GODREJCP", "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE",
        "HAVELLS", "HEROMOTOCO", "HINDALCO", "HAL", "HINDUNILVR", "ICICIBANK", "ICICIGI",
        "ICICIPRULI", "ITC", "IOC", "IRCTC", "IRFC", "INDUSINDBK", "NAUKRI", "INFY", "INDIGO",
        "JSWENERGY", "JSWSTEEL", "JINDALSTEL", "JIOFIN", "KOTAKBANK", "LTIM", "LT", "LICI",
        "LODHA", "M&M", "MARUTI", "NHPC", "NTPC", "NESTLEIND", "ONGC", "PIDILITIND", "PFC",
        "POWERGRID", "PNB", "RECLTD", "RELIANCE", "SBILIFE", "MOTHERSON", "SHREECEM", "SHRIRAMFIN",
        "SIEMENS", "SBIN", "SUNPHARMA", "TVSMOTOR", "TCS", "TATACONSUM", "TATAMOTORS",
        "TATAPOWER", "TATASTEEL", "TECHM", "TITAN", "TORNTPHARM", "TRENT", "ULTRACEMCO",
        "UNIONBANK", "UNITEDSPR", "VBL", "VEDL", "WIPRO", "ZOMATO", "ZYDUSLIFE"
    ];

    const filteredStocks = stocksList.filter(stock =>
        stock.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get<{ data: NewsData }>(`http://localhost:8000/api/stock/stock-news/${symbol}`);
                setNewsData(response.data.data);

                const prices: Record<string, number> = {};
                stocksList.forEach(stock => {
                    prices[stock] = Math.random() * 1000 + 100;
                });
                setStockPrices(prices);
            } catch (err) {
                const error = err as Error;
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();

        const interval = setInterval(() => {
            setStockPrices(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(stock => {
                    const change = (Math.random() - 0.5) * 10;
                    updated[stock] = updated[stock] + change;
                });
                return updated;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [symbol]);

    return (
        <div className="min-h-screen bg-white p-8">
            {/* Market Overview Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-gray-800 mb-6 flex items-center">
                    Market Dashboard
                    <TrendingUp className="inline-block ml-3 text-gray-600" />
                </h1>
                <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search stocks..."
                        className="pl-10 w-full bg-white text-gray-800 border border-gray-300 h-12 text-lg shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Live Market Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {filteredStocks.map((stock) => (
                    <Card
                        key={stock}
                        className="cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => router.push(`/${stock}`)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-gray-800 font-semibold">{stock}</h3>
                                {Math.random() > 0.5 ? (
                                    <ArrowUpRight className="text-green-600" />
                                ) : (
                                    <ArrowDownRight className="text-red-600" />
                                )}
                            </div>
                            <p className="text-xl font-semibold text-gray-800">
                                ₹{stockPrices[stock]?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Vol: {Math.floor(Math.random() * 1000000)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Market News Section */}
            <div className="mt-8">
                <h2 className="text-3xl font-serif text-gray-800 mb-6 flex items-center">
                    Market News <Newspaper className="ml-3 text-gray-600" />
                </h2>
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200">{error}</div>
                ) : newsData?.articles ? (
                    <div className="space-y-4">
                        {newsData.articles.map((news, index) => (
                            <Card key={index} className="bg-white border border-gray-200 shadow-sm">
                                <CardContent className="p-6">
                                    <Link href={news.link} target='_blank' className="text-xl font-semibold text-gray-800 mb-3">
                                        {news.title}
                                    </Link>
                                    <p className="text-gray-600 mb-4">{news.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {new Date(news.date).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className={`px-3 py-1 rounded text-sm ${
                                            news.sentiment === 'positive' ? 'bg-green-50 text-green-600 border border-green-200' :
                                            news.sentiment === 'negative' ? 'bg-red-50 text-red-600 border border-red-200' :
                                            'bg-gray-50 text-gray-600 border border-gray-200'
                                        }`}>
                                            {news.sentiment}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default MarketDashboard;
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface News {
    date: string;
    title: string;
    snippet: string;
    sentiment: "Positive" | "Negative";
    link: string;
}

interface NewsData {
    articles: News[];
    sentimentPercentage: {
        positive: number;
        negative: number;
    };
}

const NewsCard = ({ news }: { news: News }) => {
    const date = new Date(news.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-none overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full truncate">{date}</span>
                            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                                {news.sentiment === "Positive" ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                                )}
                                <span className={`text-sm font-medium ${news.sentiment === "Positive" ? "text-green-500" : "text-red-500"}`}>
                                    {news.sentiment}
                                </span>
                            </div>
                        </div>
                        <Link href={news.link} target='_blank' className="font-bold text-xl mb-4 text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors overflow-hidden">{news.title}</Link>
                        <p className="text-base text-gray-600 line-clamp-3 overflow-hidden">{news.snippet.replace(/Stock Market News|Mint|More/g, '')}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const NewsSection = ({ newsData }: { newsData: NewsData }) => {
    if (!newsData?.articles || !Array.isArray(newsData.articles)) {
        return null;
    }

    const { articles, sentimentPercentage } = newsData;

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl text-center font-bold text-gray-800">Market Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around mb-4 gap-4">
                        <div className="text-center w-full bg-white/90 px-12 py-6 rounded-2xl shadow-lg">
                            <p className="text-lg font-medium text-gray-600 mb-3">Bullish Sentiment</p>
                            <p className="text-4xl font-bold text-green-500">{sentimentPercentage.positive.toFixed(2)}%</p>
                        </div>
                        <div className="text-center w-full bg-white/90 px-12 py-6 rounded-2xl shadow-lg">
                            <p className="text-lg font-medium text-gray-600 mb-3">Bearish Sentiment</p>
                            <p className="text-4xl font-bold text-red-500">{sentimentPercentage.negative.toFixed(2)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((news: News, index: number) => (
                    <NewsCard key={index} news={news} />
                ))}
            </div>
        </div>
    );
};

const StockNewsApp = () => {
    const [symbol, setSymbol] = useState('');
    const [newsData, setNewsData] = useState<NewsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!symbol.trim()) return;

        setLoading(true);
        setIsSearched(true);

        try {
            const response = await fetch(`http://localhost:8000/api/stock/stock-news/${symbol}`);
            const data = await response.json();
            setNewsData(data.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E8EFFF] via-[#7B96FF] to-[#3461FF]">
            <div className={`min-h-screen transition-all duration-300 ${isSearched ? 'pt-8' : 'pt-32'}`}>
                <div className="container mx-auto px-4">
                    {!isSearched && (
                        <div className="text-center mb-16">
                            <h1 className="text-7xl font-bold text-gray-800 mb-8">Get Market Insights</h1>
                            <p className="text-2xl text-gray-600">Discover real-time market insights and sentiment analysis for informed investment decisions</p>
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
                        <div className="relative">
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                className="w-full px-8 py-6 text-xl border-0 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#3461FF]/20 bg-white/95 backdrop-blur-sm pr-16"
                                placeholder="Search any stock symbol (e.g., RELIANCE, TCS)"
                            />
                            <button
                                type="submit"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 text-[#3461FF] hover:text-[#3461FF]/80 transition-colors"
                                disabled={loading}
                            >
                                <Search className="h-7 w-7" />
                            </button>
                        </div>
                    </form>

                    {loading && (
                        <div className="text-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#3461FF]" />
                            <p className="mt-6 text-xl text-gray-600">Analyzing market sentiment...</p>
                        </div>
                    )}

                    {!loading && newsData && <NewsSection newsData={newsData} />}

                    {!loading && isSearched && !newsData && (
                        <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl max-w-3xl mx-auto">
                            <p className="text-xl text-gray-600">No market insights found for this symbol. Try searching for another stock.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockNewsApp;
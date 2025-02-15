"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

const NewsCard = ({ news }) => {
    const date = new Date(news.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{news.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{news.snippet}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{date}</span>
                            <div className="flex items-center">
                                {news.sentiment === "Positive" ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                <span className={`text-sm ${news.sentiment === "Positive" ? "text-green-500" : "text-red-500"}`}>
                                    {news.sentiment}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const NewsSection = ({ newsData }) => {
    if (!newsData.articles || !Array.isArray(newsData.articles)) {
        return <div>No news available or invalid data format.</div>;
    }

    const { articles, sentimentPercentage,sentimentScore } = newsData;

    return (
        <div className="p-4">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Stock News & Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around mb-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Positive Sentiment</p>
                            <p className="text-2xl font-bold text-green-500">{sentimentPercentage.positive}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">Negative Sentiment</p>
                            <p className="text-2xl font-bold text-red-500">{sentimentPercentage.negative}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {articles.map((news, index) => (
                    <NewsCard key={index} news={news} />
                ))}
            </div>
        </div>
    );
};

const StockNewsApp = () => {
    const [symbol, setSymbol] = useState('SBI');
    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/stock/stock-news/${symbol}`);
                const data = response.data;
                setNewsData(data.data); // Ensure you're setting the correct part of the response
            } catch (error:any) {
                setError(error.response?.data?.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
    
        fetchNews();
    }, [symbol]);

    const handleSymbolChange = (event) => {
        setSymbol(event.target.value);
    };

    return (
        <div className="p-4">
            <div className="mb-6">
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                    Enter Stock Symbol
                </label>
                <input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={handleSymbolChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter stock symbol"
                />
            </div>

            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {newsData && <NewsSection newsData={newsData} />}
        </div>
    );
};

export default StockNewsApp;
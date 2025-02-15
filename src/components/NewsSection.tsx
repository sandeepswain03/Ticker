import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    if (!newsData || !newsData.data) {
        return <div>No news available</div>;
    }

    const { data, sentimentPercentage } = newsData;

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
                {data.sort((a, b) => new Date(b.date) - new Date(a.date)).map((news, index) => (
                    <NewsCard key={index} news={news} />
                ))}
            </div>
        </div>
    );
};

export default NewsSection;
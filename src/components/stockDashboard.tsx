'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpFromLine, Eye, Users, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface StockDataPoint {
    date: string;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjClose: number;
}

interface StockAPIData {
    stockData: {
        data: {
            summaryDetail: {
                dayHigh: number;
                dayLow: number;
                fiftyTwoWeekHigh: number;
                fiftyTwoWeekLow: number;
                marketCap: number;
                trailingPE: number;
                volume: number;
                averageVolume: number;
            };
            price: {
                regularMarketPrice: number;
                regularMarketChange: number;
                regularMarketChangePercent: number;
                shortName: string;
                longName: string;
            };
        };
    };
    historicalData: {
        data: StockDataPoint[];
    };
}

interface StockDashboardProps {
    data: StockAPIData;
}

const formatLargeNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN').format(num);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
    });
};

const StockDashboard: React.FC<StockDashboardProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const {
        summaryDetail,
        price
    } = data.stockData.data;

    const historicalData = data.historicalData.data;

    return (
        <div className="min-h-screen bg-background p-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{price.shortName}</span>
                        <span>•</span>
                        <span>NSE</span>
                    </div>
                    <h1 className="text-2xl font-bold">{price.longName}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{formatLargeNumber(summaryDetail.volume)} Vol</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm">{formatLargeNumber(summaryDetail.averageVolume)} Avg</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-bold">₹{price.regularMarketPrice.toFixed(2)}</div>
                    <div className={`flex items-center gap-2 ${price.regularMarketChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {price.regularMarketChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{price.regularMarketChange.toFixed(2)}</span>
                        <span>({price.regularMarketChangePercent.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Price Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Day&apos;s Range</div>
                                        <div className="font-medium">
                                            ₹{summaryDetail.dayLow.toFixed(2)} - ₹{summaryDetail.dayHigh.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">52 Week Range</div>
                                        <div className="font-medium">
                                            ₹{summaryDetail.fiftyTwoWeekLow.toFixed(2)} - ₹{summaryDetail.fiftyTwoWeekHigh.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Market Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Market Cap</div>
                                        <div className="font-medium">₹{formatLargeNumber(summaryDetail.marketCap)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">P/E Ratio</div>
                                        <div className="font-medium">{summaryDetail.trailingPE.toFixed(2)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Volume Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Volume</div>
                                        <div className="font-medium">{formatLargeNumber(summaryDetail.volume)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Avg. Volume</div>
                                        <div className="font-medium">{formatLargeNumber(summaryDetail.averageVolume)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Price Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDate}
                                        minTickGap={50}
                                    />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip
                                        labelFormatter={(value) => formatDate(value as string)}
                                        formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#2563eb"
                                        dot={false}
                                        name="Price"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StockDashboard;
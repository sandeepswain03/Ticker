import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart2, Activity } from 'lucide-react';

const StockDashboard = ({ data }) => {
    const { summaryDetail, price } = data.stockData.data;
    const historicalData = data.historicalData.data;

    // Calculate additional metrics
    const volumeChange = ((summaryDetail.volume - summaryDetail.averageVolume) / summaryDetail.averageVolume * 100).toFixed(2);
    const priceToBook = (price.regularMarketPrice / summaryDetail.bookValue).toFixed(2);

    return (
        <div className="space-y-4">
            {/* Market Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{price.regularMarketPrice.toFixed(2)}</div>
                        <div className={`flex items-center text-xs ${price.regularMarketChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {price.regularMarketChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {price.regularMarketChangePercent.toFixed(2)}%
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(summaryDetail.volume / 1000000).toFixed(2)}M</div>
                        <div className={`flex items-center text-xs ${volumeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {volumeChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {volumeChange}% vs Avg
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">P/E Ratio</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryDetail.trailingPE.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Industry Avg: 15.5</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{(summaryDetail.marketCap / 10000000).toFixed(2)}Cr</div>
                        <p className="text-xs text-muted-foreground">P/B: {priceToBook}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Price Chart */}
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>Price Movement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="close" stroke="#2563eb" name="Price" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Volume Chart */}
                    <Card className="h-[400px]">
                        <CardHeader>
                            <CardTitle>Volume Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="volume" fill="#3b82f6" name="Volume" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dividend Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Dividend Yield</span>
                                        <span>{(summaryDetail.dividendYield * 100).toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dividend Rate</span>
                                        <span>₹{summaryDetail.dividendRate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Trading Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Beta</span>
                                        <span>{summaryDetail.beta.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>52W Range</span>
                                        <span>₹{summaryDetail.fiftyTwoWeekLow} - ₹{summaryDetail.fiftyTwoWeekHigh}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Moving Averages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>50 Day MA</span>
                                        <span>₹{summaryDetail.fiftyDayAverage.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>200 Day MA</span>
                                        <span>₹{summaryDetail.twoHundredDayAverage.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StockDashboard;
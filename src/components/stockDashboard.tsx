"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Area, AreaChart, LineChart, Line, Legend
} from "recharts"
import { ArrowUpFromLine, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { useParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StockDataPoint {
    date: string
    high: number
    low: number
    close: number
    volume: number
    adjClose: number
    actualPrice?: number
    predictedPrice?: number
}

interface StockAPIData {
    stockData: {
        data: {
            summaryDetail: {
                dayHigh: number
                dayLow: number
                fiftyTwoWeekHigh: number
                fiftyTwoWeekLow: number
                marketCap: number
                trailingPE: number
                volume: number
                averageVolume: number
            }
            price: {
                regularMarketPrice: number
                regularMarketChange: number
                regularMarketChangePercent: number
                shortName: string
                longName: string
            }
        }
    }
    historicalData: {
        data: StockDataPoint[]
    }
}

interface StockDashboardProps {
    data: StockAPIData
    startDate: string
    endDate: string
}

interface PredictionError {
    message: string
    code?: string
}

const formatLargeNumber = (num: number) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`
    return new Intl.NumberFormat("en-IN").format(num)
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    })
}

interface FuturePredictions {
    dates: string[]
    predicted_prices: number[]
}

interface HistoricalData {
    dates: string[]
    actual_prices: number[]
    predicted_prices: number[]
}

interface ApiResponse {
    future_predictions: FuturePredictions
    historical_data: HistoricalData
}

interface PredictionData {
    date: string
    actualPrice: number | null
    predictedPrice: number
}

const StockDashboard: React.FC<StockDashboardProps> = ({ data, startDate, endDate }) => {
    const params = useParams()
    const [activeTab, setActiveTab] = useState("overview")
    const [predictionDays, setPredictionDays] = useState("5")
    const [chartData, setChartData] = useState<PredictionData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)
    const [isRetrying, setIsRetrying] = useState(false)
    const { summaryDetail, price } = data.stockData.data

    const filteredHistoricalData = useMemo(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        return data.historicalData.data.filter(item => {
            const itemDate = new Date(item.date)
            return itemDate >= start && itemDate <= end
        })
    }, [data.historicalData.data, startDate, endDate])

    const filteredPredictionData = useMemo(() => {
        if (!chartData.length) return []
        const start = new Date(startDate)
        const end = new Date(endDate)

        return chartData.filter(item => {
            const itemDate = new Date(item.date)
            return (itemDate >= start && itemDate <= end) ||
                (itemDate > new Date())
        })
    }, [chartData, startDate, endDate])

    const fetchPredictionData = async (days: string) => {
        setIsLoading(true)
        setError(null)
        setApiError(null)
        setIsRetrying(true)

        try {
            const response = await axios.get<ApiResponse>(`http://127.0.0.1:5000/predict`, {
                params: {
                    symbol: params.symbol as string,
                    future_days: days,
                    start_date: startDate,
                    end_date: endDate
                },
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                }
            });

            const responseData = response.data;

            if (!responseData.historical_data || !responseData.future_predictions) {
                throw new Error('Invalid response format from server');
            }

            const historicalMapped = responseData.historical_data.dates.map((date, index) => ({
                date: new Date(date).toISOString(),
                actualPrice: responseData.historical_data.actual_prices[index],
                predictedPrice: responseData.historical_data.predicted_prices[index]
            }));

            const futureMapped = responseData.future_predictions.dates.map((date, index) => ({
                date: new Date(date).toISOString(),
                actualPrice: null,
                predictedPrice: responseData.future_predictions.predicted_prices[index]
            }));

            const combinedData = [...historicalMapped, ...futureMapped].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            setChartData(combinedData);
        } catch (error) {
            let errorMessage = 'Failed to fetch prediction data';

            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    errorMessage = 'Request timed out. Please try again.';
                } else if (error.response) {
                    errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                } else if (error.request) {
                    errorMessage = 'No response from server. Please check your connection.';
                }
            }

            setApiError(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setIsRetrying(false);
        }
    };

    useEffect(() => {
        if (activeTab === "technical" && !isRetrying) {
            fetchPredictionData(predictionDays);
        }
    }, [startDate, endDate, activeTab, predictionDays]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            const date = new Date(label)
            const isDateInFuture = date > new Date()

            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="text-sm font-semibold">
                        {date.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                        {isDateInFuture && " (Predicted)"}
                    </p>
                    <div className="mt-2 space-y-2">
                        {data.actualPrice !== null && (
                            <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Actual:</span>
                                <span className="font-medium">₹{Number(data.actualPrice).toFixed(2)}</span>
                            </p>
                        )}
                        {data.predictedPrice !== null && (
                            <p className="text-sm flex justify-between">
                                <span className="text-gray-600">Predicted:</span>
                                <span className="font-medium">₹{Number(data.predictedPrice).toFixed(2)}</span>
                            </p>
                        )}
                    </div>
                </div>
            )
        }
        return null
    }

    const handlePredictionDaysChange = (value: string) => {
        setPredictionDays(value);
        fetchPredictionData(value);
    };

    const renderTechnicalContent = () => {
        if (isLoading) {
            return (
                <div className="h-96 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="text-gray-600">Loading predictions...</p>
                    </div>
                </div>
            );
        }

        if (apiError) {
            return (
                <div className="h-96">
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => fetchPredictionData(predictionDays)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            disabled={isRetrying}
                        >
                            {isRetrying ? 'Retrying...' : 'Retry'}
                        </button>
                    </div>
                </div>
            );
        }

        if (!filteredPredictionData.length) {
            return (
                <div className="h-96 flex items-center justify-center">
                    <p className="text-gray-600">No data available for the selected period</p>
                </div>
            );
        }

        return (
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={filteredPredictionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(date) => new Date(date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short"
                            })}
                            minTickGap={50}
                        />
                        <YAxis
                            tickFormatter={(value) => `₹${value}`}
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="actualPrice"
                            stroke="#2563eb"
                            name="Actual Price"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="predictedPrice"
                            stroke="#dc2626"
                            name="Predicted Price"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 6 }}
                            strokeDasharray="5 5"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background p-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{price.shortName}</span>
                        <span>•</span>
                        <span>NSE</span>
                    </div>
                    <h1 className="text-3xl font-bold mt-1">{price.longName}</h1>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{formatLargeNumber(summaryDetail.volume)} Vol</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{formatLargeNumber(summaryDetail.averageVolume)} Avg</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-bold mb-2">₹{price.regularMarketPrice.toFixed(2)}</div>
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${price.regularMarketChange >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                    >
                        {price.regularMarketChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span className="font-medium">{price.regularMarketChange.toFixed(2)}</span>
                        <span>({price.regularMarketChangePercent.toFixed(2)}%)</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}

            <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="bg-white p-1 rounded-lg">
                    <TabsTrigger value="overview" className="px-6 border-b-2 border-transparent">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="px-6 border-b-2 border-transparent">
                        Prediction
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <ArrowUpFromLine className="h-4 w-4 text-blue-500" />
                                    Price Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Day&apos;s Range</div>
                                        <div className="font-medium text-lg">
                                            ₹{summaryDetail.dayLow.toFixed(2)} - ₹{summaryDetail.dayHigh.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">52 Week Range</div>
                                        <div className="font-medium text-lg">
                                            ₹{summaryDetail.fiftyTwoWeekLow.toFixed(2)} - ₹{summaryDetail.fiftyTwoWeekHigh.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                    Market Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
                                        <div className="font-medium text-lg">₹{formatLargeNumber(summaryDetail.marketCap)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">P/E Ratio</div>
                                        <div className="font-medium text-lg">{summaryDetail.trailingPE.toFixed(2)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-purple-500" />
                                    Volume Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Volume</div>
                                        <div className="font-medium text-lg">{formatLargeNumber(summaryDetail.volume)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Avg. Volume</div>
                                        <div className="font-medium text-lg">{formatLargeNumber(summaryDetail.averageVolume)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Today&apos;s Change</div>
                                        <div className={`font-medium text-lg ${price.regularMarketChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                            {price.regularMarketChange >= 0 ? "+" : ""}{price.regularMarketChange.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                                        <div className="font-medium text-lg">₹{price.regularMarketPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="h-[450px] hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Historical Price Chart
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart
                                    data={filteredHistoricalData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tickFormatter={formatDate} minTickGap={50} stroke="#888" />
                                    <YAxis domain={["auto", "auto"]} stroke="#888" tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorClose)"
                                        name="Price"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="technical">
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Stock Price History and Predictions</CardTitle>
                            <Select
                                value={predictionDays}
                                onValueChange={handlePredictionDaysChange}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Prediction days" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(days => (
                                        <SelectItem key={days} value={days.toString()}>
                                            {days} {days === 1 ? 'day' : 'days'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {renderTechnicalContent()}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default StockDashboard

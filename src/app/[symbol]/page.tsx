'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import StockDashboard from '@/components/stockDashboard';
import EnhancedDatePicker from '@/components/DateRangePicker';

interface PageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage({ params }: PageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockData, portfolioData, historicalData] = await Promise.all([
          axios.get(`http://localhost:8000/api/stock/stock-data/${params.symbol}`),
          axios.get(`http://localhost:8000/api/stock/portfolio/${params.symbol}`),
          axios.get(`http://localhost:8000/api/stock/historical-data/${params.symbol}`, {
            params: {
              period1: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
              period2: endDate ? format(endDate, 'yyyy-MM-dd') : undefined
            }
          })
        ]);

        setData({
          portfolioData: portfolioData.data,
          stockData: stockData.data,
          historicalData: historicalData.data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [params.symbol, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3461FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl font-semibold mb-4">Oops! Something went wrong</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">No data available for this stock</div>
      </div>
    );
  }

  return (
    <>
      <EnhancedDatePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(date) => date && setStartDate(date)}
        onEndDateChange={(date) => date && setEndDate(date)}
      />
      <StockDashboard
        data={data}
        startDate={format(startDate, 'yyyy-MM-dd')}
        endDate={format(endDate, 'yyyy-MM-dd')}
      />
    </>
  );
}
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import StockDashboard from '@/components/stockDashboard';
import DateRangePicker from '@/components/DateRangePicker';

interface PageProps {
  params: {
    symbol: string;
  };
}

export default function StockPage({ params }: PageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1), // January 1, 2024
    to: new Date() // Current date
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockData, historicalData] = await Promise.all([
          axios.get(`http://localhost:8000/api/stock/stock-data/${params.symbol}`),
          axios.get(`http://localhost:8000/api/stock/historical-data/${params.symbol}`, {
            params: {
              period1: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
              period2: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
            }
          })
        ]);

        setData({
          stockData: stockData.data,
          historicalData: historicalData.data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    if (dateRange?.from && dateRange?.to) {
      fetchData();
    }
  }, [params.symbol, dateRange]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen">No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-4">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <StockDashboard data={data} />
    </div>
  );
}
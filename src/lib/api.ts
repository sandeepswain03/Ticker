export async function fetchStockData(symbol: string) {
    const res = await fetch(`/api/stock/${symbol}`)
    if (!res.ok) throw new Error('Failed to fetch stock data')
    return res.json()
}
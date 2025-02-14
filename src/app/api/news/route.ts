import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET() {
  try {
    // Get news for specific major market symbols
    const symbols = ["AAPL", "MSFT", "GOOGL"]; // Using stable major tech stocks
    const newsPromises = symbols.map((symbol) =>
      yahooFinance.search(symbol, {
        newsCount: 3,
        quotesCount: 0,
      })
    );

    const newsResults = await Promise.all(newsPromises);
    const allNews = newsResults
      .map((result) => result.news || [])
      .flat()
      .filter((news): news is any => Boolean(news))
      .slice(0, 9)
      .map((article) => ({
        text: article.title || "News Title Unavailable",
        imageSrc:
          article.thumbnail?.resolutions?.[0]?.url || "/default-news.png",
        name: article.publisher || "Financial News",
        username: article.publisher
          ? `@${article.publisher.toLowerCase().replace(/\s+/g, "")}`
          : "@financialnews",
      }));

    // If we don't have enough news, add some default entries
    while (allNews.length < 9) {
      allNews.push({
        text: "Market updates and financial insights",
        imageSrc: "/default-news.png",
        name: "Financial News",
        username: "@financialnews",
      });
    }

    return NextResponse.json(allNews);
  } catch (error) {
    console.error("Error fetching news:", error);

    // Return default news items in case of error
    const defaultNews = Array(9).fill({
      text: "Market updates and financial insights",
      imageSrc: "/default-news.png",
      name: "Financial News",
      username: "@financialnews",
    });

    return NextResponse.json(defaultNews);
  }
}

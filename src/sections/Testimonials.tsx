"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import React from "react";

interface NewsArticle {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
}

const NewsColumn = ({
  className,
  articles,
  duration = 10,
}: {
  className?: string;
  articles: NewsArticle[];
  duration?: number;
}) => (
  <div className={className}>
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {articles.map(({ text, imageSrc, name, username }) => (
            <div className="card">
              <div>{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "/default-news.png";
                  }}
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5">
                    {name}
                  </div>
                  <div className="leading-5 tracking-tight">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setError("Failed to load news articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-5 text-red-500">{error}</div>;
  }

  const firstColumn = articles.slice(0, 3);
  const secondColumn = articles.slice(3, 6);
  const thirdColumn = articles.slice(6, 9);

  return (
    <section className="bg-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
          </div>
          <h2 className="section-title mt-5">Latest Market Insights</h2>
          <p className="section-description mt-5">
            Stay updated with the latest finance news, market trends, and insights.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <NewsColumn articles={firstColumn} duration={15} />
          <NewsColumn
            articles={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <NewsColumn
            articles={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

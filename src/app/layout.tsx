import { QueryClient } from '@tanstack/react-query';
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import Provider from './Provider';

const dmSans = DM_Sans({ subsets: ["latin"] });
const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "ticker: Fundametal Stock Analysis",
  description: "Fundamental Stock Analysis: Charts, Peers, Ratios, Shareholding, Quaterly, P&L, BalanceSheet, CashFlow, Dividend, Earnings, News, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}

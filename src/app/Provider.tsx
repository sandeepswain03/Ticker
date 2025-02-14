"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'

type Props = {}
const queryClient = new QueryClient();

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
export default Provider;
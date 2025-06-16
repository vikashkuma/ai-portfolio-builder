'use client';

import React from 'react';
import { usePortfolioStore } from '../store/portfolioStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { portfolio } = usePortfolioStore();
  const theme = portfolio?.theme || 'light';
  return (
    <div className={`${theme} bg-background text-foreground min-h-screen flex flex-col`}>
      {children}
    </div>
  );
} 
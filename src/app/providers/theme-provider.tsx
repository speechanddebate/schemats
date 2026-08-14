'use client';

import { ThemeProvider, useTheme, rootFont } from '@/app/providers/theme-provider';
import { rubik } from 'next/font/google';

const font = rubik({ subsets: ['latin'] });

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContextProvider value={{ theme, setTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContextProvider>
  );
};

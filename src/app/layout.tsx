import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Guia de Resumos Científicos',
  description: 'Aprenda a estruturar resumos simples e expandidos para eventos científicos.',
}

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Viewport } from 'next';

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '8px',
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: 'white',
              },
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
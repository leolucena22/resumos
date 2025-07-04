import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Guia de Resumos Científicos',
  description: 'Aprenda a estruturar resumos simples e expandidos para eventos científicos.',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}
        <Analytics />
      </body>
    </html>
  )
}
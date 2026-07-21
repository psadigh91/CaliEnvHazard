import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CalEJ - California Environmental Justice Mapper',
  description: 'Interactive map showing environmental pollution burden and health risks across California census tracts',
  keywords: ['environmental justice', 'California', 'pollution', 'health', 'census tracts'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-calej-green text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">CalEJ</h1>
                <span className="text-sm opacity-90">California Environmental Justice Mapper</span>
              </div>
              <div className="flex space-x-6">
                <a href="/" className="hover:text-gray-200">Map</a>
                <a href="/about" className="hover:text-gray-200">About</a>
                <a href="/data" className="hover:text-gray-200">Data Sources</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>CalEJ - Open source environmental justice mapping tool</p>
              <p className="mt-2">
                Data sources: CalEnviroScreen 4.0, EPA Superfund, EPA TRI, US Census Bureau
              </p>
              <p className="mt-2">
                <a href="https://github.com/psadigh91/CalEJ" className="text-calej-blue hover:underline">
                  GitHub
                </a>
                {' · '}
                <a href="/about" className="text-calej-blue hover:underline">
                  About
                </a>
                {' · '}
                Licensed under MIT
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

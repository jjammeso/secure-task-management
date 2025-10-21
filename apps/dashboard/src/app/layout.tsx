import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Secure Task Management with Role-Based Access Control',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
          />
        </Providers>
      </body>
    </html>
  );
}

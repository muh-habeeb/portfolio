/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire Next.js application.
 * It provides:
 * - Font configuration (Geist Sans and Geist Mono)
 * - Global CSS imports and styling
 * - Theme provider for dark/light mode
 * - Clerk authentication provider for user management
 * - Convex provider for real-time database
 * - Custom cursor component
 * - Toast notifications
 * - HTML structure and metadata
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/convex-provider";
import ClerkClientProvider from "@/providers/clerk-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import CustomCursor from "@/components/ui/custom-cursor";

// Configure Geist Sans font with CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font for code elements
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata for the application
export const metadata: Metadata = {
  title: "Portfolio - Full Stack Developer",
  description: "Modern portfolio showcasing full-stack development projects and skills",
};

/**
 * Root Layout Function
 * 
 * Wraps the entire application with necessary providers:
 * 1. ClerkClientProvider - Authentication wrapper
 * 2. ThemeProvider - Dark/light theme management
 * 3. ConvexClientProvider - Real-time database connection
 * 4. CustomCursor - Custom cursor overlay
 * 5. Toaster - Global toast notifications
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-none`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <CustomCursor />
              {children}
              <Toaster />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkClientProvider>
  );
}

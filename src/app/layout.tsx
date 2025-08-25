import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatLoader } from "@/components/chat-loader";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neon Agent",
  description: `Neon is a next-generation web application designed to make work smarter, not harder.
It combines intuitive design with powerful features such as real-time collaboration, AI-driven insights, and streamlined workflows. Whether you’re managing projects, chatting with teammates, or automating repetitive tasks, Neon gives you the tools to stay focused and productive — all in one simple, beautifully designed app`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full h-screen overflow-y-scroll relative">
              <SidebarTrigger />
              <ChatLoader>{children}</ChatLoader>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

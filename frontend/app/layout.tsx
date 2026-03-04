import type { Metadata,Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Football Live Score",
  description: "Live score of the world's top football leagues",
};
export const viewport: Viewport = {
  themeColor: "#18181b",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
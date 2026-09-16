import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { Cursor } from "@/components/cursor/Cursor";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import "./globals.css";

const display = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aly Sanoo — Post-Production | Sound Designer",
  description:
    "Aly Sanoo cuts images into stories. Editing, post-production and sound design for film, music and commercial work. Based in Madagascar.",
};

export const viewport: Viewport = {
  themeColor: "#080A0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {/* Marks JS as live before first paint, so the opening states in globals.css only apply when GSAP will resolve them. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <SiteHeader />
        {children}
        <Cursor />
      </body>
    </html>
  );
}

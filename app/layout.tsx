import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Geist_Mono, Manrope } from "next/font/google";
import { Cursor } from "@/components/cursor/Cursor";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import "./globals.css";

// Title face — headline and wordmark only. Single weight (400); Google ships no other cut.
const title = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aly Sanoo — Post-Production & Sound Design",
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
      className={`${title.variable} ${body.variable} ${mono.variable} h-full antialiased`}
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

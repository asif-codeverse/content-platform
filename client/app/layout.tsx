import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import AppShell from "@/components/AppShell";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://YOUR-DOMAIN.com"),

    title: {
        default: "Content Platform",
        template: "%s | Content Platform",
    },

    description:
        "A modern publishing platform featuring editorial workflows, intelligent search, secure authentication, and a clean reading experience.",

    keywords: [
        "Content Platform",
        "Publishing Platform",
        "Content Management",
        "Editorial Workflow",
        "Articles",
        "Knowledge Sharing",
    ],

    openGraph: {
        title: "Content Platform",
        description:
            "Publish, review, and discover articles with a modern editorial workflow.",
        url: "https://content-platform-v1.vercel.app/",
        siteName: "Content Platform",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "Content Platform",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Content Platform",
        description:
            "Publish, review, and discover articles with a modern editorial workflow.",
        images: ["/twitter-image.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <body
                className="
                    min-h-screen
                    bg-[var(--background)]
                    text-[var(--foreground)]
                    font-sans
                    antialiased
                    overflow-x-hidden
                "
            >
                <ThemeProvider>
                    <AuthProvider>
                        <AppShell>{children}</AppShell>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
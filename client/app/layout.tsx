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
    title: {
        default: "Content Platform",
        template: "%s | Content Platform",
    },

    description:
        "A modern content publishing platform built with Next.js, Express, MongoDB, and Redis.",

    keywords: [
        "Content Platform",
        "CMS",
        "Next.js",
        "React",
        "Express",
        "MongoDB",
        "Redis",
        "Publishing",
        "Content Management",
    ],
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
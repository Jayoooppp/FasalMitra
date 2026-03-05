import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
    title: "FasalMitra – AI Farmer Ecosystem",
    description: "AI-powered farming assistant for Indian farmers. Crop recommendations, disease detection, market prices, government schemes, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <LanguageProvider>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

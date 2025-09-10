"use client";

import "./globals.css";
import FloatingWeziBot from "@/components/FloatingWeziBot";
import FloatingEmergencyButton from "@/components/FloatingEmergencyButton";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/config";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-gray-900 antialiased">
        <I18nextProvider i18n={i18n}>
          {children}
          <FloatingWeziBot />
          <FloatingEmergencyButton />
        </I18nextProvider>
      </body>
    </html>
  );
};

export default RootLayout;

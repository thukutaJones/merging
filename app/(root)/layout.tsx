import type { Metadata } from "next";
import TopBar from "@/components/root/TopBar";
import Footer from "@/components/root/Footer";

export const metadata: Metadata = {
  title: "Home | Wez Medical Centre",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-white font-sans text-gray-900 antialiased h-screen overflow-auto scroll-container">
      <TopBar />

      {children}
      <Footer />
    </main>
  );
}

"use client";

import React from "react";
import { TourProvider, useTour } from "@reactour/tour";
import HeroSection from "@/components/root/HeroSection";
import Services from "@/components/root/Services";
import FAQs from "@/components/root/FAQs";
import { FaWalking } from "react-icons/fa";
import {
  RiDashboardLine,
  RiStethoscopeLine,
  RiMessage2Line,
} from "react-icons/ri";

// Tour steps definition
const tourSteps = [
  {
    selector: ".hero-section",
    content: () => (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <RiDashboardLine /> Welcome to WEZI Clinic
        </h3>
        <p>
          This is where the journey starts 🎉. The hero section introduces who
          we are and what we do.
        </p>
      </div>
    ),
  },
  {
    selector: ".services-section",
    content: () => (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <RiStethoscopeLine /> Services
        </h3>
        <p>
          Here you’ll find the medical services we offer — from consultations to
          specialized care. Think of this as our digital reception desk 🏥.
        </p>
      </div>
    ),
  },
  {
    selector: ".faqs-section",
    content: () => (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <RiMessage2Line /> FAQs
        </h3>
        <p>
          Quick answers at your fingertips! Before calling support, you can find
          solutions to the most common questions here.
        </p>
      </div>
    ),
  },
  // Add other steps...
];

// Page content component
const PageContent: React.FC = () => {
  const { setIsOpen } = useTour();

  return (
    <div className="w-full">
      {/* Guided Tour Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-2 rounded-lg shadow-lg hover:opacity-90 transition"
        title="Start Guided Tour"
      >
        <FaWalking size={20} />
        <span className="hidden sm:inline text-sm font-medium">Guided Tour</span>
      </button>

      {/* Main Sections */}
      <HeroSection />
      <Services />
      <FAQs />
      {/* Add admin/dashboard sections here with proper CSS classes */}
    </div>
  );
};

// Main Page with TourProvider
const Page: React.FC = () => (
  <TourProvider
    steps={tourSteps}
    styles={{
      popover: (base) => ({
        ...base,
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "#f9fafb",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }),
      maskArea: (base) => ({ ...base, rx: 8 }),
      badge: (base) => ({ ...base, background: "#2563eb" }),
    }}
  >
    <PageContent />
  </TourProvider>
);

export default Page;

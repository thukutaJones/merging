"use client";

import { navContent } from "@/constants/rootConstants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="z-20 w-full fixed bg-white/90 backdrop-blur-sm h-[70px] flex flex-row justify-between items-center px-6 md:px-8 shadow-md">
      {/* Logo */}
      <div className="flex flex-row items-center gap-2">
        <Image
          width={500}
          height={500}
          alt="WMC Logo"
          src={"/wezLogo.png"}
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-xl font-bold text-blue-900">WMC</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-row items-center gap-10">
        <nav className="flex flex-row gap-8 items-center">
          {navContent?.map((item: any) => (
            <Link
              href={item?.route}
              key={item?.key}
              className="flex flex-row gap-2 items-center hover:text-blue-600 transition-colors"
            >
              {item?.icon && (
                <item.icon className="text-blue-900 mr-1" size={16} />
              )}
              <p className="text-blue-900 font-semibold text-sm">
                {t(`root.top_bar.${item?.key}`)}
              </p>
            </Link>
          ))}
        </nav>

        <div className="flex flex-row gap-4">
          <LanguageSwitcher />
          <button
            className="px-4 py-2 flex flex-row items-center bg-gray-50 hover:scale-105 hover:shadow hover:shadow-blue-600 transition-all duration-300 text-blue-900 font-semibold rounded-full"
            onClick={() => router.push("/sign-in")}
          >
            <CiLogin className="text-blue-900 mr-2 inline" size={20} />
            <p className="text-sm">{t("root.top_bar.signIn")}</p>
          </button>
          <button
            className="px-4 py-2 flex flex-row items-center bg-blue-900 hover:scale-105 hover:shadow hover:shadow-blue-600 transition-all duration-300 text-white font-semibold rounded-full"
            onClick={() => router.push("/sign-up")}
          >
            <p className="text-sm">{t("root.top_bar.getStarted")}</p>
            <FaArrowRight className="text-white ml-4 inline" size={15} />
          </button>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <FaTimes size={24} className="text-blue-900" />
          ) : (
            <FaBars size={24} className="text-blue-900" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center py-6 gap-6 animate-slideDown">
          {navContent?.map((item: any) => (
            <Link
              href={item?.route}
              key={item?.key}
              className="flex flex-row gap-2 items-center text-blue-900 font-semibold hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item?.icon && <item.icon size={16} />}
              <p>{t(`root.top_bar.${item?.key}`)}</p>
            </Link>
          ))}

          {/* Mobile buttons */}
          <div className="flex flex-col gap-4 w-full items-center">
            <button
              className="px-4 py-2 flex flex-row items-center bg-gray-50 text-blue-900 font-semibold rounded-full w-32 justify-center hover:scale-105 transition-all duration-300"
              onClick={() => {
                setMenuOpen(false);
                router.push("/sign-in");
              }}
            >
              <CiLogin className="mr-2" size={20} />
              {t("root.top_bar.signIn")}
            </button>
            <button
              className="px-4 py-2 flex flex-row items-center bg-blue-900 text-white font-semibold rounded-full w-32 justify-center hover:scale-105 transition-all duration-300"
              onClick={() => {
                setMenuOpen(false);
                router.push("/sign-up");
              }}
            >
              {t("root.top_bar.getStarted")}
              <FaArrowRight className="ml-2" size={15} />
            </button>
          </div>

          {/* Mobile language switch */}
          <div className="flex gap-2">
            {["en", "ny", "tk"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  i18n.changeLanguage(lang);
                  setMenuOpen(false);
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;

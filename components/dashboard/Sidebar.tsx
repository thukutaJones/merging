"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  RiMenuLine,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface ChildItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  key?: string;
  requiredRoles?: string[]; // ✅ added to child
}

interface MenuItem {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  requiredRoles?: string[]; // ✅ optional, not forced
  children: ChildItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  userRole: string | null | undefined;
  userName?: string | null | undefined;
  userEmail?: string | null | undefined;
}

export default function Sidebar({
  menuItems,
  userRole,
  userName,
  userEmail,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // ✅ Mobile check
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsExpanded(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✅ Auto-expand active parents
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.route === pathname)) {
        setExpandedItems((prev) => new Set([...prev, item.key]));
      }
    });
  }, [pathname, menuItems]);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const toggleMenuItem = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleChildClick = (route: string) => {
    router.push(route);
    if (isMobile) setIsExpanded(false);
  };

  const isRouteActive = (route: string) => pathname === route;
  const isParentActive = (item: MenuItem) =>
    item.children.some((child) => pathname === child.route);

  return (
    <>
      {/* ✅ Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-screen transition-all duration-700 ease-out
          ${isExpanded ? "w-80" : "w-20"}
          ${isMobile ? "fixed top-0 left-0 z-50 bg-white shadow-lg" : "relative z-20"}
          ${isMobile && !isExpanded ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="h-full bg-white/95 backdrop-blur-xl flex flex-col">
          {/* Header */}
          <div className="relative h-[100px] flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/wezLogo.png"
                alt="logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              {isExpanded && (
                <div>
                  <h1 className="text-blue-900 font-bold text-2xl">Wezi</h1>
                  <p className="text-blue-900 text-sm font-semibold">
                    Medical Centre
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={toggleExpanded}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-blue-900 transition-all"
            >
              {isExpanded ? (
                <RiCloseLine className="w-5 h-5" />
              ) : (
                <RiMenuLine className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {menuItems
              .filter(
                (item) =>
                  !item.requiredRoles ||
                  (userRole && item.requiredRoles.includes(userRole))
              )
              .map((item) => {
                const Icon = item.icon;
                const isItemExpanded = expandedItems.has(item.key);
                const isActive = isParentActive(item);

                return (
                  <div key={item.key}>
                    {/* Parent */}
                    <button
                      onClick={() => isExpanded && toggleMenuItem(item.key)}
                      onMouseEnter={() => setHoveredItem(item.key)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all
                        ${isActive ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50"}
                        ${!isExpanded && "justify-center"}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-lg ${
                            isActive ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isActive ? "text-blue-900" : "text-gray-600"
                            }`}
                          />
                        </div>
                        {isExpanded && (
                          <span className="font-semibold">
                            {t(`sideBar.${item.key}`, item.title)}
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        isItemExpanded ? (
                          <RiArrowDownSLine className="w-5 h-5 text-gray-600" />
                        ) : (
                          <RiArrowRightSLine className="w-5 h-5 text-gray-600" />
                        )
                      )}
                    </button>

                    {/* Children */}
                    {isExpanded && isItemExpanded && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children
                          .filter(
                            (child) =>
                              !child.requiredRoles ||
                              (userRole &&
                                child.requiredRoles.includes(userRole))
                          )
                          .map((child) => {
                            const ChildIcon = child.icon;
                            const active = isRouteActive(child.route);

                            return (
                              <button
                                key={child.route}
                                onClick={() => handleChildClick(child.route)}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all
                                  ${
                                    active
                                      ? "bg-blue-100 text-blue-900"
                                      : "hover:bg-gray-50 text-gray-700"
                                  }
                                `}
                              >
                                <ChildIcon
                                  className={`w-5 h-5 ${
                                    active ? "text-blue-700" : "text-gray-500"
                                  }`}
                                />
                                <span>
                                  {t(`sideBar.${child.key}`, child.title)}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>

          {/* Profile */}
          {isExpanded ? (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                  {userName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{userName}</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                  <span className="text-xs font-medium bg-blue-100 text-blue-900 px-2 py-1 rounded-full">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                {userName?.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Mobile Floating Button */}
      {isMobile && !isExpanded && (
        <button
          onClick={toggleExpanded}
          className="fixed top-6 left-6 z-50 p-4 bg-blue-900 text-white rounded-xl shadow-lg"
        >
          <RiMenuLine className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  token?: string;
  full_name: string;
}

export const useAuth = (
  allowedRoles: string[] = [],
  redirectPath = "/sign-in"
) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      // fallback to guest
      const guestUser: DecodedToken = {
        id: "guest",
        email: "guest@wezi.ai",
        role: "guest",
        full_name: "Guest User",
      };
      setUser(guestUser);
      setIsAuthenticated(false);
      setIsAuthorized(allowedRoles.length === 0); // guests only "authorized" if page has no restrictions
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentUser: DecodedToken = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        full_name: decoded.full_name || decoded.full_name || "",
        token,
      };

      setUser(currentUser);
      setIsAuthenticated(true);
      const authorized =
        allowedRoles.length === 0 || allowedRoles.includes(currentUser.role);
      setIsAuthorized(authorized);

      if (!authorized && allowedRoles.length > 0) {
        // router.replace("/unauthorized");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("access_token");

      const guestUser: DecodedToken = {
        id: "guest",
        email: "guest@wezi.ai",
        role: "guest",
        full_name: "Guest User",
      };
      setUser(guestUser);
      setIsAuthenticated(false);
      setIsAuthorized(allowedRoles.length === 0);
      router.replace(redirectPath);
    }
  }, []);

  return {
    user: useMemo(() => user, [user?.id, user?.role, user?.token]),
    isAuthenticated,
    isAuthorized,
  };
};

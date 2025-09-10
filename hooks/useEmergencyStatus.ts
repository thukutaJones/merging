"use client";

import { useState, useEffect } from "react";

export function useEmergencyStatus() {
  const [hasActiveEmergency, setHasEmergency] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hasMedicalEmergency");
    setHasEmergency(stored === "true");
  }, []);

  const updateEmergency = (status: boolean) => {
    localStorage.setItem("hasMedicalEmergency", status.toString());
    setHasEmergency(status);
  };

  return { hasActiveEmergency, updateEmergency };
}

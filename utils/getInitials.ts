export const getInitials = (name: string = ""): string => {
  try {
    const trimmed = name.trim();
    if (!trimmed) return "";

    const parts = trimmed.split(" ").filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    const first = parts[0][0] || "";
    const last = parts[parts.length - 1][0] || "";

    return (first + last).toUpperCase();
  } catch (error) {
    console.error("Failed to extract initials:", error);
    return "";
  }
};


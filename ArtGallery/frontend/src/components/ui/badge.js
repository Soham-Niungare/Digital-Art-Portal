import React from "react";

// Badge Component
export const Badge = ({ children, variant = "default" }) => {
  const badgeClasses = classNames(
    "px-2 py-1 rounded text-xs font-semibold inline-block",
    {
      "bg-gray-100 text-gray-800": variant === "default",
      "bg-yellow-100 text-yellow-800": variant === "warning",
      "bg-green-100 text-green-800": variant === "success",
      "bg-blue-100 text-blue-800": variant === "info",
      "bg-red-100 text-red-800": variant === "danger",
    }
  );

  return <span className={badgeClasses}>{children}</span>;
};

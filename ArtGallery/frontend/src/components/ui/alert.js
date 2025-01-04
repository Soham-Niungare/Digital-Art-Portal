import React from "react";

export const Alert = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "p-4 rounded-lg flex items-center space-x-2";
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800 border-l-4 border-red-500",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

import React from "react";

export const Textarea = ({ className = "", ...props }) => {
  const baseStyles = `
    w-full p-2 border rounded-md
    focus:outline-none focus:ring focus:ring-blue-200
    transition duration-200
  `;
  const defaultStyles = `
    border-gray-300 text-gray-900
    focus:border-blue-500
  `;

  return (
    <textarea
      className={`${baseStyles} ${defaultStyles} ${className}`}
      {...props}
    />
  );
};

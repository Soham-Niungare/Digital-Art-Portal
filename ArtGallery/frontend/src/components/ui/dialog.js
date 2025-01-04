import React from "react";
import { Transition } from "@headlessui/react";

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <Transition show={open} as={React.Fragment}>
      {/* Overlay */}
      <Transition.Child
        as="div"
        enter="transition-opacity ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <Transition.Child
        as="div"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};

export const DialogContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="border-b border-gray-200 p-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-medium text-gray-900">{children}</h2>
);

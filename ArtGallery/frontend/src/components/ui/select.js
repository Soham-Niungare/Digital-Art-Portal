import React, { useState } from 'react';

export const Select = ({ children, onValueChange, defaultValue, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleSelect = (newValue) => {
    setValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {children({
        isOpen,
        setIsOpen,
        value,
        handleSelect,
        disabled
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, className, onClick, disabled }) => {
  return (
    <button
      className={`py-2 px-4 border rounded-md ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const SelectContent = ({ children, isOpen }) => {
  return (
    isOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
        <div className="max-h-60 overflow-y-auto">{children}</div>
      </div>
    )
  );
};

export const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({ value, placeholder }) => {
  return <span>{value || placeholder}</span>;
};

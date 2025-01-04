import React from "react";
export const Tabs = ({ children, defaultValue, onChange }) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);
  
    const handleTabClick = (value) => {
      setActiveTab(value);
      if (onChange) onChange(value);
    };
  
    const tabs = React.Children.toArray(children).filter(
      (child) => child.type === TabsTrigger || child.type === TabsContent
    );
  
    const triggers = tabs.filter((tab) => tab.type === TabsTrigger);
    const contents = tabs.filter((tab) => tab.type === TabsContent);
  
    return (
      <div>
        <div className="flex border-b">{triggers.map((trigger) => React.cloneElement(trigger, { activeTab, onClick: handleTabClick }))}</div>
        <div>{contents.map((content) => React.cloneElement(content, { activeTab }))}</div>
      </div>
    );
  };
  
  export const TabsTrigger = ({ value, activeTab, onClick, children }) => {
    const isActive = activeTab === value;
    return (
      <button
        onClick={() => onClick(value)}
        className={classNames(
          "px-4 py-2 font-medium text-sm border-b-2",
          isActive ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500 hover:text-gray-700"
        )}
      >
        {children}
      </button>
    );
  };
  
  export const TabsContent = ({ value, activeTab, children }) => {
    return activeTab === value ? <div className="p-4">{children}</div> : null;
  };
  export const TabsList = ({ children, className = '', ...props }) => {
    return (
      <div
        className={`flex border-b border-gray-200 space-x-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
import React from "react";

const Button = ({ variant = "default", children, onClick }) => {
  const baseStyles = "px-4 py-2 rounded font-medium focus:outline-none";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.default}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

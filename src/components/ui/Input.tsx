import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input = ({ label, error, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-foreground/80 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
          error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;

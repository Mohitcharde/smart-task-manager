"use client";

// --------------------------------------------------
// SMART TASK MANAGER - LOADING COMPONENT
// --------------------------------------------------

import React from "react";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading..."
}) => {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center p-8 text-slate-500"
    >
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

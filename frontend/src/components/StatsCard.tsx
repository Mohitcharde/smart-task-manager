// --------------------------------------------------
// SMART TASK MANAGER - STATS CARD
// --------------------------------------------------

import React from "react";

interface StatsCardProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
  color?: "slate" | "blue" | "amber" | "emerald" | "red";
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  color = "blue",
  onClick
}) => {
  const getColorStyles = () => {
    switch (color) {
      case "emerald":
        return {
          border: "border-emerald-200",
          iconBg: "bg-emerald-50 text-emerald-600",
          text: "text-emerald-700"
        };
      case "amber":
        return {
          border: "border-amber-200",
          iconBg: "bg-amber-50 text-amber-600",
          text: "text-amber-700"
        };
      case "red":
        return {
          border: "border-red-200",
          iconBg: "bg-red-50 text-red-600",
          text: "text-red-700"
        };
      case "slate":
        return {
          border: "border-slate-200",
          iconBg: "bg-slate-100 text-slate-600",
          text: "text-slate-700"
        };
      case "blue":
      default:
        return {
          border: "border-blue-200",
          iconBg: "bg-blue-50 text-blue-600",
          text: "text-blue-700"
        };
    }
  };

  const styles = getColorStyles();

  return (
    <div
      data-testid="stats-card"
      onClick={onClick}
      className={`bg-white rounded-xl border ${styles.border} p-5 shadow-xs transition hover:shadow-sm ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3
            data-testid="stats-count"
            className="text-2xl font-bold text-slate-900 mt-1"
          >
            {count}
          </h3>
        </div>
        {icon && (
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center ${styles.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

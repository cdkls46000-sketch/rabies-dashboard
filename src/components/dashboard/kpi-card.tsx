import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon?: React.ElementType | React.ReactNode;
  colorClass?: string;
  color?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  colorClass = "text-blue-500",
  color = "bg-blue-500",
}: KpiCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  // Determine top/left bar color from color or colorClass
  const barColor = colorClass
    ? colorClass.replace("text-", "bg-")
    : color;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    // Handles React components (functions, forwardRef objects from lucide-react)
    const Component = Icon as React.ElementType;
    return <Component size={20} className={colorClass} />;
  };

  return (
    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${barColor}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3.5 sm:p-5">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-1.5 sm:p-2 rounded-lg bg-gray-50 ${colorClass}`}>
          {renderIcon()}
        </div>
      </CardHeader>
      <CardContent className="p-3.5 sm:p-5 pt-0 sm:pt-0">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-xs mt-1 flex items-center">
          {!isNeutral && (
            <span
              className={`flex items-center mr-1 font-semibold ${
                isPositive ? "text-red-500" : "text-green-500"
              }`}
            >
              {isPositive ? <ArrowUp size={14} className="inline mr-0.5" /> : <ArrowDown size={14} className="inline mr-0.5" />}
              {Math.abs(change)}%
            </span>
          )}
          {isNeutral && <span className="text-gray-400 mr-1 font-medium">-</span>}
          <span className="text-muted-foreground">จากเดือนที่แล้ว</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default KPICard;

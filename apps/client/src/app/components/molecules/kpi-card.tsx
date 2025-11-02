"use client";

import { Card } from "@components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatPrice } from "../../../lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  trend?: number;
  type?: "sale" | "expense" | "profit";
  className?: string;
}

export const KPICard = ({
  title,
  value,
  trend,
  type = "sale",
  className,
}: KPICardProps) => {
  const [amount, setAmount] = useState<number>(0);
  const getTrendColor = () => {
    if (!trend) return "";
    if (type === "expense") {
      return trend > 0 ? "text-destructive" : "text-success";
    }
    return trend > 0 ? "text-success" : "text-destructive";
  };

  useEffect(() => {
    const duration = 700;
    const start = performance.now();

    function update(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setAmount(value * progress);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [value]);

  const getCardStyle = () => {
    switch (type) {
      case "profit":
        return "border-l-4 border-l-success";
      case "expense":
        return "border-l-4 border-l-destructive";
      default:
        return "border-l-4 border-l-primary";
    }
  };

  return (
    <Card
      className={cn(
        `p-6 hover:shadow-lg transition-all duration-300 ${getCardStyle()}`,
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-bold tracking-tight">
            {formatPrice(amount, "FR-fr", "EUR")}
          </h3>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}
            >
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

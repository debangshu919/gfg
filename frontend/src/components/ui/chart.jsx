import React from "react";
import { cn } from "./utils";

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-[450px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background text-foreground",
      className
    )}
    {...props}
  />
));
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background px-3 py-2 text-sm shadow-md",
      className
    )}
    {...props}
  />
));
ChartTooltip.displayName = "ChartTooltip";

const ChartLegend = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-4 text-sm", className)}
    {...props}
  />
));
ChartLegend.displayName = "ChartLegend";

export { ChartContainer, ChartTooltip, ChartLegend };

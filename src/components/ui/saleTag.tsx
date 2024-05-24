import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface SaleTagProps extends HTMLAttributes<HTMLSpanElement> {
  percentage: string;
}

const defaultStyles: string =
  "px-1 py-0 ml-4 border-primary border-[1px] rounded-sm text-primary-foreground bg-primary-softer content-center";

const SaleTag: React.FC<SaleTagProps> = ({ className, ...props }) => {
  return (
    <span className={cn(defaultStyles, className)}>{props.percentage}</span>
  );
};

export default SaleTag;

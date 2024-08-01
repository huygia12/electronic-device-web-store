import React, { HTMLAttributes } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({ className, ...props }) => {
  return (
    <span className="relative">
      <Input
        type="text"
        value={props.value}
        className={cn(
          "text-md focus_border-2 focus_!ring-0 w-[8rem] h-[2.2rem] pr-6",
          className
        )}
      />
      <span className="absolute top-[0.4rem] right-2">đ</span>
    </span>
  );
};

export default MoneyInput;

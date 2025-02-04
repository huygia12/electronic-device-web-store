import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface CounterLabelProps extends HTMLAttributes<HTMLDivElement> {
  counter?: number;
}

const defaultStyle: string =
  "absolute top-[-0.5rem] right-[1.6rem] bg-destructive text-white rounded-full w-fit px-[0.6rem] py-[0.1rem] border-amber-300 border-4 font-[500]";
/***
 * Container of this must set position to relative
 */
const CounterLabel: React.FC<CounterLabelProps> = ({ className, ...props }) => {
  return <span className={cn(defaultStyle, className)}>{props.counter}</span>;
};

export default CounterLabel;

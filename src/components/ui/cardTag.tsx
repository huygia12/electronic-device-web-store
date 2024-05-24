import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface CardTagProps extends HTMLAttributes<HTMLSpanElement> {
  content: string;
}

const defaultStyles: string =
  "flex flex-row items-center mr-[1rem] mb-[0.2rem]";

const CardTag: React.FC<CardTagProps> = ({ className, ...props }) => {
  return (
    <span className={cn(defaultStyles, className)}>
      {props.children}
      <span className="ml-1 truncate ...">{props.content}</span>
    </span>
  );
};

export default CardTag;

import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import React, { HTMLAttributes } from "react";

interface CardTagProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

const CardTag: React.FC<CardTagProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-row w-full mb-auto contain-content items-center justify-start",
        className
      )}
      {...props}
    >
      <span className="ml-5 flex text-[0.8rem] relative">
        <Dot size={30} className="absolute left-[-1.5rem] top-[-0.3rem]" />
        {props.content}
      </span>
    </div>
  );
};

export default CardTag;

import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import React, { HTMLAttributes } from "react";

interface CardTagProps extends HTMLAttributes<HTMLDivElement> {
  type: string;
  content: string;
}

const CardTag: React.FC<CardTagProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-row w-full items-center relative justify-start",
        className
      )}
    >
      <span className="ml-5 flex text-[0.8rem]">
        <Dot size={30} className=" absolute left-[-0.3rem] top-[-0.3rem]" />
        {props.type + ": " + props.content + "."}
      </span>
    </div>
  );
};

export default CardTag;

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { RiStarSFill } from "react-icons/ri";

interface RatingPointProps extends HTMLAttributes<HTMLSpanElement> {
  rate: number;
  iconSize: number;
}

const RatingPoint: React.FC<RatingPointProps> = ({ className, ...props }) => {
  return (
    <span className={cn("flex flex-row items-center", className)}>
      <span>{props.rate}</span>
      <RiStarSFill size={props.iconSize} />
    </span>
  );
};

export default RatingPoint;

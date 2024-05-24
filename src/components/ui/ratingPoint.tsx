import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { RiStarSFill } from "react-icons/ri";

interface RatingPointProps extends HTMLAttributes<HTMLDivElement> {
  rate: number;
  iconSize: number;
}

const defaultStyles: string = "flex flex-row items-center";

const RatingPoint: React.FC<RatingPointProps> = ({ className, ...props }) => {
  return (
    <div className={cn(defaultStyles, className)}>
      <span>{props.rate}</span>
      <RiStarSFill size={props.iconSize} />
    </div>
  );
};

export default RatingPoint;

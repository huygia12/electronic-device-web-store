import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  rating: number;
  stars?: number;
  handleRateChange?: (rating: number) => void;
  disabled?: boolean;
  starCss?: string;
}

const StarRating: FC<StarRatingProps> = ({
  className,
  stars = 5,
  disabled = false,
  ...props
}) => {
  return (
    <div className={cn("flex gap-2 text-secondary-foreground", className)}>
      {Array.from({ length: stars }).map((_, index) => (
        <Star
          key={index}
          onClick={() =>
            disabled &&
            props.handleRateChange &&
            props.handleRateChange(index + 1)
          }
          className={cn(
            `${index < props.rating && `fill-yellow-400 stroke-yellow-400`}`,
            props.handleRateChange && `cursor-pointer`,
            props.starCss
          )}
        />
      ))}
    </div>
  );
};

export default StarRating;

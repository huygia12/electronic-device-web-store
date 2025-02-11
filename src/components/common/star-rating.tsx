import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  rating: number;
  stars?: number;
  handleRateChange?: (rating: number) => void;
  disabled?: boolean;
}

const StarRating: FC<StarRatingProps> = ({
  stars = 5,
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex space-x-2 text-secondary-foreground">
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
            props.handleRateChange && `cursor-pointer`
          )}
        />
      ))}
    </div>
  );
};

export default StarRating;

import { HTMLAttributes } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BaseSkeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <Skeleton
      className={cn(
        "h-6 w-4/5 rounded-md mx-auto bg-slate-200 mt-4",
        className
      )}
      {...props}
    />
  );
};

interface LinesSkeletonProps extends HTMLAttributes<HTMLUListElement> {
  quantity: number;
}

const LinesSkeleton: React.FC<LinesSkeletonProps> = ({
  className,
  ...props
}) => {
  return (
    <ul className={className} {...props}>
      {Array.from({ length: props.quantity }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-6 w-4/5 rounded-md mx-auto bg-slate-200 mt-4"
        />
      ))}
    </ul>
  );
};

const CardSkeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <Card
      className={cn(
        "shadow-xl w-full transition ease-out duration-300 hover_scale-105 relative flex flex-col justify-between h-full",
        className
      )}
      {...props}
    >
      <BaseSkeleton className="w-full rounded-none h-[18rem] mt-0" />
      <CardHeader className="p-1.5 mt-20">
        <CardTitle className="text-[1.1rem] hover_underline hover_text-primary-foreground">
          <BaseSkeleton className="w-5/6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <BaseSkeleton className="w-full h-[5rem]" />
        <BaseSkeleton className="w-full" />
        <div className="w-full flex justify-between">
          <BaseSkeleton className="w-1/5 mx-0" />
          <BaseSkeleton className="w-3/5 mx-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export { BaseSkeleton, LinesSkeleton, CardSkeleton };

import { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BannerImgProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  link: string;
}

const BannerImg: React.FC<BannerImgProps> = ({ className, ...props }) => {
  return (
    <NavLink
      to={props.link}
      className={cn(
        "relative shadow-neutral-500 shadow-md rounded-xl",
        className
      )}
      unstable_viewTransition
    >
      <img
        src={props.src}
        alt={props.alt}
        className={cn("rounded-xl w-full h-full object-fill", className)}
      />
      {/** animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-[150%] h-[20%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20 animate-sweep overflow-hidden" />
      </div>
    </NavLink>
  );
};

export default BannerImg;

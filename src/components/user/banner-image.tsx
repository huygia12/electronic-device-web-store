import { HTMLAttributes } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
        " h-[13.1rem] w-full shadow-neutral-500 shadow-md rounded-xl",
        className
      )}
      unstable_viewTransition
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={props.src}
          alt={props.alt}
          className="rounded-xl h-[210px] w-full object-fill"
        />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-[150%] h-[20%] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-20 animate-sweep"></div>
        </div>
      </AspectRatio>
    </NavLink>
  );
};

export default BannerImg;

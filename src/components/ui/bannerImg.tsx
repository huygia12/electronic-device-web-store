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
        " h-[13.1rem] w-[23.2rem] shadow-neutral-500 shadow-md rounded-xl",
        className
      )}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={props.src}
          alt={props.alt}
          className="rounded-xl h-[210px] object-fill"
        />
      </AspectRatio>
    </NavLink>
  );
};

export default BannerImg;

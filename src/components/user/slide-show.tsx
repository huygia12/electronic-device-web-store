import React, { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { CarouselItem } from "@/components/ui/carousel";
import CustomImage from "@/components/common/custom-image";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  link?: string;
}

const SlideShow: React.FC<SlideShowProps> = ({ className, ...props }) => {
  return (
    <CarouselItem className={className}>
      <NavLink to={props.link ?? "#"} unstable_viewTransition>
        <CustomImage
          src={props.src}
          alt={props.alt}
          className="h-[27rem] w-max object-fill rounded-xl mx-auto"
        />
      </NavLink>
    </CarouselItem>
  );
};

export default SlideShow;

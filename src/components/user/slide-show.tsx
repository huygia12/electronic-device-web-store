import React, { HTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { CarouselItem } from "../ui/carousel";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  link?: string;
}

const SlideShow: React.FC<SlideShowProps> = ({ className, ...props }) => {
  return (
    <CarouselItem className="">
      <NavLink to={props.link ?? "#"} unstable_viewTransition>
        <img
          src={props.src}
          alt={props.alt}
          className="h-[27rem] w-max object-fill rounded-xl mx-auto"
        />
      </NavLink>
    </CarouselItem>
  );
};

export default SlideShow;

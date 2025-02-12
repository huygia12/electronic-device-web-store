import React, { HTMLAttributes } from "react";
import { CarouselItem } from "@/components/ui/carousel";
import LazyImage from "@/components/common/lazy-image";
import { useCustomNavigate } from "@/hooks";
import { cn } from "@/lib/utils";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  imageCss?: string;
  link?: string;
}

const SlideShow: React.FC<SlideShowProps> = ({ className, ...props }) => {
  const { navigate } = useCustomNavigate();

  return (
    <CarouselItem className={cn("overflow-hidden", className)}>
      <LazyImage
        src={props.src}
        onClick={() =>
          props.link && navigate(props.link, { unstable_viewTransition: true })
        }
        alt={props.alt}
        className={cn("object-fill rounded-xl mx-auto", props.imageCss)}
      />
    </CarouselItem>
  );
};

export default SlideShow;

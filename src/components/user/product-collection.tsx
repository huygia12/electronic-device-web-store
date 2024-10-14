import React, { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCustomNavigate } from "@/hooks";

interface CollectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  url: string;
  title: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  className,
  ...props
}) => {
  const { navigate } = useCustomNavigate();

  return (
    <div className="flex flex-row items-center justify-between">
      <span className="text-[1.8rem] font-extrabold border-l-primary border-l-4 pl-2">
        {props.title}
      </span>
      <span className="flex items-center">
        <span className="flex space-x-2">{props.children}</span>
        <Button
          onClick={() => navigate(props.url)}
          variant="negative"
          className="flex flex-row items-center h-8 ml-[2rem]"
        >
          Xem tất cả &nbsp; <FaArrowRightLong />
        </Button>
      </span>
    </div>
  );
};

const ProductCollection: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.play}
      className="px-6"
    >
      <CarouselContent className="px-2 pb-6 pt-4">
        {props.children}
      </CarouselContent>
      <CarouselPrevious className=" top-[18rem] left-[0rem] h-[8rem] w-5 bg-primary rounded-r-sm hover_border-red-500" />
      <CarouselNext className="top-[18rem] right-0 h-[8rem] w-5 bg-primary rounded-s-sm hover_border-red-500" />
    </Carousel>
  );
};

export { CollectionHeader, ProductCollection };

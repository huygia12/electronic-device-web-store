import { BannerImage, SlideShow } from "@/components/user";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FC, HTMLAttributes, useRef } from "react";
import { Slide } from "@/types/model";
import { ImageToSlide } from "@/types/payload";
import { cn } from "@/lib/utils";

interface BannerSectionProps extends HTMLAttributes<HTMLDivElement> {
  slides: (Slide | ImageToSlide)[];
  disableNavigation?: boolean;
}

const BannerSection: FC<BannerSectionProps> = ({
  disableNavigation = false,
  ...props
}) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div
      className={cn(
        "grid grid-cols-2 auto-rows-min gap-3 md_grid-cols-3",
        props.className
      )}
    >
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        className="col-span-2 row-span-2 rounded-xl shadow-neutral-500 shadow-md h-fit"
      >
        <CarouselContent className="h-fit">
          {props.slides.map((item, index) => {
            return (
              <SlideShow
                key={index}
                src={item.url}
                alt={item.url}
                link={!disableNavigation && item.ref ? item.ref : undefined}
                className={cn(
                  "h-[14.8rem] lg_h-[18.8rem] 4xl_h-[22.8rem]",
                  item.ref && "cursor-pointer"
                )}
                imageCss="h-full w-full"
              />
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="z-10 top-[50%] left-[1rem] bg-transparent size-10 lgg_size-12" />
        <CarouselNext className="z-10 top-[50%] right-[1rem] bg-transparent size-10 lgg_size-12" />
      </Carousel>

      {Array.from({ length: 2 }).map((_, index) => {
        return (
          <BannerImage
            key={index + 1}
            src={`/banner${index + 1}.jpg`}
            alt={`banner${index + 1}`}
            link="/products"
            className="h-[7rem] lg_h-[9rem] 4xl_h-[11rem]"
          />
        );
      })}
      <div className="grid grid-cols-3 gap-3 col-span-2 md_col-span-3">
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <BannerImage
              key={index + 3}
              src={`/banner${index + 3}.jpg`}
              alt={`banner${index + 3}`}
              link="/products"
              className="h-[5rem] lg_h-[9rem] 4xl_h-[11rem]"
            />
          );
        })}
      </div>
    </div>
  );
};

export default BannerSection;

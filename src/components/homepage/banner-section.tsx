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
import { SlideInsertionPayload } from "@/types/payload";
import { cn } from "@/lib/utils";

interface BannerSectionProps extends HTMLAttributes<HTMLDivElement> {
  slides: (Slide | SlideInsertionPayload)[];
  disableNavigation?: boolean;
}

const BannerSection: FC<BannerSectionProps> = ({
  disableNavigation = false,
  ...props
}) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className={cn("grid grid-cols-3 gap-3", props.className)}>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        className="col-span-2 row-span-2 rounded-xl shadow-neutral-500 shadow-md"
      >
        <CarouselContent>
          {props.slides.map((item, index) => {
            return (
              <SlideShow
                key={index}
                src={item.url}
                alt={item.url}
                link={!disableNavigation && item.ref ? item.ref : undefined}
                className="h-full"
                imageCss="h-[20.8rem] 4xl_h-[24.8rem]"
              />
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="z-10 top-[50%] left-[1rem] bg-transparent h-[3rem] w-[3rem]" />
        <CarouselNext className="z-10 top-[50%] right-[1rem] bg-transparent h-[3rem] w-[3rem]" />
      </Carousel>
      <BannerImage src="/banner1.jpg" alt="banner1" link="/products" />
      <BannerImage src="/banner2.jpg" alt="banner2" link="/products" />
      <BannerImage src="/banner3.jpg" alt="banner3" link="/products" />
      <BannerImage src="/banner4.jpg" alt="banner4" link="/products" />
      <BannerImage src="/banner5.jpg" alt="banner5" link="/products" />
    </div>
  );
};

export default BannerSection;

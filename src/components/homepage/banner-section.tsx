import { BannerImage, SlideShow } from "@/components/user";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { slides } from "@/pages/data";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const BannerSection = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="grid grid-cols-3 gap-3 w-5/6">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        className="w-full col-span-2 row-span-2 rounded-xl shadow-neutral-500 shadow-md"
      >
        <CarouselContent>
          {slides.map((item, index) => {
            return (
              <SlideShow
                src={item.src}
                alt={item.alt}
                key={index}
                link={item.link}
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

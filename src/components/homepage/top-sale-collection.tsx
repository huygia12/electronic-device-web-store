import { FC, HTMLAttributes, useRef } from "react";
import { Product } from "@/types/model";
import { CardSkeleton } from "@/components/common";
import { NavLink } from "react-router-dom";
import { RippleEffect } from "@/components/effect";
import { ArrowRight } from "lucide-react";
import CardProduct from "@/components/user/product-card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface TopSaleCollectionProps extends HTMLAttributes<HTMLDivElement> {
  to: string;
  headerTitle: string;
  products: Product[] | undefined;
}

const TopSaleCollection: FC<TopSaleCollectionProps> = ({ ...props }) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  if (props.products && props.products.length === 0) return;

  return (
    <div className={cn("bg-theme-softer rounded-xl", props.className)}>
      <div className="px-2 md_px-6 flex pt-5 gap-2 text-lg md_text-xl mlg_text-2xl items-center space-x-2 font-extrabold text-primary-foreground">
        <RippleEffect /> {props.headerTitle}
      </div>
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        className="px-6 items-center mt-10 sm_mt-0"
      >
        <CarouselContent className="px-2 pb-6 pt-4 relative">
          {props.products
            ? props.products.map((product, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sms_basis-1/3 md_basis-1/4 3xl_basis-1/5"
                >
                  <CardProduct product={product} className="shadow-none" />
                </CarouselItem>
              ))
            : Array.from({ length: 20 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sms_basis-1/3 md_basis-1/4 3xl_basis-1/5"
                >
                  <CardSkeleton />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious className="top-[-1.3rem] left-[66%] xss_left-[70%] xs_left-[77%] sms_left-[77%] sm_left-[82%] md_left-[83%] mlg_left-[85%] lgg_left-[87%] 2xl_left-[89%] 4xl_left-[91%] w-10 bg-primary border-2 border-red-600" />
        <CarouselNext className="top-[-1.3rem] right-[2rem] w-10 bg-primary border-2 border-red-600" />
      </Carousel>
      <div className="pb-6 w-full flex items-center justify-around text-sm md_text-base">
        <NavLink
          to={props.to}
          className="bg-white p-2 px-4 content-center rounded-md flex items-center transition ease-in duration-200 hover_bg-theme"
        >
          <span className="hidden xss_inline"> Xem tất cả </span>
          <span> &nbsp; ⚡ KHUYẾN MẠI SHOCK NHẤT</span>
          <ArrowRight className="ml-2 font-light size-4 md_size-6" />
        </NavLink>
      </div>
    </div>
  );
};

export default TopSaleCollection;

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SlideShow } from "@/components/user";
import { FC, HTMLAttributes, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Product, ProductItem } from "@/types/model";
import { BadgeCheck, Truck } from "lucide-react";
import { ProductTechnicalInfo } from ".";

interface LeftProductDetailSectionProps
  extends HTMLAttributes<HTMLHeadElement> {
  product: Product;
  currentItem: ProductItem;
}

const LeftProductDetailSection: FC<LeftProductDetailSectionProps> = ({
  ...props
}) => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <section className="flex flex-col justify-center">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        className="w-fit mx-auto"
      >
        <CarouselContent className="h-full">
          {props.currentItem.itemImages.map((image, index) => {
            return (
              <SlideShow
                src={image.source}
                key={index}
                alt={image.imageID}
                imageCss="h-full max-h-[70vh]"
              />
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="z-10 top-[50%] left-1 size-8 sm_size-10 lgg_size-12 bg-transparent !text-gray-500" />
        <CarouselNext className="z-10 top-[50%] right-1 size-8 sm_size-10 lgg_size-12 bg-transparent !text-gray-500" />
      </Carousel>

      <div className="mt-10 flex gap-4 flex-col xl_flex-row">
        <span className="flex items-center text-[0.8rem]">
          <BadgeCheck className="text-primary mr-2" />
          Hàng chính hãng - Bảo hành {props.product.warranty} tháng
        </span>
        <span className="flex items-center text-[0.8rem]">
          <Truck className="text-primary mr-2" />
          Miễn phí vận chuyển với đơn hàng trên 500k
        </span>
      </div>

      <ProductTechnicalInfo product={props.product} />
    </section>
  );
};

export default LeftProductDetailSection;

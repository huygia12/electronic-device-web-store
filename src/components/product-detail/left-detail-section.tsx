import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SlideShow } from "@/components/user";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FC, HTMLAttributes, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ProductFullJoin, ProductItem } from "@/types/model";
import { BadgeCheck, Truck } from "lucide-react";

interface LeftProductDetailSectionProps
  extends HTMLAttributes<HTMLHeadElement> {
  product: ProductFullJoin;
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
        className="w-[40rem] min-h-[25rem] mb-16"
      >
        <CarouselContent>
          {props.currentItem.itemImages.map((image, index) => {
            return (
              <SlideShow src={image.source} key={index} alt={image.itemID} />
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="z-10 top-[13rem] left-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
        <CarouselNext className="z-10 top-[13rem] right-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
      </Carousel>

      <div className="mb-8 flex ml-4">
        <span className="flex items-center text-[0.8rem] mr-10">
          <BadgeCheck className="text-primary mr-2" />
          Hàng chính hãng - Bảo hành {props.product.warranty} tháng
        </span>
        <span className="flex items-center text-[0.8rem]">
          <Truck className="text-primary mr-2" />
          Miễn phí vận chuyển với đơn hàng trên 500k
        </span>
      </div>

      <div className="border-slate-100 border-2 rounded-xl shadow-lg p-4">
        <h5 className="font-semibold text-[1.2rem] py-4">Thông số thiết bị</h5>
        <Table className="border-2 border-slate-200">
          <TableBody>
            {props.product.productAttributes.map((attr, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {attr.attributeOption.attributeType.typeValue}
                </TableCell>
                <TableCell>{attr.attributeOption.optionValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default LeftProductDetailSection;

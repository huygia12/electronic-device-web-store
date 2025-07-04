import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SaleTag from "@/components/ui/saleTag";
import React, { HTMLAttributes, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Product, ProductItem } from "@/types/model";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Coins, ShoppingBasket } from "lucide-react";
import { ProductDialog } from ".";
import CardTag from "@/components/ui/cardTag";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { LazyImage } from "@/components/common";
import { applyDiscount, isDiscount } from "@/utils/helpers";
import { useCustomNavigate } from "@/hooks";

interface CardProductProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const CardProduct: React.FC<CardProductProps> = ({ className, ...props }) => {
  const { navigate } = useCustomNavigate();
  const currentItem = useMemo<ProductItem>(
    () => props.product.productItems[0],
    [props.product]
  );

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(
      `/cart/checkout?productID=${props.product.productID}&itemID=${props.product.productItems[0].itemID}&quantity=${1}`,
      { unstable_viewTransition: true }
    );
  };

  return (
    <Card
      className={cn(
        "p-0 xss_p-1 md_p-2.5 shadow-md transition ease-out duration-300 hover_scale-105 relative flex flex-col justify-between h-full",
        className
      )}
    >
      <NavLink
        to={"/products/" + props.product.productID}
        unstable_viewTransition
      >
        <div className="pt-2 h-fit">
          <LazyImage
            src={currentItem.thump}
            alt={currentItem.itemID}
            className="h-[5rem] xss_h-[7rem] md_h-[10rem] 4xl_h-[12rem] m-auto"
          />
        </div>
        <CardHeader className="px-1.5 !space-y-0 !py-0 mt-3">
          <CardTitle className="text-sm md_text-base hover_underline hover_text-primary-foreground line-clamp-2">
            {props.product.productName}
          </CardTitle>
        </CardHeader>
      </NavLink>

      <CardContent className="p-1">
        <ScrollArea className="py-1 pr-1 shadow-inner rounded-sm bg-secondary flex flex-wrap max-h-[6rem] h-[3rem] md_h-[4rem] overflow-y-auto">
          {props.product.productAttributes.map((attr, index) => {
            return (
              <CardTag
                key={index}
                content={`${attr.attributeOption.attributeType.typeValue}: ${attr.attributeOption.optionValue}.`}
                className="text-[0.7rem] md_text-sm"
              />
            );
          })}
        </ScrollArea>
        <div className="mt-2 flex flex-row flex-wrap items-baseline justify-between">
          <div className="text-base md_text-[1.3rem] font-extrabold text-primary-foreground truncate ...">
            {`${applyDiscount(
              currentItem.price,
              currentItem.discount
            ).toLocaleString()}đ`}
          </div>
          {isDiscount(currentItem.discount) && (
            <del className="text-xs md_text-[0.8rem] text-secondary-foreground">
              {`${currentItem.price.toLocaleString()}đ`}
            </del>
          )}
        </div>
        {isDiscount(currentItem.discount) && (
          <SaleTag
            percentage={`-${currentItem.discount}%`}
            className="absolute top-0 left-[-1rem]"
          />
        )}
        <div className="w-full flex items-center gap-1 2xl_justify-between mt-2">
          <ProductDialog product={props.product}>
            <Button variant="neutral" className="w-1/4 !py-0 !px-2">
              <ShoppingBasket />
            </Button>
          </ProductDialog>
          <Button
            variant="negative"
            className="text-[0.6rem] xss_text-xs md_text-base w-3/4 flex gap-1 items-center !py-0 !px-2"
            onClick={(e) => handleBuyClick(e)}
          >
            <Coins />
            Mua ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardProduct;

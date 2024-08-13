import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SaleTag from "../ui/saleTag";
import React, { HTMLAttributes, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ProductFullJoin, ProductItem } from "@/types/api";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import { Coins, ShoppingBasket } from "lucide-react";
import productService from "@/utils/product";
import { ProductDialog } from ".";
import CardTag from "../ui/cardTag";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CustomImage } from "../common";

interface CardProductProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductFullJoin;
}

const CardProduct: React.FC<CardProductProps> = ({ className, ...props }) => {
  const currentItem = useMemo<ProductItem>(
    () => props.product.productItems[0],
    [props.product]
  );

  return (
    <Card
      className={cn(
        "p-2.5 shadow-xl transition ease-out duration-300 hover_scale-105 relative flex flex-col justify-between h-full",
        className
      )}
    >
      <NavLink
        to={"/products/" + props.product.productID}
        unstable_viewTransition
      >
        <div className="h-[15rem] mb-10z">
          <CustomImage src={currentItem.thump} alt={currentItem.itemID} />
        </div>
        <CardHeader className="p-1.5 mt-2">
          <CardTitle className="text-[1rem] hover_underline hover_text-primary-foreground">
            {props.product.productName}
          </CardTitle>
        </CardHeader>
      </NavLink>
      <CardContent className="p-2">
        <ScrollArea className="mb-5 py-1 pr-1 shadow-inner rounded-sm bg-secondary flex flex-wrap max-h-[7rem] h-[5rem] overflow-y-auto">
          {props.product.productAttributes.map((attr, index) => {
            return (
              <CardTag
                key={index}
                content={
                  attr.attributeOption.attributeType.typeValue +
                  ": " +
                  attr.attributeOption.optionValue +
                  "."
                }
              />
            );
          })}
        </ScrollArea>
        <div className="flex flex-row flex-wrap items-baseline justify-between">
          <div className="text-[1.3rem] font-extrabold text-primary-foreground truncate ...">
            {`${productService
              .afterDiscount(currentItem.price, currentItem.discount)
              .toLocaleString()}đ`}
          </div>
          {productService.isDiscount(currentItem.discount) && (
            <del className="text-[0.8rem] text-secondary-foreground">
              {`${currentItem.price.toLocaleString()}đ`}
            </del>
          )}
        </div>
        {currentItem.discount && (
          <SaleTag
            percentage={`-${currentItem.discount}%`}
            className="absolute top-0 left-[-1rem]"
          />
        )}
        <div className="w-full flex items-center justify-around mt-4">
          <ProductDialog product={props.product}>
            <Button variant="neutral" onClick={() => {}}>
              <ShoppingBasket />
            </Button>
          </ProductDialog>
          <Button variant="negative" className="flex gap-2 items-center">
            <Coins />
            Mua ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardProduct;

import SaleTag from "@/components/ui/saleTag";
import React, { HTMLAttributes, useMemo } from "react";
import { Product, ProductItem } from "@/types/model";
import { NavLink } from "react-router-dom";
import { LazyImage } from "@/components/common";
import { applyDiscount, isDiscount } from "@/utils/helpers";

interface HorizontalProductCardProps extends HTMLAttributes<HTMLDivElement> {
  key: number;
  product: Product;
}

const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  className,
  ...props
}) => {
  const currentItem = useMemo<ProductItem>(
    () => props.product.productItems[0],
    [props.product]
  );

  return (
    <NavLink
      to={"/products/" + props.product.productID}
      unstable_viewTransition
      className="grid grid-cols-2 w-full relative"
    >
      <LazyImage
        src={currentItem.thump}
        alt={currentItem.itemID}
        className="h-[5rem] md_h-[8rem] justify-self-center align-self-center"
      />
      <div className="pr-2 lgg_pr-10">
        <h2 className="text-base md_text-lg line-clamp-3">
          {props.product.productName}
        </h2>
        <div className="flex flex-row flex-wrap items-baseline justify-between">
          <div className="mt-2">
            <div className="text-lg md_text-[1.3rem] font-extrabold text-primary-foreground truncate ...">
              {`${applyDiscount(
                currentItem.price,
                currentItem.discount
              ).toLocaleString()}đ`}
            </div>
            {isDiscount(currentItem.discount) && (
              <del className="text-sm md_text-[0.8rem] text-secondary-foreground">
                {`${currentItem.price.toLocaleString()}đ`}
              </del>
            )}
          </div>
          {isDiscount(currentItem.discount) && (
            <SaleTag
              percentage={`-${currentItem.discount}%`}
              className="absolute -top-2 left-0 2xl_static"
            />
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default HorizontalProductCard;

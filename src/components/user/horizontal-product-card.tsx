import SaleTag from "@/components/ui/saleTag";
import React, { HTMLAttributes, useMemo } from "react";
import { Product, ProductItem } from "@/types/model";
import { NavLink } from "react-router-dom";
import { CustomImage } from "@/components/common";
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
      className="grid grid-cols-2 w-full"
    >
      <CustomImage
        src={currentItem.thump}
        alt={currentItem.itemID}
        className="h-[8rem] justify-self-center align-self-center"
      />
      <div className="pr-10">
        <h2 className="text-lg line-clamp-3">{props.product.productName}</h2>
        <div className="flex flex-row flex-wrap items-baseline justify-between">
          <div className="mt-2">
            <div className="text-[1.3rem] font-extrabold text-primary-foreground truncate ...">
              {`${applyDiscount(
                currentItem.price,
                currentItem.discount
              ).toLocaleString()}đ`}
            </div>
            {isDiscount(currentItem.discount) && (
              <del className="text-[0.8rem] text-secondary-foreground">
                {`${currentItem.price.toLocaleString()}đ`}
              </del>
            )}
          </div>
          {isDiscount(currentItem.discount) && (
            <SaleTag percentage={`-${currentItem.discount}%`} />
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default HorizontalProductCard;

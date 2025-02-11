import { Product, ProductItem, ReviewFullJoin } from "@/types/model";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { RatingPoint } from "../user";

interface ProductDetailHeaderProps extends HTMLAttributes<HTMLHeadElement> {
  product: Product;
  currentItem: ProductItem;
  reviews: ReviewFullJoin[];
}

const ProductDetailHeader: FC<ProductDetailHeaderProps> = ({ ...props }) => {
  const [averageRatingPoint, setAverageRatingPoint] = useState<
    number | undefined
  >();
  useEffect(() => {
    const sumRatingPoint = props.reviews.reduce(
      (sum, review) => sum + (review.rating ?? 0),
      0
    );
    setAverageRatingPoint(sumRatingPoint / props.reviews.length);
  }, [props.reviews]);

  return (
    <header className="border-b-2 border-b-slate-200 flex items-baseline justify-between mb-10">
      <span className="flex pb-4 gap-2 items-baseline">
        <h1 className="text-xl md_text-2xl font-bold">
          {props.product.productName}
        </h1>
        <span className=" text-slate-500 text-[0.8rem]">{`(No.${props.currentItem.productCode})`}</span>
      </span>
      <span className="flex items-baseline space-x-2">
        {props.reviews && averageRatingPoint ? (
          <>
            <RatingPoint
              rate={averageRatingPoint}
              iconSize={18}
              className="text-yellow-500"
            />
            <span className="text-sm cursor-pointer hover_underline truncate ...">
              {`${props.reviews.length} đánh giá`}
            </span>
          </>
        ) : undefined}
      </span>
    </header>
  );
};

export default ProductDetailHeader;

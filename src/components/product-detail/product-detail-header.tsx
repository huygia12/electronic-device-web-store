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
    <header className="border-b-2 pb-4 border-b-slate-200 flex items-baseline justify-between flex-col lg_flex-row">
      <h1 className="text-xl md_text-2xl font-bold">
        {props.product.productName}
        <span className="ml-2 mr-auto text-slate-500 text-[0.8rem]">{`(No.${props.currentItem.productCode})`}</span>
      </h1>

      {/** AVERAGE RATING POINT */}
      <span className="flex items-baseline space-x-2 self-end">
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

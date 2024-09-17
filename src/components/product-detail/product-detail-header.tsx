import { ProductFullJoin, ProductItem } from "@/types/model";
import { FC, HTMLAttributes } from "react";

interface ProductDetailHeaderProps extends HTMLAttributes<HTMLHeadElement> {
  product: ProductFullJoin;
  currentItem: ProductItem;
}

const ProductDetailHeader: FC<ProductDetailHeaderProps> = ({ ...props }) => {
  return (
    <header className="border-b-2 border-b-slate-200 flex items-baseline justify-between mb-10">
      <span className="flex pb-4 gap-2 items-baseline">
        <h1 className="text-3xl font-bold">{props.product.productName}</h1>
        <span className=" text-slate-500 text-[0.8rem]">{`(No.${props.currentItem.productCode})`}</span>
      </span>
      {/* <span className="flex items-baseline space-x-2">
              <RatingPoint
                rate={getAverageRatingPoint(productData)}
                iconSize={18}
                className="text-yellow-500"
              />
              <span className="text-sm cursor-pointer hover_underline truncate ...">
                {`${productData.reviews.length} đánh giá`}
              </span>
            </span> */}
    </header>
  );
};

export default ProductDetailHeader;

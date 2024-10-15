import { cn } from "@/lib/utils";
import { ProductFullJoin } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { CardSkeleton } from "@/components/common";
import { ProductCard } from "@/components/user";

interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: ProductFullJoin[] | undefined;
}

const ProductList: FC<ProductListProps> = ({ ...props }) => {
  return (
    <div
      className={cn(
        "col-span-3 grid grid-cols-4 gap-4",
        props.products &&
          props.products.length === 0 &&
          "flex flex-col items-center"
      )}
    >
      {props.products ? (
        props.products.length > 0 ? (
          props.products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <>
            <img width={500} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-xl font-medium text-slate-500 mb-10">
              Chưa có sản phẩm nào!
            </span>
          </>
        )
      ) : (
        Array.from({ length: 16 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))
      )}
    </div>
  );
};

export default ProductList;

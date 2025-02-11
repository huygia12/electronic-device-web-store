import { cn } from "@/lib/utils";
import { Product } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { CardSkeleton } from "@/components/common";
import { ProductCard } from "@/components/user";

interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Product[] | undefined;
}

const ProductList: FC<ProductListProps> = ({ ...props }) => {
  return (
    <div
      className={cn(
        "grid gap-2 md_gap-4 grid-cols-1 sms_grid-cols-2 lg_grid-cols-3 4xl_grid-cols-4",
        props.products &&
          props.products.length === 0 &&
          "flex flex-col items-center",
        props.className
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

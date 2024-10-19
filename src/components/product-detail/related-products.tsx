import { HorizontalProductCard } from "@/components/user";
import { FC, HTMLAttributes } from "react";
import { Product } from "@/types/model";
import { cn } from "@/lib/utils";

interface RelatedProducts extends HTMLAttributes<HTMLDivElement> {
  products: Product[] | undefined;
}

const RelatedProducts: FC<RelatedProducts> = ({ ...props }) => {
  if (!props.products || props.products.length === 0) return;

  return (
    <div
      className={cn(
        "border-slate-100 border-2 rounded-xl shadow-lg p-8",
        props.className
      )}
    >
      <h5 className="font-semibold text-[1.4rem] mb-4">Sản phẩm tương tự</h5>
      <div className="flex flex-col items-center gap-8 mt-4">
        {props.products.map((product, index) => (
          <HorizontalProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

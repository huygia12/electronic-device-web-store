import {
  CollectionHeader,
  ProductCard,
  ProductCollection,
} from "@/components/user";
import { CarouselItem } from "@/components/ui/carousel";
import { FC, HTMLAttributes } from "react";
import { Product } from "@/types/model";
import { CardSkeleton } from "@/components/common";

interface NormalCollectionProps extends HTMLAttributes<HTMLDivElement> {
  to: string;
  headerTitle: string;
  products: Product[] | undefined;
}

const NormalCollection: FC<NormalCollectionProps> = ({ ...props }) => {
  if (props.products && props.products.length === 0) return;

  return (
    <div className={props.className}>
      <CollectionHeader url={props.to} title={props.headerTitle} />
      <ProductCollection>
        {props.products
          ? props.products.map((product, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 md_basis-1/4 4xl_basis-1/5"
              >
                <ProductCard product={product} className="" />
              </CarouselItem>
            ))
          : Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 md_basis-1/4 4xl_basis-1/5"
              >
                <CardSkeleton />
              </CarouselItem>
            ))}
      </ProductCollection>
    </div>
  );
};

export default NormalCollection;

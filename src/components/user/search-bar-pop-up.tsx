import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/effect";
import { productService } from "@/services";
import { ProductSummary } from "@/types/payload";
import { useCustomNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { applyDiscount, isDiscount } from "@/utils/helpers";

const SearchBarPopUp: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const searchingDelay = useRef<number>(500);
  const [seachText, setSearchText] = useState<string>();
  const [products, setProducts] = useState<ProductSummary[]>();
  const { navigate } = useCustomNavigate();
  const [productsVisibility, setProductsVisibility] = useState(false);
  const [typing, setTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideOfSearchInput);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideOfSearchInput
      );
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const res: { products: ProductSummary[] } =
        await productService.apis.getProductsSummary({
          searching: seachText,
        });

      setProducts(res.products);
      setTyping(false);
      if (seachText) {
        setProductsVisibility(true);
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [seachText]);

  const handleProductClick = (productID: string) => {
    navigate(`/products/${productID}`, {
      unstable_viewTransition: true,
    });
    setProductsVisibility(false);
  };

  const handleClickOutsideOfSearchInput = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setProductsVisibility(false);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    !typing && setTyping(true);
    setSearchText(event.target.value);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-fit my-auto", props.className)}
    >
      <Search
        onClick={() => setProductsVisibility((prevValue) => !prevValue)}
        className=" bg-white rounded-full p-2 size-10 text-muted-foreground border-2 border-primary"
      />
      {productsVisibility && (
        <div className="absolute h-10 top-12 right-1/2 transform translate-x-1/2">
          <Input
            placeholder="Tìm kiếm..."
            onChange={(e) => handleSearchInputChange(e)}
            className="h-full text-xl placeholder_italic w-[60vw] rounded-lg bg-background shadow-general"
          />
          {typing && (
            <LoadingSpinner
              size={22}
              className="text-muted-foreground absolute top-0 bottom-0 right-3 m-auto"
            />
          )}
        </div>
      )}
      {products &&
        productsVisibility &&
        !typing &&
        (products.length > 0 ? (
          <ul className="absolute flex flex-wrap gap-2 top-24 right-1/2 transform translate-x-1/2 bg-white opacity-95 rounded-lg p-2 shadow-general">
            {products.map((product) => (
              <li
                key={product.productID}
                onClick={() => handleProductClick(product.productID)}
                className="flex items-center w-full cursor-pointer hover_bg-slate-200 "
              >
                <img
                  src={product.productItems[0].thump}
                  alt={product.productName}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <span className="ml-2 w-[40vw] lg_w-[40rem] text-md truncate">
                  {product.productName}
                </span>
                <span className="ml-2 text-sm text-red-700">
                  {`${applyDiscount(
                    product.productItems[0].price,
                    product.productItems[0].discount
                  ).toLocaleString()}đ`}
                </span>
                {isDiscount(product.productItems[0].discount) && (
                  <del className="text-[0.8rem] ml-2 text-secondary-foreground">
                    {`${product.productItems[0].price.toLocaleString()}đ`}
                  </del>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="absolute top-24 right-1/2 transform translate-x-1/2 items-center w-max bg-white opacity-90 rounded-lg p-10 shadow-general">
            <img
              width={200}
              src="/no-product-found.png"
              alt="product_not_found"
            />
          </div>
        ))}
    </div>
  );
};

export default SearchBarPopUp;

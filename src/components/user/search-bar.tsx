import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/effect";
import { productService } from "@/services";
import { ProductSummary } from "@/types/payload";
import { useCustomNavigate } from "@/hooks";
import { cn } from "@/lib/utils";
import { applyDiscount, isDiscount } from "@/utils/helpers";

const SearchBar: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const searchingDelay = useRef<number>(500);
  const [seachText, setSearchText] = useState<string>();
  const [products, setProducts] = useState<ProductSummary[]>();
  const { navigate } = useCustomNavigate();
  const [productsVisibility, setProductsVisibility] = useState(false);
  const [typing, setTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //Close products search results if click outside of the search bar
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
    <div ref={wrapperRef} className={cn("relative h-10", props.className)}>
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm sản phẩm..."
        onFocus={() => setProductsVisibility(true)}
        onChange={(e) => handleSearchInputChange(e)}
        className="h-full text-xl w-full rounded-lg bg-background pl-8"
      />
      {typing && (
        <LoadingSpinner
          size={22}
          className="text-muted-foreground absolute top-0 bottom-0 right-3 m-auto"
        />
      )}
      {products &&
        productsVisibility &&
        !typing &&
        (products.length > 0 ? (
          <ul className="absolute flex flex-wrap gap-2 mt-4 right-1/2 transform translate-x-1/2 bg-white opacity-95 rounded-lg px-2 py-2 shadow-general">
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
                <span className="ml-2 max-w-[40rem] text-md truncate">
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
          <div className="flex flex-col items-center bg-white opacity-90 mt-2 rounded-lg p-10 shadow-general">
            <img
              width={200}
              src="/No_Product_Found.png"
              alt="product_not_found"
            />
          </div>
        ))}
    </div>
  );
};

export default SearchBar;

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/effect";
import { Optional } from "@/utils/declare";
import { productService } from "@/services";
import { ProductSummary } from "@/types/api";
import { useCustomNavigate } from "@/hooks";

const SearchBar: FC<HTMLAttributes<HTMLFormElement>> = () => {
  const [searchQuery, setSearchQuery] = useState<Optional<string>>();
  const [products, setProducts] = useState<Optional<ProductSummary[]>>();
  const { navigate } = useCustomNavigate();
  const [productsVisibility, setProductsVisibility] = useState(false);
  const [typing, setTyping] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //Close products search results if click outside of the search bar
    document.addEventListener("mousedown", handleSearchInputBlur);

    return () =>
      document.removeEventListener("mousedown", handleSearchInputBlur);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const res: { products: ProductSummary[] } =
        await productService.apis.getProductsSummary({});

      setProducts(res.products);
      setTyping(false);
      if (searchQuery) {
        setProductsVisibility(true);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleProductClick = (productID: string) => {
    navigate("/products/" + productID, {
      unstable_viewTransition: true,
    });
    setProductsVisibility(false);
  };

  const handleSearchInputBlur = (event: MouseEvent) => {
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
    setSearchQuery(event.target.value);
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full col-span-2 relative flex-1 md_grow-0 h-[2.7rem]"
    >
      <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm..."
        onFocus={() => setProductsVisibility(true)}
        onChange={(e) => handleSearchInputChange(e)}
        className="h-full text-xl w-full rounded-2xl bg-background pl-8"
      />
      {typing && (
        <LoadingSpinner
          size={22}
          className="text-black absolute right-3 top-3"
        />
      )}
      {products &&
        productsVisibility &&
        !typing &&
        (products.length > 0 ? (
          <ul className="absolute flex flex-wrap gap-2 mt-4 bg-white opacity-95 rounded-lg px-2 py-2 shadow-general">
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
                <span className="ml-2 text-md truncate">
                  {product.productName}
                </span>
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

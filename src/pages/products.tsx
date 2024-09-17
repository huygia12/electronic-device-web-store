import {
  FC,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Attribute, AttributeOption, ProductFullJoin } from "@/types/model";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MoneyInput, ProductCard } from "@/components/user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/services";
import { Nullable, Optional } from "@/utils/declare";
import { CardSkeleton } from "@/components/common";
import { cn } from "@/lib/utils";
import { Sort } from "@/types/enum";
import { applyDiscount, isDiscount } from "@/utils/helpers";

const Products: FC = () => {
  const [searchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ProductFullJoin[]>();
  const [attributesData, setAttributesData] = useState<Attribute[]>();
  const [sortValue, setSortValue] = useState<Optional<string>>(undefined); //Using Sort enum values
  const [isSale, setIsSale] = useState<boolean>(false);
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<AttributeOption[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductFullJoin[]>();

  useEffect(() => {
    const fetchData = async () => {
      let productRes: ProductFullJoin[] = [];
      const categoryID: Nullable<string> = searchParams.get("categoryID");
      const providerID: Nullable<string> = searchParams.get("providerID");
      if (categoryID) {
        productRes =
          await productService.apis.getProductsFullJoinWithCategoryID(
            categoryID
          );
      } else if (providerID) {
        productRes =
          await productService.apis.getProductsFullJoinWithProviderID(
            providerID
          );
      }

      setProductsData(productRes);
      setFilteredProducts(productRes);
      setAttributesData(productService.getAttributesOutOfProduct(productRes));
    };

    fetchData();
  }, [searchParams]);

  useLayoutEffect(() => {
    const filterProduct = () => {
      let productsHolder = productsData?.map((product) => product);

      if (isSale) {
        productsHolder = productsHolder?.filter((product) =>
          isDiscount(product.productItems[0].discount)
        );
      }
      if (sortValue === Sort.DES) {
        productsHolder?.sort(
          (a, b) =>
            applyDiscount(b.productItems[0].price, b.productItems[0].discount) -
            applyDiscount(a.productItems[0].price, a.productItems[0].discount)
        );
      } else if (sortValue === Sort.ASC) {
        productsHolder?.sort(
          (a, b) =>
            applyDiscount(a.productItems[0].price, a.productItems[0].discount) -
            applyDiscount(b.productItems[0].price, b.productItems[0].discount)
        );
      } else if (sortValue === Sort.ATOZ) {
        productsHolder?.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
      } else if (sortValue === Sort.ZTOA) {
        productsHolder?.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
      }

      if (selectedOptions.length > 0) {
        console.log("filter by selected options");
        productsHolder = productsHolder?.filter((product) =>
          productService.isContainAllRequiredAttributeOptions(
            product,
            selectedOptions
          )
        );
      }

      setFilteredProducts(productsHolder);
    };

    filterProduct();
  }, [sortValue, isSale, selectedOptions, productsData]);

  const handleSortSelectionEvent: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (event.currentTarget.value !== sortValue) {
      setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
      setSortValue(event.currentTarget.value);
    }
  };

  const handleSellectOptionEvent = (option: AttributeOption) => {
    const newSelectedOptions = selectedOptions.filter(
      (iter) => iter.typeID !== option.typeID
    );
    newSelectedOptions.push(option);
    setSelectedOptions(newSelectedOptions);
  };

  const handleAttributeClearEvent = () => {
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
    setSelectedOptions([]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <div className="sticky top-36 flex flex-col">
          <h2 className="w-full text-[1.4rem] font-extrabold pt-2 pb-4">
            LỌC SẢN PHẨM
          </h2>
          <ul key={selectComponentKey} className="px-4">
            {attributesData?.map((attr, parentIndex) => {
              return (
                <li key={parentIndex} className="space-y-3 mb-8">
                  <h5 className="text-slate-700 font-extrabold">
                    {attr.typeValue}
                  </h5>
                  <Separator className="border-1 border-slate-400" />
                  <RadioGroup className="pl-4 space-y-2">
                    {attr.attributeOptions?.map((option, childIndex) => {
                      return (
                        <div
                          key={childIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            onClick={() => handleSellectOptionEvent(option)}
                            value={option.optionID}
                            id={`${parentIndex}${childIndex}`}
                          />
                          <Label
                            htmlFor={`${parentIndex}${childIndex}`}
                            className="text-slate-600 !my-0"
                          >
                            {option.optionValue}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </li>
              );
            })}
          </ul>
          {attributesData && attributesData.length > 0 && (
            <Button
              variant={"destructive"}
              onClick={() => {
                handleAttributeClearEvent();
              }}
              className="ml-auto mr-4 w-20"
            >
              Làm mới
            </Button>
          )}
        </div>
      </div>

      <div className="col-span-3 flex flex-col gap-6">
        <div>
          <h1 className="text-[2rem] font-semibold mb-[0.5rem]">
            TẤT CẢ SẢN PHẨM
          </h1>
          <hr className="border-dashed border-[0.1rem] border-secondary-foreground" />
        </div>

        {/** Filter */}
        <div className="flex justify-between bg-slate-200 rounded-lg p-4">
          <span className="flex gap-3">
            <Button
              variant="dashed"
              value={Sort.ASC}
              onClick={handleSortSelectionEvent}
              className={cn(
                sortValue === Sort.ASC && "bg-slate-600 !text-white"
              )}
            >
              Giá tăng dần
            </Button>
            <Button
              variant="dashed"
              value={Sort.DES}
              onClick={handleSortSelectionEvent}
              className={cn(
                sortValue === Sort.DES && "bg-slate-600 !text-white"
              )}
            >
              Giá giảm dần
            </Button>
            <Button
              variant="dashed"
              className={cn(isSale && "bg-slate-600 !text-white")}
              onClick={() => setIsSale(!isSale)}
            >
              Giảm giá
            </Button>
            <Select
              key={selectComponentKey}
              value={
                sortValue === Sort.ATOZ || sortValue === Sort.ZTOA
                  ? sortValue
                  : undefined
              }
              onValueChange={(value) => {
                if (value !== sortValue) {
                  setSortValue(value);
                }
              }}
            >
              <SelectTrigger className="w-[10rem] focus_ring-0 focus_ring-offset-0">
                <SelectValue placeholder={"Sắp xếp theo tên"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value={Sort.ATOZ}
                    className="text-[1rem]
                  "
                  >
                    {`Tên từ A->Z`}
                  </SelectItem>
                  <SelectItem
                    value={Sort.ZTOA}
                    className="text-[1rem]"
                  >{`Tên từ Z->A`}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
          <span className="flex items-center">
            <Label className="text-md font-extrabold text-nowrap">
              Khoảng giá: &nbsp;
            </Label>
            <MoneyInput className="border-slate-600 max-w-[8rem] max-h-[2.3rem]" />
            <Minus size={15} />
            <MoneyInput className="border-slate-600 max-w-[8rem] max-h-[2.3rem]" />
          </span>
        </div>

        {/** PRODUCT LIST */}
        <div
          className={cn(
            "col-span-3 grid grid-cols-4 gap-4",
            filteredProducts &&
              filteredProducts.length === 0 &&
              "flex flex-col items-center"
          )}
        >
          {filteredProducts ? (
            filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
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
            Array.from({ length: 15 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Products;

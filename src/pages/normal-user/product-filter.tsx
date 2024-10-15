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
import { MoneyInput } from "@/components/user";
import { useSearchParams } from "react-router-dom";
import { attributeService, productService } from "@/services";
import { Optional } from "@/utils/declare";
import { cn } from "@/lib/utils";
import { Sort } from "@/types/enum";
import { applyDiscount, isDiscount } from "@/utils/helpers";
import { AttributeFilter, ProductList } from "@/components/product-filter";

const ProductFilter: FC = () => {
  const [searchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ProductFullJoin[]>();
  const [attributes, setAttributes] = useState<Attribute[]>();
  const [sortValue, setSortValue] = useState<Optional<string>>(undefined); //Using Sort enum values
  const [isSale, setIsSale] = useState<boolean>(false);
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<AttributeOption[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductFullJoin[]>();
  const [numberOfProducts, setNumberOfProducts] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      const categoryID: string | null = searchParams.get("categoryID");
      const providerID: string | null = searchParams.get("providerID");

      const attributesRes = await attributeService.apis.getAttributes({
        categoryID: categoryID || undefined,
        providerID: providerID || undefined,
      });
      setAttributes(attributeService.filterEmtyAttributeOptions(attributesRes));

      const productRes: { products: ProductFullJoin[]; totalProducts: number } =
        await productService.apis.getProductsFullJoin({
          categoryID: categoryID || undefined,
          providerID: providerID || undefined,
        });

      setNumberOfProducts(productRes.totalProducts || 0);
      setProductsData(productRes.products);
      setFilteredProducts(productRes.products);
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

  const handleSelectOptionEvent = (option: AttributeOption) => {
    const newSelectedOptions = selectedOptions.filter(
      (iter) => iter.typeID !== option.typeID
    );
    newSelectedOptions.push(option);
    setSelectedOptions(newSelectedOptions);
  };

  const handleAttributeClearEvent = () => {
    setSelectedOptions([]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <AttributeFilter
          attributes={attributes}
          handleClearEvent={handleAttributeClearEvent}
          handleSelectOption={handleSelectOptionEvent}
          className="sticky top-36"
        />
      </div>

      <div className="col-span-3 flex flex-col gap-6">
        <div>
          <h1 className="text-[1.6rem] font-semibold mb-[0.5rem]">
            {numberOfProducts !== undefined ? (
              <>
                Kết Quả Lọc Cho:{" "}
                <span className="text-[1.4rem] text-red-600 font-light">{`(${numberOfProducts} kết quả)`}</span>
              </>
            ) : (
              <>Tìm Kiếm ...</>
            )}
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
          <Button variant="neutral">Lọc</Button>
        </div>

        {/** PRODUCT LIST */}
        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
};
export default ProductFilter;

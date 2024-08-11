import { useEffect, useState } from "react";
import { Attribute, ProductFullJoin } from "@/types/api";
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
import { attributeApis, productApis } from "@/services/apis";
import { Nullable } from "@/utils/declare";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ProductFullJoin[]>();
  const [attributesData, setAttributesData] = useState<Attribute[]>();

  useEffect(() => {
    const fetchData = async () => {
      const attributesRes = await attributeApis.getAttributes();

      let productRes: ProductFullJoin[] = [];
      const categoryID: Nullable<string> = searchParams.get("categoryID");
      const providerID: Nullable<string> = searchParams.get("providerID");
      if (categoryID) {
        productRes =
          await productApis.getProductsFullJoinWithCategoryID(categoryID);
      } else if (providerID) {
        productRes =
          await productApis.getProductsFullJoinWithProviderID(providerID);
      }

      setProductsData(productRes);
      setAttributesData(attributesRes ?? []);
    };

    fetchData();
  }, [searchParams]);

  return (
    <div className="grid grid-cols-4 gap-8">
      <form>
        <h2 className="w-full text-[1.4rem] font-extrabold pt-24 pb-4">
          LỌC SẢN PHẨM
        </h2>
        <ul className="px-4">
          {attributesData?.map((attr, parentIndex) => {
            return (
              <li key={parentIndex} className="space-y-4 mb-8">
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
                          value={option.optionID}
                          id={`${parentIndex}${childIndex}`}
                        />
                        <Label
                          htmlFor={`${parentIndex}${childIndex}`}
                          className="text-slate-600"
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
      </form>
      <div className="col-span-3 flex flex-col gap-6">
        <div>
          <h1 className="text-[2rem] font-semibold mb-[0.5rem]">
            TẤT CẢ SẢN PHẨM
          </h1>
          <hr className="border-dashed border-[0.1rem] border-secondary-foreground" />
        </div>
        <div className="flex justify-between bg-slate-200 rounded-lg p-4">
          <span className="flex gap-3">
            <Button variant="dashed">Giá tăng dần</Button>
            <Button variant="dashed">Giá giảm dần</Button>
            <Button variant="dashed">Giảm giá</Button>
            <Select>
              <SelectTrigger className="w-[9rem] focus_ring-0 focus_ring-offset-0">
                <SelectValue placeholder={"Lọc sản phẩm"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1" className="text-[1rem]">
                    {`Tên từ A->Z`}
                  </SelectItem>
                  <SelectItem
                    value="2"
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
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {productsData?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Products;

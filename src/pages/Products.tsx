import Card4Product from "@/components/card4Product";
import { useEffect, useState } from "react";
import { AttributeType, Product } from "@/declare";
import axios from "axios";
import log from "loglevel";
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
import { MoneyInput } from "@/components/ui/moneyInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const Products = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [attributesData, setAttributesData] = useState<AttributeType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get<Product[]>(
          import.meta.env.VITE_API_URL + "/products"
        );
        const attributesRes = await axios.get<AttributeType[]>(
          import.meta.env.VITE_API_URL + "/attributes"
        );
        console.log(attributesRes.data);
        setAttributesData(attributesRes.data);
        setProductsData(productsRes.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          log.error("Axios error:", error.message);
          if (error.response) {
            log.error("Response data:", error.response.data);
            log.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          log.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8">
      <form>
        <h2 className="w-full text-[1.4rem] font-extrabold pt-24 pb-4">
          LỌC SẢN PHẨM
        </h2>
        <ul className="px-4">
          {attributesData.map((attr, parentIndex) => {
            return (
              <li key={parentIndex} className="space-y-4 mb-8">
                <h5 className="text-slate-700 font-extrabold">
                  {attr.typeName}
                </h5>
                <Separator className="border-1 border-slate-400" />
                <RadioGroup className="pl-4 space-y-2">
                  {attr.options.map((option, childIndex) => {
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
          {productsData.map((product, index) => (
            <Card4Product key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Products;

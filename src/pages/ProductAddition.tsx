// import {
//   CategoryLoaderType,
//   ProviderLoaderType,
//   categoriesLoader,
//   providersLoader,
// } from "@/api/productPagesLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Category, Provider } from "@/declare";
import axios from "axios";
import log from "loglevel";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

log.setLevel("error");

const ProductAddition = () => {
  const [thumps, setThumps] = useState<string[]>([""]);
  const [imgsArray, setImgs] = useState<string[][]>([[""]]);
  const [itemCounter, setItemCounter] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get<Category[]>(
          "http://localhost:4000/categories"
        );
        const providersRes = await axios.get<Provider[]>(
          "http://localhost:4000/providers"
        );

        setCategories(categoriesRes.data);
        setProviders(providersRes.data);
      } catch (error) {
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

  const handleAddThump = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    event.preventDefault();

    const thumpBucket = thumps.map((element, iter) =>
      iter === index
        ? event.target.files
          ? URL.createObjectURL(event.target.files[0])
          : ""
        : element
    );

    setThumps(thumpBucket);
  };

  const handleAddImgs = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    event.preventDefault();

    const imgsBucket: string[][] = imgsArray.map((element, iter) =>
      iter === index
        ? event.target.files
          ? [...event.target.files].map((file) => URL.createObjectURL(file))
          : [""]
        : [...element]
    );
    setImgs(imgsBucket);
  };

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const thumpsBucket = [...thumps, ""];
    const imgsBucket = [...imgsArray, [""]];

    setImgs(imgsBucket);
    setThumps(thumpsBucket);
    setItemCounter(itemCounter + 1);
  };

  const handleDelItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const thumpsLen = thumps.length;
    const imgsArrayLen = imgsArray.length;
    const thumpsBucket =
      thumpsLen <= 2 ? [thumps[0]] : thumps.slice(0, thumpsLen - 1);
    const imgsBucket =
      imgsArrayLen <= 2
        ? [[...imgsArray[0]]]
        : imgsArray.slice(0, imgsArrayLen - 1);
    setImgs(imgsBucket);
    setThumps(thumpsBucket);
    itemCounter > 1 && setItemCounter(itemCounter - 1);
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8 mb-10">Thêm sản phẩm</h1>
      <form>
        {/** PRODUCT */}
        <div className="my-12 grid grid-cols-2 gap-8 w-full">
          <div className="grid gap-8">
            {/** PRODUCT NAME */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-lg font-extrabold">
                Tên sản phẩm
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="abc"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
            {/** GURANTEE TIME SPAN */}
            <div className="grid gap-2">
              <Label className="text-lg font-extrabold">
                Thời hạn bảo hành(tháng)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                type="number"
                placeholder=""
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {/** LENGTH */}
            <div className="grid gap-2">
              <Label htmlFor="length" className="text-lg font-extrabold">
                Dài(cm)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="length"
                type="number"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
            {/** WIDTH */}
            <div className="grid gap-2">
              <Label htmlFor="width" className="text-lg font-extrabold">
                Rộng(cm)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="width"
                type="number"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
            {/** HEIGHT */}
            <div className="grid gap-2">
              <Label htmlFor="height" className="text-lg font-extrabold">
                Cao(cm)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="height"
                type="number"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
            {/** WEIGHT */}
            <div className="grid gap-2">
              <Label htmlFor="weight" className="text-lg font-extrabold">
                Nặng(gram)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
            </div>
            {/** CATEGORY */}
            <div className="col-span-2 grid gap-2 ">
              <Label htmlFor="category" className="text-lg font-extrabold">
                Danh mục
                <span className="text-red-600 ">*</span>
              </Label>
              <Select>
                <SelectTrigger className="border-2 border-stone-400 text-lg min-h-12 focus_border-none">
                  <SelectValue id="category" className="p-0" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cate, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={cate.categoryID}
                        className="max-w-[30rem] truncate"
                      >
                        {cate.categoryName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {/** PROVIDER */}
            <div className="col-span-2 grid gap-2 ">
              <Label htmlFor="provider" className="text-lg font-extrabold">
                Nhà phân phối
                <span className="text-red-600 ">*</span>
              </Label>
              <Select>
                <SelectTrigger className="border-2 border-stone-400 text-lg min-h-12 focus_border-none">
                  <SelectValue id="provider" className="p-0" />
                </SelectTrigger>
                <SelectContent className="">
                  {providers.map((provider, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={provider.providerID}
                        className="max-w-[30rem] truncate"
                      >
                        {provider.providerName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="col-span-2 grid gap-2">
            <Label htmlFor="desc" className="text-lg font-extrabold">
              Mô tả
            </Label>
            <Textarea
              id="desc"
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            />
          </div>
        </div>
        <Separator />

        {/** ITEMS */}
        <ul className="mb-8">
          {Array(itemCounter)
            .fill(0)
            .map((_, parentIndex) => {
              return (
                <li
                  key={parentIndex}
                  className="grid grid-cols-2 gap-8 border-stone-200 border-2 rounded-xl p-5 mt-10"
                >
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor={`thump-${parentIndex}`}
                      className="text-lg font-extrabold"
                    >
                      Ảnh tiêu đề
                      <span className="text-red-600 ">*</span>
                    </Label>
                    <Input
                      type="file"
                      id={`thump-${parentIndex}`}
                      accept="image/*"
                      onChange={(e) => handleAddThump(e, parentIndex)}
                    />
                    <img
                      src={thumps[parentIndex]}
                      className="max-w-40 object-cover rounded-md border-stone-300 border-2"
                    />
                  </div>
                  <div className="overflow-auto flex flex-col gap-2">
                    <Label
                      htmlFor={`product-imgs-${parentIndex}`}
                      className="text-lg font-extrabold"
                    >
                      Ảnh sản phẩm
                      <span className="text-red-600 ">*</span>
                    </Label>
                    <Input
                      type="file"
                      id={`product-imgs-${parentIndex}`}
                      multiple
                      accept="image/*"
                      onChange={(e) => handleAddImgs(e, parentIndex)}
                    />
                    <div className="overflow-auto flex flex-row gap-2 ">
                      {imgsArray.length === 0
                        ? ""
                        : imgsArray[parentIndex].map((element, index) => {
                            return (
                              <img
                                key={index}
                                src={element}
                                className="max-w-40 object-cover rounded-md border-stone-300 border-2"
                              />
                            );
                          })}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`price-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Giá tiền(VNĐ)
                        <span className="text-red-600 ">*</span>
                      </Label>
                      <Input
                        id={`price-${parentIndex}`}
                        type="text"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`quantity-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Số lượng
                        <span className="text-red-600 ">*</span>
                      </Label>
                      <Input
                        min={1}
                        max={1000000000}
                        id={`quantity-${parentIndex}`}
                        type="number"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`code-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Mã sản phẩm
                        <span className="text-red-600 ">*</span>
                      </Label>
                      <Input
                        id={`code-${parentIndex}`}
                        type="text"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`discount-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Giảm giá(%)
                      </Label>
                      <Input
                        id={`discount-${parentIndex}`}
                        max={100}
                        min={0}
                        type="number"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`color-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Màu
                      </Label>
                      <Input
                        id={`color-${parentIndex}`}
                        type="text"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`capacity-${parentIndex}`}
                        className="text-lg font-extrabold"
                      >
                        Dung lượng
                      </Label>
                      <Input
                        id={`capacity-${parentIndex}`}
                        type="text"
                        className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>

        {/** BUTTONS */}
        <div className="flex justify-between">
          <span className="space-x-4">
            <Button
              variant="positive"
              className="text-xl"
              onClick={(e) => handleAddItem(e)}
            >
              Thêm
              <Plus />
            </Button>
            {itemCounter > 1 && (
              <Button
                variant="negative"
                className="text-xl"
                onClick={(e) => handleDelItem(e)}
              >
                Xóa
                <Trash2 />
              </Button>
            )}
          </span>
          <Button variant="neutral" className="text-xl">
            Thêm sản phẩm
            <Plus />
          </Button>
        </div>
      </form>
    </>
  );
};

export { ProductAddition };

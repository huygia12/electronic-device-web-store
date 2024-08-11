// import Badge from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   AttributeOption,
//   Attribute,
//   Category,
//   ProductAttribute,
//   Provider,
//   ProductItem,
//   ItemInputProps,
//   ProductInsertPayload,
// } from "@/types/api";
// import { cn } from "@/lib/utils";
// import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
// import { FC, useEffect, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { axiosInstance, reqConfig } from "@/services/axios";
// import routes from "../middleware/routes";
// import axios from "axios";
// import { toast } from "sonner";
// import { ProductInputFormProps, ProductSchema } from "@/schema";
// import { LoadingSpinner } from "@/components/effect";
// import categoryApis from "@/services/apis/category";
// import { attributeApis, providerApis } from "@/services/apis";
// import { Optional } from "@/utils/declare";

// const ProductAddition: FC = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [attributes, setAttributes] = useState<Attribute[]>([]);

//   const [additionItems, setAdditionItems] = useState<ItemInputProps[]>([]);
//   const [open, setOpen] = useState(false);
//   const [selectedAttrType, setSelectedAttrType] = useState<Attribute>();
//   const [selectedProvider, setSelectedProvider] = useState<string>();
//   const [selectedCategory, setSelectedCategory] = useState<string>();
//   const [attrAdditionBucket, setAttrAdditionBucket] = useState<
//     ProductAttribute[]
//   >([]);
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<ProductInputFormProps>({
//     resolver: zodResolver(ProductSchema),
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const categories = await categoryApis.getCategories();
//       const providers = await providerApis.getProviders();
//       const attributes = await attributeApis.getAttributes();

//       setCategories(categories);
//       setProviders(providers);
//       setAttributes(attributes);
//     };

//     fetchData();
//   }, []);

//   const handleAddThump = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     event.preventDefault();

//     const itemBucket: ItemInputProps[] = additionItems.map((item, iter) => {
//       if (iter === index) {
//         return {
//           ...item,
//           thump: event.target.files ? event.target.files[0] : null,
//         };
//       }
//       return item;
//     });
//     setAdditionItems(itemBucket);
//   };

//   const handleAddImgs = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     event.preventDefault();

//     const itemBucket: ItemInputProps[] = additionItems.map((item, iter) => {
//       if (iter === index) {
//         return {
//           ...item,
//           images: event.target.files ? [...event.target.files] : null,
//         };
//       }
//       return item;
//     });
//     setAdditionItems(itemBucket);
//   };

//   const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();
//     setAdditionItems([
//       ...additionItems,
//       {
//         thump: null,
//         quantity: null,
//         price: null,
//         productCode: null,
//         discount: null,
//         color: null,
//         storage: null,
//         itemImages: null,
//       },
//     ]);
//   };

//   const handleDelItem = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     const itemsLen = additionItems.length;
//     const itemBucket: ItemInputProps[] =
//       itemsLen <= 2
//         ? [additionItems[0]]
//         : [...additionItems].slice(0, itemsLen - 1);

//     setAdditionItems(itemBucket);
//   };

//   const findAttribute = (id: string): Optional<Attribute> => {
//     return attributes.find((value) => value.typeID === id);
//   };

//   const handleOptionSelection = (optionID: string) => {
//     const selectedOption: Optional<AttributeOption> = selectedAttrType.?(
//       (attr) => attr.optionID === optionID
//     );

//     if (selectedOption && selectedAttrType) {
//       const bucket: ProductAttribute[] = [
//         ...attrAdditionBucket,
//         {
//           typeID: selectedAttrType.typeID,
//           typeValue: selectedAttrType.typeValue,
//           optionID: selectedOption.optionID,
//           optionName: selectedOption.optionValue,
//         },
//       ];
//       setAttrAdditionBucket(bucket);
//     }
//   };

//   const handleDeleteAttribute = (attribute: ProductAttribute) => {
//     const bucket = attrAdditionBucket.filter(
//       (attr) =>
//         attr.typeID !== attribute.typeID || attr.optionID !== attribute.optionID
//     );
//     setAttrAdditionBucket(bucket);
//   };

//   const getAvailableAttributeType = (): Attribute[] => {
//     return attributes.filter(
//       (attr) =>
//         attrAdditionBucket.find(
//           (productAttr) => productAttr.typeID === attr.typeID
//         ) === undefined
//     );
//   };

//   const handleFormSubmission: SubmitHandler<ProductInputFormProps> = async (
//     data
//   ) => {
//     let valid = true;
//     additionItems.forEach((item) => {
//       if (
//         !item.price ||
//         !item.productCode ||
//         !item.color ||
//         !item.quantity ||
//         item.price.toString().length === 0 ||
//         item.productCode.length === 0 ||
//         item.color.length === 0 ||
//         item.quantity.toString().length === 0
//       ) {
//         setError("root", {
//           message:
//             "Vui lòng điền đầy đủ và hợp lệ thông tin của các trường bất buộc!",
//         });
//         valid = false;
//         return;
//       }
//       if (item.thump === null || item.itemImages === null) {
//         setError("root", { message: "Một số sản phẩm thiếu ảnh!" });
//         valid = false;
//         return;
//       }
//     });
//     if (!valid) return;

//     try {
//       const productItems: ProductItemInsertPayload[] =
//         await getItemList(additionItems);
//       const productPayload: ProductInsertPayload = {
//         productName: data.productName.trim(),
//         description: data.description && data.description.trim(),
//         length: data.length,
//         width: data.width,
//         height: data.height,
//         weight: data.weight,
//         warranty: data.warranty,
//         categoryID: selectedCategory as string,
//         providerID: selectedProvider as string,
//         options: attrAdditionBucket.reduce<string[]>((prev, curr) => {
//           prev.push(curr.optionID);
//           return prev;
//         }, []),
//         productItems: [...productItems],
//       };
//       console.log(JSON.stringify(productItems));
//       console.log(JSON.stringify(productPayload.productItems));

//       //post new product
//       await axiosInstance.post("/products", productPayload, {
//         ...reqConfig,
//       });

//       toast.success("Thêm sản phẩm thành công!");
//       await routes.navigate("/admin/products", {
//         unstable_viewTransition: true,
//         replace: true,
//       });
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         toast.error("Thêm sản phẩm thất bại!");
//         // Handle error response if available
//         console.error(`Response data: ${error.response?.data}`);
//         console.error(`Response status: ${error.response?.status})`);
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   };

//   return (
//     <>
//       <h1 className="text-4xl font-extrabold mt-8 mb-10">Thêm sản phẩm</h1>
//       <form onSubmit={handleSubmit(handleFormSubmission)}>
//         {/** PRODUCT */}
//         <div className="grid grid-cols-2 gap-8 mb-8">
//           {/** LEFT */}
//           <div className="grid gap-4 grid-cols-3">
//             {/** PRODUCT NAME */}
//             <div className="space-y-2 col-span-3">
//               <Label htmlFor="name" className="text-lg font-extrabold">
//                 Tên sản phẩm
//                 <span className="text-red-600 ">*</span>
//               </Label>
//               <Input
//                 id="name"
//                 type="text"
//                 autoComplete={"off"}
//                 {...register("productName")}
//                 placeholder="abc"
//                 className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//               />
//               {errors.productName && (
//                 <div className="text-red-600">{errors.productName.message}</div>
//               )}
//             </div>
//             {/** GURANTEE TIME SPAN */}
//             <div className="space-y-2">
//               <Label className="text-lg font-extrabold">
//                 Thời hạn bảo hành(tháng)
//                 <span className="text-red-600 ">*</span>
//               </Label>
//               <Input
//                 autoComplete={"off"}
//                 {...register("warranty")}
//                 min={0}
//                 className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//               />
//               {errors.warranty && (
//                 <div className="text-red-600">{errors.warranty.message}</div>
//               )}
//             </div>
//             {/** CATEGORY */}
//             <div className="space-y-2">
//               <Label htmlFor="category" className="text-lg font-extrabold">
//                 Danh mục
//                 <span className="text-red-600 ">*</span>
//               </Label>
//               <Select onValueChange={(value) => setSelectedCategory(value)}>
//                 <SelectTrigger
//                   value={selectedCategory}
//                   {...register("categoryID")}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 >
//                   <SelectValue id="category" className="p-0" />
//                 </SelectTrigger>
//                 {errors.categoryID && (
//                   <div className="text-red-600">
//                     {errors.categoryID.message}
//                   </div>
//                 )}
//                 <SelectContent>
//                   {categories.map((cate, index) => {
//                     return (
//                       <SelectItem
//                         key={index}
//                         value={cate.categoryID}
//                         className="max-w-[30rem] truncate"
//                       >
//                         {cate.categoryName}
//                       </SelectItem>
//                     );
//                   })}
//                 </SelectContent>
//               </Select>
//             </div>
//             {/** PROVIDER */}
//             <div className="space-y-2">
//               <Label htmlFor="provider" className="text-lg font-extrabold">
//                 Nhà phân phối
//                 <span className="text-red-600 ">*</span>
//               </Label>
//               <Select onValueChange={(value) => setSelectedProvider(value)}>
//                 <SelectTrigger
//                   value={selectedProvider}
//                   {...register("providerID")}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 >
//                   <SelectValue id="provider" className="p-0" />
//                 </SelectTrigger>
//                 {errors.providerID && (
//                   <div className="text-red-600">
//                     {errors.providerID.message}
//                   </div>
//                 )}
//                 <SelectContent className="">
//                   {providers.map((provider, index) => {
//                     return (
//                       <SelectItem
//                         key={index}
//                         value={provider.providerID}
//                         className="max-w-[30rem] truncate"
//                       >
//                         {provider.providerName}
//                       </SelectItem>
//                     );
//                   })}
//                 </SelectContent>
//               </Select>
//             </div>
//             {/** SIZE */}
//             <div className="col-span-3 grid grid-cols-4 gap-4">
//               {/** LENGTH */}
//               <div className="space-y-2">
//                 <Label htmlFor="length" className="text-lg font-extrabold">
//                   Dài(cm)
//                   <span className="text-red-600 ">*</span>
//                 </Label>
//                 <Input
//                   id="length"
//                   autoComplete={"off"}
//                   {...register("length")}
//                   min={0}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 />
//                 {errors.length && (
//                   <div className="text-red-600">{errors.length.message}</div>
//                 )}
//               </div>
//               {/** WIDTH */}
//               <div className="space-y-2">
//                 <Label htmlFor="width" className="text-lg font-extrabold">
//                   Rộng(cm)
//                   <span className="text-red-600 ">*</span>
//                 </Label>
//                 <Input
//                   id="width"
//                   autoComplete={"off"}
//                   {...register("width")}
//                   min={0}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 />
//                 {errors.width && (
//                   <div className="text-red-600">{errors.width.message}</div>
//                 )}
//               </div>
//               {/** HEIGHT */}
//               <div className="space-y-2">
//                 <Label htmlFor="height" className="text-lg font-extrabold">
//                   Cao(cm)
//                   <span className="text-red-600 ">*</span>
//                 </Label>
//                 <Input
//                   id="height"
//                   autoComplete={"off"}
//                   {...register("height")}
//                   min={0}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 />
//                 {errors.height && (
//                   <div className="text-red-600">{errors.height.message}</div>
//                 )}
//               </div>
//               {/** WEIGHT */}
//               <div className="space-y-2">
//                 <Label htmlFor="weight" className="text-lg font-extrabold">
//                   Nặng(gram)
//                   <span className="text-red-600 ">*</span>
//                 </Label>
//                 <Input
//                   id="weight"
//                   autoComplete={"off"}
//                   {...register("weight")}
//                   min={0}
//                   className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                 />
//                 {errors.weight && (
//                   <div className="text-red-600">{errors.weight.message}</div>
//                 )}
//               </div>
//             </div>
//             <div className="col-span-3 grid grid-cols-2 gap-4">
//               {/** ATTRIBUTES */}
//               <div className="space-y-2 flex flex-col">
//                 <Label htmlFor="atr" className="text-lg font-extrabold">
//                   Thể loại
//                 </Label>
//                 <Popover open={open} onOpenChange={() => setOpen(!open)}>
//                   <PopoverTrigger
//                     asChild
//                     className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                   >
//                     <Button
//                       variant="normal"
//                       role="combobox"
//                       // aria-expanded={open}
//                       className="justify-between focus_!ring-2"
//                     >
//                       {selectedAttrType
//                         ? selectedAttrType.typeValue
//                         : "Chọn thể loại..."}
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-max p-0">
//                     <Command>
//                       <CommandInput
//                         placeholder="Tìm thể loại..."
//                         className="text-lg"
//                       />
//                       <CommandList>
//                         <CommandEmpty className="text-stone-500 text-center p-4">
//                           Không tìm thấy.
//                         </CommandEmpty>
//                         <CommandGroup>
//                           {getAvailableAttributeType().map((attr, index) => (
//                             <CommandItem
//                               key={index}
//                               value={attr.typeValue}
//                               onSelect={() => {
//                                 setSelectedAttrType(
//                                   attr.typeID === selectedAttrType?.typeID
//                                     ? undefined
//                                     : attr
//                                 );
//                                 // setSelectedOptionID(undefined);
//                                 setOpen(false);
//                               }}
//                               className="text-lg"
//                             >
//                               <Check
//                                 className={cn(
//                                   "mr-2 h-4 w-4",
//                                   selectedAttrType?.typeID === attr.typeID
//                                     ? "opacity-100"
//                                     : "opacity-0"
//                                 )}
//                               />
//                               {attr.typeValue}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>
//               {/** OPTIONS */}
//               <div className="space-y-2">
//                 <Label htmlFor="option" className="text-lg font-extrabold">
//                   Giá trị
//                 </Label>
//                 <Select onValueChange={(value) => handleOptionSelection(value)}>
//                   <SelectTrigger className="border-2 border-stone-400 text-lg min-h-12 focus_border-none">
//                     <SelectValue id="option" className="p-0" />
//                   </SelectTrigger>
//                   <SelectContent className="">
//                     {selectedAttrType &&
//                       findAttribute(
//                         selectedAttrType.typeID
//                       )?.attributeOptions.map((option, index) => {
//                         return (
//                           <SelectItem
//                             key={index}
//                             value={option.optionID}
//                             className="max-w-[30rem] truncate"
//                           >
//                             {option.optionValue}
//                           </SelectItem>
//                         );
//                       })}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             {/** PRODUCT ATTRIBUTES */}
//             <ScrollArea className="col-span-3">
//               <div className="flex py-6 space-x-2">
//                 {attrAdditionBucket.map((attr, index) => (
//                   <Badge
//                     variant="outline"
//                     key={index}
//                     className="w-max text-base bg-secondary text-secondary-foreground"
//                   >
//                     <span>{`${attr.attributeType.typeValue} : ${attr.optionValue}`}</span>
//                     <X
//                       className="ml-2 hover_text-primary cursor-pointer"
//                       onClick={() => handleDeleteAttribute(attr)}
//                     />
//                   </Badge>
//                 ))}
//               </div>
//               <ScrollBar orientation="horizontal" />
//             </ScrollArea>
//           </div>
//           {/** RIGHT */}
//           <div className="space-y-2 mb-10">
//             <Label htmlFor="desc" className="text-lg font-extrabold">
//               Mô tả
//             </Label>
//             <Textarea
//               id="desc"
//               {...register("description")}
//               placeholder="...abc"
//               className="border-2 border-stone-400 text-lg min-h-12 focus_border-none h-full"
//             />
//           </div>
//         </div>

//         {/** ITEMS */}
//         <ul className="mb-8">
//           {additionItems.map((item, parentIndex) => {
//             return (
//               <li
//                 key={parentIndex}
//                 className="grid grid-cols-2 gap-8 border-stone-200 border-2 rounded-xl p-5 mt-10"
//               >
//                 <div className="flex flex-col gap-2">
//                   <Label
//                     htmlFor={`thump-${parentIndex}`}
//                     className="text-lg font-extrabold"
//                   >
//                     Ảnh tiêu đề
//                     <span className="text-red-600 ">*</span>
//                   </Label>
//                   <Input
//                     type="file"
//                     id={`thump-${parentIndex}`}
//                     accept="image/*"
//                     onChange={(e) => handleAddThump(e, parentIndex)}
//                   />
//                   {item.thump && (
//                     <img
//                       src={URL.createObjectURL(item.thump)}
//                       className="max-w-40 object-cover rounded-md border-stone-300 border-2"
//                     />
//                   )}
//                 </div>
//                 <div className="overflow-auto flex flex-col gap-2">
//                   <Label
//                     htmlFor={`product-imgs-${parentIndex}`}
//                     className="text-lg font-extrabold"
//                   >
//                     Ảnh sản phẩm
//                     <span className="text-red-600 ">*</span>
//                   </Label>
//                   <Input
//                     type="file"
//                     id={`product-imgs-${parentIndex}`}
//                     multiple
//                     accept="image/*"
//                     onChange={(e) => handleAddImgs(e, parentIndex)}
//                   />
//                   {item.itemImages && (
//                     <div className="overflow-auto flex flex-row gap-2 ">
//                       {item.itemImages.map((element, index) => {
//                         return (
//                           <img
//                             key={index}
//                             src={URL.createObjectURL(element)}
//                             className="max-w-40 object-cover rounded-md border-stone-300 border-2"
//                           />
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`price-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Giá tiền(VNĐ)
//                       <span className="text-red-600 ">*</span>
//                     </Label>
//                     <Input
//                       id={`price-${parentIndex}`}
//                       type="number"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].price = parseInt(
//                           e.target.value
//                         );
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`quantity-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Số lượng
//                       <span className="text-red-600 ">*</span>
//                     </Label>
//                     <Input
//                       min={1}
//                       max={1000000000}
//                       id={`quantity-${parentIndex}`}
//                       type="number"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].quantity = parseInt(
//                           e.target.value
//                         );
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`code-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Mã sản phẩm
//                       <span className="text-red-600 ">*</span>
//                     </Label>
//                     <Input
//                       id={`code-${parentIndex}`}
//                       type="text"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].productCode = e.target.value;
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`discount-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Giảm giá(%)
//                     </Label>
//                     <Input
//                       id={`discount-${parentIndex}`}
//                       max={100}
//                       min={0}
//                       type="number"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].discount = parseFloat(
//                           e.target.value
//                         );
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`color-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Màu
//                       <span className="text-red-600 ">*</span>
//                     </Label>
//                     <Input
//                       id={`color-${parentIndex}`}
//                       type="text"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].color = e.target.value;
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor={`capacity-${parentIndex}`}
//                       className="text-lg font-extrabold"
//                     >
//                       Dung lượng
//                     </Label>
//                     <Input
//                       id={`capacity-${parentIndex}`}
//                       type="text"
//                       autoComplete={"off"}
//                       onChange={(e) => {
//                         additionItems[parentIndex].storage = e.target.value;
//                       }}
//                       className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
//                     />
//                   </div>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>

//         {/** BUTTONS */}
//         <div className="flex justify-between">
//           <span className="space-x-4">
//             <Button
//               variant="positive"
//               className="text-xl"
//               onClick={(e) => handleAddItem(e)}
//             >
//               Thêm
//               <Plus />
//             </Button>
//             {additionItems.length > 1 && (
//               <Button
//                 variant="negative"
//                 className="text-xl"
//                 onClick={(e) => handleDelItem(e)}
//               >
//                 Xóa
//                 <Trash2 />
//               </Button>
//             )}
//           </span>
//           <span className="space-x-4 flex items-center">
//             {errors.root && (
//               <div className="text-red-600">{errors.root?.message}</div>
//             )}
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               variant="neutral"
//               className="text-xl"
//             >
//               {!isSubmitting ? (
//                 <>
//                   "Thêm sản phẩm"
//                   <Plus />
//                 </>
//               ) : (
//                 <LoadingSpinner size={26} className="text-white" />
//               )}
//             </Button>
//           </span>
//         </div>
//       </form>
//     </>
//   );
// };

// export default ProductAddition;

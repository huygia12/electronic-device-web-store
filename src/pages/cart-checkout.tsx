import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { District, Province, ServiceRes, Ward } from "@/types/api";
import { useCartProps } from "@/hooks";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import routes from "../middleware/routes";
import { ShippingForm, ShippingSchema } from "@/schema";
import productService from "@/utils/product";
import { deliveryApis } from "@/services/apis";
import { Nullable } from "@/utils/declare";

const CartCheckout: FC = () => {
  const { itemsInLocal, removeInvoice, setPhaseID } = useCartProps();
  const [provinces, setProvinces] = useState<Province[]>();
  const [districts, setDistricts] = useState<District[]>();
  const [wards, setWards] = useState<Ward[]>();
  const [curProvinceID, setCurProvinceID] = useState("");
  const [curDistrictID, setCurDistrictID] = useState("");
  const [curWardID, setCurWardID] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [shippingFee, setShippingFee] = useState<Nullable<number>>(null);
  const [shippingTime, setShippingTime] = useState(0);
  const [total, setTotal] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(ShippingSchema),
  });

  useEffect(() => {
    const init = async () => {
      setPhaseID("2");

      setTotal(
        productService.getTotalAmount(itemsInLocal) -
          productService.getTotalDiscountAmount(itemsInLocal)
      );

      const fetchedProvinces: Province[] = await deliveryApis.getProvinces();
      setProvinces(fetchedProvinces);
    };

    init();
  }, [itemsInLocal, setPhaseID]);

  useEffect(() => {
    /** DISTRICT */
    const fetchData = async () => {
      const fetchedDistricts: District[] = await deliveryApis.getDistricts(
        Number(curProvinceID)
      );

      setDistricts(fetchedDistricts);
    };

    fetchData();
  }, [curProvinceID]);

  useEffect(() => {
    /** WARD */
    const fetchData = async () => {
      const fetchedWards = await deliveryApis.getWards(Number(curDistrictID));
      // console.log(`fetch wards for district(${curDistrictID})`, wardsRes);
      setWards(fetchedWards);

      if (fetchedWards.length === 0) return;

      /** GET SHIPPING SERVICE ID */
      const fetchedServices: Nullable<ServiceRes> =
        await deliveryApis.getServices(Number(curDistrictID));

      if (!fetchedServices) return;

      let serviceIDValue = "";
      fetchedServices &&
        fetchedServices.data.forEach((service) => {
          if (
            service.service_type_id ==
            import.meta.env.VITE_SHOP_SHIPPING_SERVICE
          ) {
            serviceIDValue = String(service.service_id);
          }
        });

      // console.log(`fetch services`, serviceIDValue);
      setServiceID(serviceIDValue);
    };

    fetchData();
  }, [curDistrictID]);

  const handleWardChange = async (value: string) => {
    /** CACULATE TOTAL SHIPPING FEE */
    let fee: number = 0;

    if (value) {
      const promises = itemsInLocal.map(async (item) => {
        const itemShippingFee: Nullable<number> =
          await deliveryApis.getShippingFee(
            Number(serviceID),
            Number(curDistrictID),
            curWardID,
            item
          );
        if (!itemShippingFee) throw new Error();
        return itemShippingFee;
      });

      // Waiting for all the promise to be done before caculate the shippingfee
      Promise.all(promises)
        .then((fees) => {
          fee = fees.reduce((prev, curr) => prev + curr, 0);
          setShippingFee(fee);
          setCurWardID(value);
          setTotal(total + fee);
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            // AxiosError-specific handling
            console.error("Axios error:", error.message);
            if (error.response) {
              console.error(
                "Fetching shippingfee error: ",
                error.response.data
              );
              console.error("Response status: ", error.response.status);
            }
          } else {
            // General error handling
            console.error("Unexpected error:", error);
          }
        });

      /** GET DELIVERY TIME */
      const shippingTimeValue: Nullable<number> =
        await deliveryApis.getDeliveryTime(
          Number(serviceID),
          Number(curDistrictID),
          value
        );

      shippingTimeValue && setShippingTime(shippingTimeValue);
      clearErrors("ward");
    }
  };

  const handleDistrictChange = (value: string) => {
    setCurDistrictID(value);
    setCurWardID("");
    setValue("ward", "");
    setShippingFee(null);
    clearErrors("district");
  };

  const handleProvinceChange = (value: string) => {
    setCurProvinceID(value);
    setCurDistrictID("");
    setValue("district", "");
    setCurWardID("");
    setValue("ward", "");
    setShippingFee(null);
    clearErrors("province");
  };

  /** TO-DO */
  const handleShippingFormSubmisstion: SubmitHandler<
    ShippingForm
  > = async () => {
    try {
      toast.success("Thanh toán thành công!");
      removeInvoice();
      await routes.navigate("/", { unstable_viewTransition: true });
    } catch (error) {
      setError("root", {
        message: "Thanh toán thất bại!",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleShippingFormSubmisstion)}
      className="grid grid-cols-4 w-full gap-4"
    >
      {/** CART LIST */}
      <section className="grid grid-cols-3 gap-4 col-span-3 border-2 border-slate-2 rounded-md p-4">
        <h1 className="text-2xl font-semibold col-span-3">
          THÔNG TIN GIAO HÀNG
        </h1>
        {/** ACCOUNT NAME */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-lg">
            Họ và tên
          </Label>
          <Input
            id="name"
            type="text"
            disabled={true}
            placeholder="abc"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
        </div>
        {/** ACCOUNT EMAIL */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-lg  ">
            Email
            <span className="text-red-600 ">*</span>
          </Label>
          <Input
            {...register("email")}
            id="name"
            type="text"
            placeholder="abc@gmail.com"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
          {errors.email && (
            <div className="text-red-600">{errors.email.message}</div>
          )}
        </div>
        {/** ACCOUNT PHONE NUMBER */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-lg  ">
            Số điện thoại
            <span className="text-red-600 ">*</span>
          </Label>
          <Input
            {...register("phoneNumber")}
            id="name"
            type="text"
            placeholder="+84"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
          {errors.phoneNumber && (
            <div className="text-red-600">{errors.phoneNumber.message}</div>
          )}
        </div>
        {/** PROVINCE */}
        <div className="space-y-1">
          <Label htmlFor="category" className="text-lg  ">
            Tỉnh/Thành phố
            <span className="text-red-600 ">*</span>
          </Label>
          <Select
            // value={curProvinceID}
            onValueChange={(value) => handleProvinceChange(value)}
          >
            <SelectTrigger
              value={curProvinceID}
              {...register("province")}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            >
              <SelectValue id="category" className="p-0" />
            </SelectTrigger>
            <SelectContent>
              {provinces?.map((province, index) => {
                return (
                  <SelectItem
                    key={index}
                    value={province.ProvinceID + ""}
                    className="max-w-[30rem] truncate"
                  >
                    {province.ProvinceName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.province && (
            <div className="text-red-600">{errors.province.message}</div>
          )}
        </div>
        {/** DISTRICT */}
        <div className="space-y-1">
          <Label htmlFor="category" className="text-lg  ">
            Quận/Huyện
            <span className="text-red-600 ">*</span>
          </Label>
          <Select
            // value={curDistrictID}
            onValueChange={(value) => handleDistrictChange(value)}
          >
            <SelectTrigger
              value={curDistrictID}
              {...register("district")}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            >
              <SelectValue id="category" className="p-0" />
            </SelectTrigger>
            <SelectContent>
              {districts?.map((district, index) => {
                return (
                  <SelectItem
                    key={index}
                    value={district.DistrictID + ""}
                    className="max-w-[30rem] truncate"
                  >
                    {district.DistrictName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.district && (
            <div className="text-red-600">{errors.district.message}</div>
          )}
        </div>
        {/** WARD */}
        <div className="space-y-1">
          <Label htmlFor="category" className="text-lg  ">
            Phường/Xã
            <span className="text-red-600 ">*</span>
          </Label>
          <Select
            // value={curWardID}
            onValueChange={(value) => handleWardChange(value)}
          >
            <SelectTrigger
              value={curWardID}
              {...register("ward")}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            >
              <SelectValue id="category" className="p-0" />
            </SelectTrigger>
            <SelectContent>
              {wards?.map((ward, index) => {
                return (
                  <SelectItem
                    key={index}
                    value={ward.WardCode}
                    className="max-w-[30rem] truncate"
                  >
                    {ward.WardName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.ward && (
            <div className="text-red-600">{errors.ward.message}</div>
          )}
        </div>
        {/** DETAIL ADDRESS */}
        <div className="col-span-3 space-y-1">
          <Label htmlFor="name" className="text-lg  ">
            Địa chỉ cụ thể
          </Label>
          <Input
            id="name"
            type="text"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
        </div>
        {/** NOTION */}
        <div className="col-span-3 space-y-1">
          <Label htmlFor="desc" className="text-lg">
            Ghi chú đơn hàng
          </Label>
          <Textarea
            id="desc"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
        </div>
      </section>

      {/** BILL */}
      <section className="rounded-md">
        <Card className="">
          <CardHeader className="px-4">
            <CardTitle className="mb-4">ĐƠN HÀNG</CardTitle>
            <CardDescription>
              Thông tin giao hàng sẽ được tiếp nhận bởi dịch vụ chuyển phát GHN.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4">
            <Separator className="border-dashed" />
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span>
                {productService.getTotalAmount(itemsInLocal).toLocaleString() +
                  "đ"}
              </span>
            </div>
            {shippingFee && (
              <>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString() + "đ"}</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>Tổng tiền giảm giá</span>
              <del>
                {productService
                  .getTotalDiscountAmount(itemsInLocal)
                  .toLocaleString() + "đ"}
              </del>
            </div>
            <Separator className="border-dashed" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-primary text-xl">Tổng thanh toán</span>
              <span>{total.toLocaleString() + "đ"}</span>
            </div>
          </CardContent>
          <CardFooter className="mt-4 px-4 flex flex-col">
            <Button
              type="submit"
              variant="neutral"
              disabled={itemsInLocal.length === 0}
              className="w-full"
            >
              Hoàn thành đơn hàng
            </Button>
            {shippingFee && (
              <div className="mt-10 text-[0.8rem] ">
                <span className="font-semibold">
                  <span className="text-red-600 ">*</span>
                  Ghi chú:
                </span>
                <span>
                  {` đảm bảo nhận hàng trong vòng ${Math.round(shippingTime / (1000 * 60 * 60 * 24))} ngày.`}
                </span>
              </div>
            )}
          </CardFooter>
        </Card>
      </section>
    </form>
  );
};

export default CartCheckout;

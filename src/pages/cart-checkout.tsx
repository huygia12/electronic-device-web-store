import { District, Province, ServiceRes, Ward } from "@/types/api";
import { useCartProps, useCurrentUser, useCustomNavigate } from "@/hooks";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cartService, invoiceService } from "@/services";
import { deliveryService } from "@/services";
import { Nullable } from "@/utils/declare";
import { ShippingForm, ShippingSchema } from "@/utils/schema";
import { BillDisplay, ShippingInputs } from "@/components/cart-checkout";
import { toast } from "sonner";

const CartCheckout: FC = () => {
  const { itemsInLocal, setPhaseID, removeInvoice } = useCartProps();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [serviceID, setServiceID] = useState("");
  const [shippingFee, setShippingFee] = useState<Nullable<number>>(null);
  const [shippingTime, setShippingTime] = useState(0);
  const [totalAmountOfBill, setTotalAmountOfBill] = useState(0);
  const { currentUser } = useCurrentUser();
  const { navigate } = useCustomNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(ShippingSchema),
  });

  const province = watch("province");
  const district = watch("district");
  const ward = watch("ward");

  useEffect(() => {
    const setup = async () => {
      setPhaseID("2");

      setTotalAmountOfBill(
        cartService.getTotalAmount(itemsInLocal) -
          cartService.getTotalDiscountAmount(itemsInLocal)
      );

      const fetchedProvinces: Province[] =
        await deliveryService.apis.getProvinces();
      setProvinces(fetchedProvinces);
    };

    setup();
  }, []);

  useEffect(() => {
    /** DISTRICT */
    const fetchData = async () => {
      const fetchedDistricts: District[] =
        await deliveryService.apis.getDistricts(Number(province));

      setDistricts(fetchedDistricts);
    };

    province && fetchData();
  }, [province]);

  useEffect(() => {
    /** WARD */
    const fetchData = async () => {
      const fetchedWards = await deliveryService.apis.getWards(
        Number(district)
      );
      setWards(fetchedWards);

      if (fetchedWards.length === 0) return;

      /** GET SHIPPING SERVICE ID */
      const fetchedServices: Nullable<ServiceRes> =
        await deliveryService.apis.getServices(Number(district));

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

      setServiceID(serviceIDValue);
    };

    district && fetchData();
  }, [district]);

  const handleWardChange = async (value: string) => {
    /** CACULATE TOTAL SHIPPING FEE */
    setValue("ward", value);
    let fee: number = 0;

    if (value) {
      const promises = itemsInLocal.map(async (item) => {
        const itemShippingFee: Nullable<number> =
          await deliveryService.apis.getShippingFee(
            Number(serviceID),
            Number(district),
            watch("ward"),
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
          setTotalAmountOfBill(totalAmountOfBill + fee);
        })
        .catch((error) => {
          console.error("Unexpected error:", error);
        });

      /** GET DELIVERY TIME */
      const shippingTimeValue: Nullable<number> =
        await deliveryService.apis.getDeliveryTime(
          Number(serviceID),
          Number(district),
          value
        );

      shippingTimeValue && setShippingTime(shippingTimeValue);
      clearErrors("ward");
    }
  };

  const handleDistrictChange = (value: string) => {
    setValue("district", value);
    setValue("ward", "");
    setShippingFee(null);
    clearErrors("district");
  };

  const handleProvinceChange = (value: string) => {
    setValue("province", value);
    setValue("district", "");
    setValue("ward", "");
    setShippingFee(null);
    clearErrors("province");
  };

  //TODO: handle reponse payload afteer submit order
  const handleShippingFormSubmission: SubmitHandler<ShippingForm> = async (
    data
  ) => {
    const createOrder = invoiceService.apis.createOrder({
      ...data,
      userID: currentUser!.userID,
      shippingFee: shippingFee || 0,
      shippingTime: shippingTime || 0,
      invoiceProducts: invoiceService.getProductOrderInsertion(itemsInLocal),
    });

    toast.promise(createOrder, {
      loading: "Đang xử lý...",
      success: () => {
        removeInvoice();
        navigate("/", { unstable_viewTransition: true });
        return `Yêu cầu mua hàng thành công <br/> Đơn hàng đã được gửi tới admin!`;
      },
      error: "Yêu cầu mua hàng thất bại!",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleShippingFormSubmission)}
      className="grid grid-cols-4 w-full gap-4"
    >
      <ShippingInputs
        register={register}
        errors={errors}
        provinces={provinces}
        districts={districts}
        wards={wards}
        handleProvinceChange={handleProvinceChange}
        handleDistrictChange={handleDistrictChange}
        handleWardChange={handleWardChange}
        selectedProvince={province}
        selectedDistrict={district}
        selectedWard={ward}
      />

      {/** BILL */}
      <BillDisplay
        shippingFee={shippingFee}
        shippingTime={shippingTime}
        totalMoney={totalAmountOfBill}
      />
    </form>
  );
};

export default CartCheckout;

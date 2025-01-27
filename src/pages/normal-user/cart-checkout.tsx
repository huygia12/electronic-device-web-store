import { District, Province, ShippingService, Ward } from "@/types/payload";
import { useCartProps, useCurrentUser, useCustomNavigate } from "@/hooks";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cartService, invoiceService, productService } from "@/services";
import { deliveryService } from "@/services";
import { ShippingFormProps, ShippingSchema } from "@/utils/schema";
import { Bill, ShippingInputs } from "@/components/cart-checkout";
import { toast } from "sonner";
import { ProductInCart } from "@/components/user";
import { useSearchParams } from "react-router-dom";
import { CartItem } from "@/types/model";

const CartCheckout: FC = () => {
  const [searchParams] = useSearchParams();
  const { itemsInLocal, setPhaseID, removeInvoice } = useCartProps();
  const { currentUser } = useCurrentUser();
  const { navigate } = useCustomNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [serviceID, setServiceID] = useState<string>("");
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [shippingTime, setShippingTime] = useState<number | null>(null);
  const [totalAmountOfBill, setTotalAmountOfBill] = useState(
    cartService.getTotalAmount(itemsInLocal) -
      cartService.getTotalDiscountAmount(itemsInLocal)
  );

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ShippingFormProps>({
    resolver: zodResolver(ShippingSchema),
  });

  const province = watch("province");
  const district = watch("district");
  const ward = watch("ward");

  useEffect(() => {
    const setup = async () => {
      setPhaseID("2");
      const productIDInQuery: string | null = searchParams.get("productID");
      const itemIDInQuery: string | null = searchParams.get("itemID");
      const quantity: string | null = searchParams.get("quantity");

      if (currentUser) {
        setValue("email", currentUser.email);
        currentUser.phoneNumber &&
          setValue("phoneNumber", currentUser.phoneNumber);
      }

      if (productIDInQuery && itemIDInQuery && quantity) {
        const product =
          await productService.apis.getProductFullJoin(productIDInQuery);
        const item = productService.convertProductToCartItem(
          product,
          itemIDInQuery,
          Number(quantity)
        );
        setCartItems([item]);
      } else {
        setCartItems(itemsInLocal);
      }

      const provincesResponse: Province[] =
        await deliveryService.apis.getProvinces();
      setProvinces(provincesResponse);
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
      const fetchedServices: ShippingService | null =
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
      const promises = cartItems!.map(async (item) => {
        const itemShippingFee: number | null =
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
          setTotalAmountOfBill((totalAmountOfBill) => totalAmountOfBill + fee);
        })
        .catch((error) => {
          console.error("Unexpected error:", error);
        });

      /** GET DELIVERY TIME */
      const newShippingTime: number | null =
        await deliveryService.apis.getDeliveryTime(
          Number(serviceID),
          Number(district),
          value
        );

      setShippingTime(newShippingTime);
      clearErrors("ward");
    }
  };

  const handleDistrictChange = (value: string) => {
    setValue("district", value);
    setValue("ward", "");
    setShippingFee(null);
    setShippingTime(null);
    clearErrors("district");
  };

  const handleProvinceChange = (value: string) => {
    setValue("province", value);
    setValue("district", "");
    setValue("ward", "");
    setShippingFee(null);
    setShippingTime(null);
    clearErrors("province");
  };

  const handleShippingFormSubmission: SubmitHandler<ShippingFormProps> = async (
    data
  ) => {
    if (!currentUser) {
      navigate("/login", { unstable_viewTransition: true });
      return;
    }

    const createOrder = invoiceService.apis.createInvoice({
      ...data,
      province: deliveryService.getProvice(provinces, Number(data.province)),
      district: deliveryService.getDistrict(districts, Number(data.district)),
      ward: deliveryService.getWard(wards, data.ward),
      userID: currentUser.userID,
      shippingFee: shippingFee || 0,
      shippingTime: shippingTime || 0,
      invoiceProducts: invoiceService.getProductOrderInsertion(cartItems!),
    });

    toast.promise(createOrder, {
      loading: "Đang xử lý...",
      success: () => {
        removeInvoice();
        navigate("/", { unstable_viewTransition: true });
        return `Đơn hàng đã được gửi tới admin xem xét!`;
      },
      error: "Yêu cầu mua hàng thất bại!",
    });
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(handleShippingFormSubmission)}
        className="flex flex-col 3xl_grid 3xl_grid-cols-4 w-full gap-4"
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
          className="col-span-3"
        />

        {/** BILL */}
        <Bill
          cartItems={cartItems}
          shippingFee={shippingFee}
          shippingTime={shippingTime}
          totalMoney={totalAmountOfBill}
        />
      </form>

      <ProductInCart cartItems={cartItems} className="mt-8" />
    </div>
  );
};

export default CartCheckout;

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Category, ProductFullJoin, Provider } from "@/types/model";
import { SwatchBook } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BannerImage,
  CollectionHeader,
  ProductCard,
  ProductCollection,
  SlideShow,
} from "@/components/user";
import CardProduct from "@/components/user/product-card";
import { LAPTOP_ID, PHONE_ID, slides } from "./data";
import { productService, providerService } from "@/services";
import categoryService from "@/services/category";
import { CardSkeleton, LinesSkeleton } from "@/components/common/skeleton";
import { useCustomNavigate } from "@/hooks";

const Homepage: FC = () => {
  const [providersData, setProvidersData] = useState<Provider[]>();
  const [categoriesData, setCategoriesData] = useState<Category[]>();
  const [phonesData, setPhonesData] = useState<ProductFullJoin[]>();
  const [laptopsData, setLaptopsData] = useState<ProductFullJoin[]>();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const { navigate } = useCustomNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes: Category[] =
          await categoryService.apis.getCategories();
        const providersRes: Provider[] =
          await providerService.apis.getProviders();

        const phonesDataRes: ProductFullJoin[] =
          await productService.apis.getProductsFullJoinWithCategoryID(PHONE_ID);
        const laptopsDataRes: ProductFullJoin[] =
          await productService.apis.getProductsFullJoinWithCategoryID(
            LAPTOP_ID
          );

        setPhonesData(phonesDataRes);
        setLaptopsData(laptopsDataRes);
        setCategoriesData(categoriesRes);
        setProvidersData(providersRes);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log("error");
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <section className="flex flex-row max-h-[40.8rem] space-x-3 mb-[4rem]">
        <form className="bg-white shadow-general w-1/6 min-h-full rounded-lg overflow-hiddenv">
          <h1 className="bg-theme space-x-1 flex items-center text-[1rem] font-semibold pt-4 pb-4 pl-2">
            <SwatchBook />
            <span>DANH MỤC SẢN PHẨM</span>
          </h1>
          <Select
            onValueChange={async (e) => {
              navigate(`products?providerID=${e}`, {
                unstable_viewTransition: true,
              });
            }}
          >
            <SelectTrigger className="w-full h-12 p-3 pl-8 text-md font-medium focus_!ring-0 focus_!ring-offset-0 focus_rounded-none border-b-0 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer hover_bg-slate-200">
              <SelectValue placeholder="Nhãn hàng" />
            </SelectTrigger>
            <SelectContent className="right-[-104%] top-[-2.7rem]">
              {providersData?.map((provider, index) => {
                return (
                  <SelectItem key={index} value={provider.providerID}>
                    {provider.providerName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {categoriesData ? (
            <ul>
              {categoriesData.map((cate, index) => {
                return (
                  <li
                    onClick={() => {
                      navigate(`products?categoryID=${cate.categoryID}`, {
                        unstable_viewTransition: true,
                      });
                    }}
                    key={index}
                    className="w-full font-medium p-3 pl-8 cursor-pointer hover_bg-slate-200 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer truncate"
                  >
                    {cate.categoryName}
                  </li>
                );
              })}
            </ul>
          ) : (
            <LinesSkeleton quantity={5} />
          )}
        </form>
        <div className="grid grid-cols-3 gap-3 w-5/6">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            className="w-full col-span-2 row-span-2 rounded-xl shadow-neutral-500 shadow-md"
          >
            <CarouselContent>
              {slides.map((item, index) => {
                return (
                  <SlideShow
                    src={item.src}
                    alt={item.alt}
                    key={index}
                    link={item.link}
                  />
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="z-10 top-[50%] left-[1rem] bg-transparent h-[3rem] w-[3rem]" />
            <CarouselNext className="z-10 top-[50%] right-[1rem] bg-transparent h-[3rem] w-[3rem]" />
          </Carousel>
          <BannerImage src="/banner1.jpg" alt="banner1" link="/products" />
          <BannerImage src="/banner2.jpg" alt="banner2" link="/products" />
          <BannerImage src="/banner3.jpg" alt="banner3" link="/products" />
          <BannerImage src="/banner4.jpg" alt="banner4" link="/products" />
          <BannerImage src="/banner5.jpg" alt="banner5" link="/products" />
        </div>
      </section>
      {/* <section className="bg-theme-softer rounded-xl">
        <div className="px-6 flex pt-5 text-[1.5rem] items-center space-x-2 font-extrabold text-primary-foreground">
          ⚡ KHUYẾN MẠI SHOCK NHẤT 🔥
        </div>
        <Carousel className="px-6">
          <CarouselContent className="px-2 pb-6 pt-4">
            {productsDa.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="top-[-1rem] left-[91%] w-10 bg-primary border-2 border-red-600" />
          <CarouselNext className="top-[-1rem] right-[2rem] w-10 bg-primary border-2 border-red-600" />
        </Carousel>
        <div className="pb-6 w-full flex items-center justify-around">
          <NavLink
            to="/products"
            className="bg-white p-2 px-4 content-center rounded-md flex items-center transition ease-in duration-200 hover_bg-theme "
          >
            <span> Xem tất cả </span>
            <span> &nbsp; ⚡ KHUYẾN MẠI SHOCK NHẤT</span>
            <IoIosArrowDropright className="ml-2" />
          </NavLink>
        </div>
      </section> */}
      <section className="w-full my-16 space-y-20">
        <div>
          <CollectionHeader title="LAPTOP" />
          <ProductCollection>
            {laptopsData
              ? laptopsData.map((product, index) => (
                  <CarouselItem key={index} className="basis-1/5">
                    <CardProduct product={product} className="shadow-none" />
                  </CarouselItem>
                ))
              : Array.from({ length: 20 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-1/5">
                    <CardSkeleton />
                  </CarouselItem>
                ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="ĐIỆN THOẠI" />
          <ProductCollection>
            {phonesData
              ? phonesData.map((product, index) => (
                  <CarouselItem key={index} className="basis-1/5">
                    <ProductCard product={product} className="shadow-none" />
                  </CarouselItem>
                ))
              : Array.from({ length: 20 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-1/5">
                    <CardSkeleton />
                  </CarouselItem>
                ))}
          </ProductCollection>
        </div>
      </section>
    </main>
  );
};

export default Homepage;

import BannerImg from "@/components/ui/bannerImg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SlideShow from "@/components/ui/slideShow";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";
import CardProduct from "@/components/card4Product";
import {
  CollectionHeader,
  ProductCollection,
} from "@/components/productCollection";
import axios from "axios";
import { Category, ProductDetail, Provider } from "@/declare";
import log from "loglevel";
import { SwatchBook } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import preApiLoader from "@/api/preApiLoader.ts";
import { publicRoutes } from "./routes";
const LAPTOP_ID = "3f7ba103-bd25-4fcd-9116-fea7ee9a08f9";
const PHONE_ID = "e5bee2b2-a457-46f4-992e-dd32e5e19b5a";

const slides: { src: string; alt: string; link: string }[] = [
  { src: "/slideShow1.png", alt: "slide1", link: "/products" },
  { src: "/slideShow2.jpg", alt: "slide2", link: "/products" },
  { src: "/slideShow3.png", alt: "slide3", link: "/products" },
  { src: "/slideShow4.jpg", alt: "slide4", link: "/products" },
  { src: "/slideShow5.jpg", alt: "slide5", link: "/products" },
  { src: "/slideShow6.jpg", alt: "slide6", link: "/products" },
  { src: "/slideShow7.jpg", alt: "slide7", link: "/products" },
];

const Homepage = () => {
  const [providersData, setProvidersData] = useState<Provider[]>();
  const [categoriesData, setCategoriesData] = useState<Category[]>();

  const [phonesData, setPhonesData] = useState<ProductDetail[]>();
  const [laptopsData, setLaptopsData] = useState<ProductDetail[]>();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes: Category[] | undefined =
          await preApiLoader.getCategories();
        const providersRes: Provider[] | undefined =
          await preApiLoader.getProviders();

        const phonesDataRes: ProductDetail[] | undefined =
          await preApiLoader.getProductWithCategoryID(PHONE_ID);
        const laptopsDataRes: ProductDetail[] | undefined =
          await preApiLoader.getProductWithCategoryID(LAPTOP_ID);

        console.log(JSON.stringify(phonesDataRes));
        setPhonesData(phonesDataRes);
        setLaptopsData(laptopsDataRes);
        setCategoriesData(categoriesRes);
        setProvidersData(providersRes);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log("error");
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
    <main>
      <section className="flex flex-row max-h-[40.8rem] space-x-3 mb-[4rem]">
        <form className="bg-white shadow-general w-1/6 min-h-full rounded-lg overflow-hiddenv">
          <h1 className="bg-theme space-x-1 flex items-center text-[1rem] font-semibold pt-4 pb-4 pl-2">
            <SwatchBook />
            <span>DANH MỤC SẢN PHẨM</span>
          </h1>
          <Select
            onValueChange={async (e) => {
              await publicRoutes.navigate(`products?providerID=${e}`, {
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
          <ul>
            {categoriesData?.map((cate, index) => {
              return (
                <li
                  onClick={async () => {
                    await publicRoutes.navigate(
                      `products?categoryID=${cate.categoryID}`,
                      {
                        unstable_viewTransition: true,
                      }
                    );
                  }}
                  key={index}
                  className="w-full font-medium p-3 pl-8 cursor-pointer hover_bg-slate-200 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer truncate"
                >
                  {cate.categoryName}
                </li>
              );
            })}
          </ul>
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
          <BannerImg src="/banner1.jpg" alt="banner1" link="/products" />
          <BannerImg src="/banner2.jpg" alt="banner2" link="/products" />
          <BannerImg src="/banner3.jpg" alt="banner3" link="/products" />
          <BannerImg src="/banner4.jpg" alt="banner4" link="/products" />
          <BannerImg src="/banner5.jpg" alt="banner5" link="/products" />
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
        {laptopsData && (
          <div>
            <CollectionHeader title="LAPTOP"></CollectionHeader>
            <ProductCollection>
              {laptopsData.map((product, index) => (
                <CarouselItem key={index} className="basis-1/5">
                  <CardProduct
                    product={product}
                    className="shadow-none"
                  ></CardProduct>
                </CarouselItem>
              ))}
            </ProductCollection>
          </div>
        )}
        {phonesData && (
          <div>
            <CollectionHeader title="ĐIỆN THOẠI"></CollectionHeader>
            <ProductCollection>
              {phonesData.map((product, index) => (
                <CarouselItem key={index} className="basis-1/5">
                  <CardProduct
                    product={product}
                    className="shadow-none"
                  ></CardProduct>
                </CarouselItem>
              ))}
            </ProductCollection>
          </div>
        )}
      </section>
    </main>
  );
};

export default Homepage;

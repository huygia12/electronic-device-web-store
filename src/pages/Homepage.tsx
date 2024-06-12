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
import { IoIosArrowDropright } from "react-icons/io";
import { NavLink } from "react-router-dom";
import {
  CollectionHeader,
  ProductCollection,
} from "@/components/productCollection";
import axios from "axios";
import { Category, Product, Provider } from "@/declare";
import log from "loglevel";
import { SwatchBook } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
log.setLevel("error");

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
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [providersData, setProvidersData] = useState<Provider[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get<Product[]>(
          "http://localhost:4000/products"
        );
        const categoriesRes = await axios.get<Category[]>(
          "http://localhost:4000/categories"
        );
        const providersRes = await axios.get<Provider[]>(
          "http://localhost:4000/providers"
        );

        setProductsData(productsRes.data);
        setCategoriesData(categoriesRes.data);
        setProvidersData(providersRes.data);
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
          <Select>
            <SelectTrigger className="w-full h-12 p-3 pl-8 text-md font-medium focus_!ring-0 focus_!ring-offset-0 focus_rounded-none border-b-0 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer hover_bg-slate-200">
              <SelectValue placeholder="Nhãn hàng" />
            </SelectTrigger>
            <SelectContent className="right-[-104%] top-[-2.7rem]">
              {providersData.map((provider, index) => {
                return (
                  <SelectItem key={index} value={provider.providerID}>
                    {provider.providerName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <ul>
            {categoriesData.map((cate, index) => {
              return (
                <li
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
      <section className="bg-theme-softer rounded-xl">
        <div className="px-6 flex pt-5 text-[1.5rem] items-center space-x-2 font-extrabold text-primary-foreground">
          ⚡ KHUYẾN MẠI SHOCK NHẤT 🔥
        </div>
        <Carousel className="px-6">
          <CarouselContent className="px-2 pb-6 pt-4">
            {productsData.map((product, index) => (
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
      </section>
      <section className="w-full my-16 space-y-20">
        <div>
          <CollectionHeader title="TOP SẢN PHẨM BÁN CHẠY"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="LAPTOP, PC"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="CAMERA"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="MÀN HÌNH MÁY TÍNH"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="LINH KIỆN MÁY TÍNH"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="GAMING GEAR"></CollectionHeader>
          <ProductCollection>
            {productsData.map((product, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct
                  product={product}
                  className="shadow-none"
                ></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
      </section>
    </main>
  );
};

export default Homepage;

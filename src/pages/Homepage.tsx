import BannerImg from "@/components/ui/bannerImg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SlideShow from "@/components/ui/slideShow";
import { ProductAttributes } from "@/declare";
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
  const [data, setData] = useState<ProductAttributes[]>([]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await axios.get("http://localhost:4000/items");
        setData(items.data);
      } catch (error) {
        console.log("error");
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <section className="flex flex-row max-h-[40.8rem] space-x-3 mb-[4rem]">
        <div className="bg-theme-softer w-1/5 min-h-full rounded-xl"></div>
        <div className="grid grid-cols-3 gap-3 w-4/5">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.play}
            className="col-span-2 row-span-2 rounded-xl shadow-neutral-500 shadow-md"
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
            <div className="relative">
              <CarouselPrevious className="z-10 absolute top-[-13.5rem] left-[1rem] bg-transparent h-[3rem] w-[3rem]" />
              <CarouselNext className="z-10 absolute top-[-13.5rem] left-[43.4rem] bg-transparent h-[3rem] w-[3rem]" />
            </div>
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
        <Carousel className="px-6 relative">
          <CarouselContent className="px-2 pb-6 pt-4">
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="relative">
            <CarouselPrevious className="absolute top-[-31.8rem] left-[80rem] w-10 bg-primary border-none" />
            <CarouselNext className="absolute top-[-31.8rem] right-[0.6rem] w-10 bg-primary border-none" />
          </div>
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
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="LAPTOP, PC"></CollectionHeader>
          <ProductCollection>
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="CAMERA"></CollectionHeader>
          <ProductCollection>
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="MÀN HÌNH MÁY TÍNH"></CollectionHeader>
          <ProductCollection>
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="LINH KIỆN MÁY TÍNH"></CollectionHeader>
          <ProductCollection>
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
        <div>
          <CollectionHeader title="GAMING GEAR"></CollectionHeader>
          <ProductCollection>
            {data.map((item, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <CardProduct item={item} className="shadow-none"></CardProduct>
              </CarouselItem>
            ))}
          </ProductCollection>
        </div>
      </section>
    </main>
  );
};

export default Homepage;

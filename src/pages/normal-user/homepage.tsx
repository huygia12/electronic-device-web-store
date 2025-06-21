import { FC, useEffect, useState } from "react";
import { Category, Product, Provider, Slide } from "@/types/model";
import { LAPTOP_ID, PHONE_ID } from "@/pages/data";
import { productService, providerService } from "@/services";
import categoryService from "@/services/category";
import {
  BannerSection,
  HomepageMenu,
  MenuButton,
  NormalCollection,
  TopSaleCollection,
} from "@/components/homepage";
import { cn } from "@/lib/utils";
import { useBlink } from "@/hooks";
import { useRouteLoaderData } from "react-router-dom";
import { sortBannerInSlides } from "@/utils/helpers";

const Homepage: FC = () => {
  const initData = useRouteLoaderData("userlayout") as {
    slides: Slide[];
  };
  const [providers, setProviders] = useState<Provider[]>();
  const [categories, setCategories] = useState<Category[]>();
  const [phonesData, setPhonesData] = useState<Product[]>();
  const [laptopsData, setLaptopsData] = useState<Product[]>();
  const [onSalePhones, setOnSalePhones] = useState<Product[]>();
  const [onSaleLaptops, setOnSaleLaptops] = useState<Product[]>();
  const { isBlink } = useBlink();

  useEffect(() => {
    const fetchData = async () => {
      const categoriesRes: Category[] =
        await categoryService.apis.getCategories();
      setCategories(categoriesRes);

      const providersRes: Provider[] =
        await providerService.apis.getProviders();
      setProviders(providersRes);

      const onSalePhonesResponse: { products: Product[] } =
        await productService.apis.getProductsFullJoin({
          categoryID: PHONE_ID,
          sale: "true",
        });
      setOnSalePhones(onSalePhonesResponse.products);

      const phonesDataRes: { products: Product[] } =
        await productService.apis.getProductsFullJoin({ categoryID: PHONE_ID });
      setPhonesData(phonesDataRes.products);

      const onSaleLaptopsResponse: { products: Product[] } =
        await productService.apis.getProductsFullJoin({
          categoryID: LAPTOP_ID,
          sale: "true",
        });
      setOnSaleLaptops(onSaleLaptopsResponse.products);

      const laptopsDataRes: { products: Product[] } =
        await productService.apis.getProductsFullJoin({
          categoryID: LAPTOP_ID,
        });
      setLaptopsData(laptopsDataRes.products);
    };

    fetchData();
  }, []);

  return (
    <main>
      <MenuButton
        providers={providers}
        categories={categories}
        className="block sm_hidden"
      />
      <section className="flex flex-row max-h-[40.8rem] gap-3">
        <HomepageMenu
          providers={providers}
          categories={categories}
          className={cn(
            "hidden sm_block sm_w-[40%] md_w-[30%] 3xl_w-1/5",
            isBlink && "animate-shake"
          )}
        />
        <BannerSection
          slides={sortBannerInSlides(initData.slides) as Slide[]}
          className="w-full"
        />
      </section>

      <TopSaleCollection
        to={`/products?categoryID=${PHONE_ID}&sale=true&sortByPrice=DESC`}
        headerTitle="⚡ KHUYẾN MẠI ĐIỆN THOẠI SHOCK NHẤT 🔥"
        products={onSalePhones}
        className="mt-14"
      />

      <NormalCollection
        to={`/products?categoryID=${PHONE_ID}`}
        headerTitle="ĐIỆN THOẠI BÁN CHẠY"
        products={phonesData}
        className="mt-20"
      />

      <TopSaleCollection
        to={`/products?categoryID=${LAPTOP_ID}&sale=true&sortByPrice=DESC`}
        headerTitle="⚡ KHUYẾN MẠI MÁY TÍNH SHOCK NHẤT 🔥"
        products={onSaleLaptops}
        className="mt-14"
      />

      <NormalCollection
        to={`/products?categoryID=${LAPTOP_ID}`}
        headerTitle="LAPTOP BÁN CHẠY"
        products={laptopsData}
        className="mt-20"
      />
    </main>
  );
};

export default Homepage;

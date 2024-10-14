import { FC, useEffect, useState } from "react";
import { Category, ProductFullJoin, Provider } from "@/types/model";
import { LAPTOP_ID, PHONE_ID } from "@/pages/data";
import { productService, providerService } from "@/services";
import categoryService from "@/services/category";
import {
  BannerSection,
  HomepageMenu,
  NormalCollection,
  TopSaleCollection,
} from "@/components/homepage";
import { cn } from "@/lib/utils";
import { useBlink } from "@/hooks";

const Homepage: FC = () => {
  const [providers, setProviders] = useState<Provider[]>();
  const [categories, setCategories] = useState<Category[]>();
  const [phonesData, setPhonesData] = useState<ProductFullJoin[]>();
  const [laptopsData, setLaptopsData] = useState<ProductFullJoin[]>();
  const [onSalePhones, setOnSalePhones] = useState<ProductFullJoin[]>();
  const [onSaleLaptops, setOnSaleLaptops] = useState<ProductFullJoin[]>();
  const { isBlink } = useBlink();

  useEffect(() => {
    const fetchData = async () => {
      const categoriesRes: Category[] =
        await categoryService.apis.getCategories();
      setCategories(categoriesRes);

      const providersRes: Provider[] =
        await providerService.apis.getProviders();
      setProviders(providersRes);

      const onSalePhonesResponse: ProductFullJoin[] =
        await productService.apis.getProductsFullJoin({
          categoryID: PHONE_ID,
          saleArrange: true,
        });
      setOnSalePhones(onSalePhonesResponse);

      const phonesDataRes: ProductFullJoin[] =
        await productService.apis.getProductsFullJoin({ categoryID: PHONE_ID });
      setPhonesData(phonesDataRes);

      const onSaleLaptopsResponse: ProductFullJoin[] =
        await productService.apis.getProductsFullJoin({
          categoryID: LAPTOP_ID,
          saleArrange: true,
        });
      setOnSaleLaptops(onSaleLaptopsResponse);

      const laptopsDataRes: ProductFullJoin[] =
        await productService.apis.getProductsFullJoin({
          categoryID: LAPTOP_ID,
        });
      setLaptopsData(laptopsDataRes);
    };

    fetchData();
  }, []);

  return (
    <main>
      <section className="flex flex-row max-h-[40.8rem] space-x-3 mb-[4rem]">
        <HomepageMenu
          providers={providers}
          categories={categories}
          className={cn(isBlink && "animate-shake")}
        />
        <BannerSection />
      </section>

      <TopSaleCollection
        to={`/products?categoryID=${PHONE_ID}&saleArrange=true`}
        headerTitle="⚡ KHUYẾN MẠI ĐIỆN THOẠI SHOCK NHẤT 🔥"
        products={onSalePhones}
      />

      <NormalCollection
        to={`/products?categoryID=${PHONE_ID}`}
        headerTitle="ĐIỆN THOẠI BÁN CHẠY"
        products={phonesData}
        className="mt-20"
      />

      <TopSaleCollection
        to={`/products?categoryID=${LAPTOP_ID}&saleArrange=true`}
        headerTitle="⚡ KHUYẾN MẠI MÁY TÍNH SHOCK NHẤT 🔥"
        products={onSaleLaptops}
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

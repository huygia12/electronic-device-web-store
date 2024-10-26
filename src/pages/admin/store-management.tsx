import {
  SideBanner,
  EditableSlideShow,
} from "@/components/commercial-management";
import { FC, useState } from "react";
import { editingSlides } from "../data";
import { Slide, Store } from "@/types/model";
import { SlideInsertionPayload } from "@/types/payload";
import { Banner } from "@/types/component";
import { useRouteLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BannerSection, HomepageMenu } from "@/components/homepage";

const StoreManagement: FC = () => {
  const store = useRouteLoaderData("store_management") as Store;
  const [leftBanner, setLeftBanner] = useState<Banner>({
    newBanner: undefined,
    prevBanner: store.leftBanner,
  });
  const [rightBanner, setRightBanner] = useState<Banner>({
    newBanner: undefined,
    prevBanner: store.rightBanner,
  });
  const [preview, setPreview] = useState(false);
  const [slides, setSlides] =
    useState<(Slide | SlideInsertionPayload)[]>(editingSlides);

  return (
    <div className="mb-20">
      <div className="mt-10 flex justify-between mb-6 pb-4 border-b-2 border-gray-500 border-dashed">
        <h1 className="text-2xl font-extrabold">Quản lý cửa hàng, Quảng cáo</h1>
        <span className="space-x-4">
          <Button variant="positive">Lưu thay đổi</Button>
          {preview ? (
            <Button variant="negative" onClick={() => setPreview(false)}>
              Bỏ xem
            </Button>
          ) : (
            <Button variant="neutral" onClick={() => setPreview(true)}>
              Xem trước
            </Button>
          )}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <SideBanner
          banner={leftBanner}
          setBanner={setLeftBanner}
          storeID={store.storeID}
          position="left"
          modifiable={!preview}
        />
        {preview ? (
          <section className="flex flex-row max-h-[40.8rem] space-x-3">
            <HomepageMenu
              className="hidden 2xl_block"
              providers={undefined}
              categories={undefined}
            />
            <BannerSection
              slides={slides}
              disableNavigation={true}
              className="2xl_w-4/5 auto-rows-[10rem] 4xl_auto-rows-[12rem]"
            />
          </section>
        ) : (
          <EditableSlideShow
            className="flex-1"
            slides={slides}
            editSlides={setSlides}
          />
        )}
        <SideBanner
          banner={rightBanner}
          setBanner={setRightBanner}
          storeID={store.storeID}
          position="right"
          modifiable={!preview}
        />
      </div>
    </div>
  );
};

export default StoreManagement;

import {
  SideBanner,
  EditableSlideShow,
  BannerSection,
} from "@/components/commercial-management";
import { FC, useState } from "react";
import { editingSlides } from "../data";
import { Slide, Store } from "@/types/model";
import { SlideInsertionPayload } from "@/types/payload";
import { Banner } from "@/types/component";
import { useRouteLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomepageMenu } from "@/components/homepage";

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
        <h1 className="text-4xl font-extrabold">Quản lý cửa hàng, Quảng cáo</h1>
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
      <div className="flex justify-between">
        <SideBanner
          banner={leftBanner}
          setBanner={setLeftBanner}
          storeID={store.storeID}
          position="left"
          modifiable={!preview}
        />
        {preview ? (
          <section className="flex flex-row space-x-3">
            <HomepageMenu providers={undefined} categories={undefined} />
            <BannerSection
              className="w-[70rem]"
              slides={slides}
              disableNavigation={true}
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

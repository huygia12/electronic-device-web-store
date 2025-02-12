import {
  SideBanner,
  EditableSlideShow,
} from "@/components/commercial-management";
import { FC, useState } from "react";
import { Slide, Store } from "@/types/model";
import { ImageToSlide } from "@/types/payload";
import { Banner } from "@/types/component";
import { useRouteLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BannerSection, HomepageMenu } from "@/components/homepage";
import { retrieveImageUrl, sortBannerInSlides } from "@/utils/helpers";
import { arraySwap } from "@dnd-kit/sortable";
import { storeService } from "@/services";
import { toast } from "sonner";

const StoreManagement: FC = () => {
  const initData = useRouteLoaderData("store_management") as {
    store: Store;
    slides: Slide[];
  };
  const [leftBanner, setLeftBanner] = useState<Banner>({
    newBanner: undefined,
    prevBanner: initData.store.leftBanner,
  });
  const [rightBanner, setRightBanner] = useState<Banner>({
    newBanner: undefined,
    prevBanner: initData.store.rightBanner,
  });
  const [preview, setPreview] = useState(false);
  const [slides, setSlides] = useState<(Slide | ImageToSlide)[]>([
    ...(sortBannerInSlides(initData.slides) as Slide[]),
  ]);

  const handleSaveSlides = async () => {
    const toastId = toast.loading("Đang xử lý...");
    const result = await storeService.apis.updateSlidesImage(
      initData.store.storeID,
      initData.slides,
      slides
    );
    toast.dismiss(toastId);
    if (result) {
      toast.success("Thay đổi thành công!");
    } else {
      toast.error("Thay đổi thất bại!");
    }
  };

  const handleAddSlide = (newImage: File) => {
    setSlides((prevSlides) => {
      const reIndexSlides = prevSlides.map((e, index) => {
        return {
          ...e,
          index: index + 2,
        };
      });

      return [
        {
          file: newImage,
          url: retrieveImageUrl(newImage),
          ref: null,
          index: 1,
        },
        ...reIndexSlides,
      ];
    });
  };

  const handleDeleteSlide = (slideIndex: string) => {
    const newSlides = slides.filter((slide) => `${slide.index}` !== slideIndex);
    for (let i = 0; i < newSlides.length; i++) {
      newSlides[i].index = i + 1;
    }
    setSlides(newSlides);
  };

  const handleSlideMove = (a: number, b: number) => {
    const newSlides = arraySwap(slides, a, b);
    for (let i = 0; i < newSlides.length; i++) {
      newSlides[i].index = i + 1;
    }
    setSlides(newSlides);
  };

  return (
    <div className="my-8 mx-auto w-[90vw] lgg_max-w-[98rem]">
      {/** BUTTONS */}
      <div className="flex justify-between mb-6 pb-4 border-b-2 border-gray-500 border-dashed flex-col gap-10 md_flex-row">
        <h1 className="text-2xl font-extrabold">Quản lý cửa hàng, Quảng cáo</h1>
        <span className="space-x-4 self-end">
          <Button
            className="text-sm md_text-base"
            onClick={handleSaveSlides}
            variant="positive"
          >
            Lưu thay đổi
          </Button>
          {preview ? (
            <Button
              className="text-sm md_text-base"
              variant="negative"
              onClick={() => setPreview(false)}
            >
              Bỏ xem
            </Button>
          ) : (
            <Button
              className="text-sm md_text-base"
              variant="neutral"
              onClick={() => setPreview(true)}
            >
              Xem trước
            </Button>
          )}
        </span>
      </div>

      <div className="flex justify-between gap-0 sms_gap-4">
        {/** LEFT */}
        <SideBanner
          banner={leftBanner}
          setBanner={setLeftBanner}
          storeID={initData.store.storeID}
          position="left"
          modifiable={!preview}
          className={preview ? "hidden md_block" : undefined}
        />
        {/** CENTER */}
        {preview ? (
          <section className="flex flex-row max-h-[40.8rem] gap-3">
            <HomepageMenu
              className="hidden 2xl_block 2xl_w-1/5"
              providers={undefined}
              categories={undefined}
            />
            <BannerSection
              slides={slides}
              disableNavigation={true}
              className="2xl_w-4/5"
            />
          </section>
        ) : (
          <EditableSlideShow
            className="flex-1"
            originSlides={slides}
            onSlideAddition={handleAddSlide}
            onSlideDeletion={handleDeleteSlide}
            onSlideMove={handleSlideMove}
          />
        )}
        {/** RIGHT */}
        <SideBanner
          banner={rightBanner}
          setBanner={setRightBanner}
          storeID={initData.store.storeID}
          position="right"
          modifiable={!preview}
          className={preview ? "hidden md_block" : undefined}
        />
      </div>
    </div>
  );
};

export default StoreManagement;

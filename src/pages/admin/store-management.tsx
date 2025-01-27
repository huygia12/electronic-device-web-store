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
// import { storeService } from "@/services";
// import { toast } from "sonner";

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
  const [slides, setSlides] = useState<(Slide | ImageToSlide)[]>(
    initData.slides.sort((a, b) => a.index - b.index)
  );

  const handleSaveSlides = async () => {
    console.log(`slides `, slides);
    // const toastId = toast.loading("Đang xử lý...");
    // const result = await storeService.apis.updateSlidesImage(
    //   initData.store.storeID,
    //   initData.slides,
    //   slides
    // );
    // toast.dismiss(toastId);
    // if (result) {
    //   toast.success("Thay đổi thành công!");
    // } else {
    //   toast.error("Thay đổi thất bại!");
    // }
  };

  const handleAddSlide = (slide: ImageToSlide) => {
    setSlides((prevSlides) => [...prevSlides, slide]);
  };

  const handleDeleteSlide = (slideIndex: string) => {
    setSlides((prevSlides) =>
      prevSlides.filter((slide) => `${slide.index}` !== slideIndex)
    );
  };

  const handleRefChange = (value: string | null, index: number) => {
    slides[index].ref = value;
  };

  const handleSlideMove = (newSlides: (ImageToSlide | Slide)[]) => {
    for (let i = 0; i < slides.length; i++) {
      newSlides[i].index = i;
    }
    setSlides(newSlides);
  };

  return (
    <div className="mb-20">
      <div className="mt-10 flex justify-between mb-6 pb-4 border-b-2 border-gray-500 border-dashed">
        <h1 className="text-2xl font-extrabold">Quản lý cửa hàng, Quảng cáo</h1>
        <span className="space-x-4">
          <Button onClick={handleSaveSlides} variant="positive">
            Lưu thay đổi
          </Button>
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
          storeID={initData.store.storeID}
          position="left"
          modifiable={!preview}
        />
        {preview ? (
          <section className="flex flex-row max-h-[40.8rem] space-x-3">
            <HomepageMenu
              className="hidden 2xl_block 2xl_w-1/5"
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
            parentSlides={slides}
            onSlideAddition={handleAddSlide}
            onSlideDeletion={handleDeleteSlide}
            onSlideMove={handleSlideMove}
            onRefChange={handleRefChange}
          />
        )}
        <SideBanner
          banner={rightBanner}
          setBanner={setRightBanner}
          storeID={initData.store.storeID}
          position="right"
          modifiable={!preview}
        />
      </div>
    </div>
  );
};

export default StoreManagement;

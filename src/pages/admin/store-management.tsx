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
  const [slides, setSlides] =
    useState<(Slide | SlideInsertionPayload)[]>(editingSlides);

  return (
    <div className="mt-20 flex w-full">
      <SideBanner
        banner={leftBanner}
        setBanner={setLeftBanner}
        storeID={store.storeID}
        position="left"
      />
      <EditableSlideShow
        className="flex-1"
        slides={slides}
        editSlides={setSlides}
      />
      <SideBanner
        banner={rightBanner}
        setBanner={setRightBanner}
        storeID={store.storeID}
        position="right"
      />
    </div>
  );
};

export default StoreManagement;

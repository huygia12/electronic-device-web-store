import { axiosInstance } from "@/config";
import firebaseService from "./firebase";
import { Slide, Store } from "@/types/model";
import { ImageToSlide } from "@/types/payload";

const storeEndpoint = "/stores";

function isSlideInsertionPayload(obj: unknown): obj is ImageToSlide {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "file" in obj &&
    obj.file instanceof File &&
    "url" in obj &&
    typeof (obj as ImageToSlide).url === "string" &&
    "ref" in obj &&
    (typeof (obj as ImageToSlide).ref === "string" ||
      (obj as ImageToSlide).ref === null) &&
    "index" in obj &&
    typeof (obj as ImageToSlide).index === "number"
  );
}

const storeService = {
  apis: {
    getStore: async (): Promise<{ store: Store; slides: Slide[] }> => {
      const res = await axiosInstance.get<{
        info: { store: Store; slides: Slide[] };
      }>(`${storeEndpoint}`);

      return res.data.info;
    },
    updateBannerImage: async (
      storeID: string,
      prevBanner: string | null,
      position: string,
      newBanner: File | null = null
    ): Promise<string | null> => {
      let bannerUrl: string | null = null;
      try {
        if (newBanner) {
          bannerUrl = await firebaseService.apis.insertImageToFireBase(
            newBanner,
            `store/banners`
          );
        }

        if (prevBanner) {
          firebaseService.apis.deleteImageInFireBase(prevBanner);
        }

        await axiosInstance.patch<{ info: string }>(
          `${storeEndpoint}/${storeID}/banners`,
          {
            newBanner: bannerUrl,
            position: position,
          }
        );

        return bannerUrl;
      } catch (error) {
        if (bannerUrl) {
          firebaseService.apis.deleteImageInFireBase(bannerUrl);
        }
        console.error("Unexpected error:", error);
        return null;
      }
    },
    updateSlidesImage: async (
      storeID: string,
      prevSlide: Slide[],
      newSlides: (Slide | ImageToSlide)[]
    ): Promise<boolean> => {
      const payload: Slide[] = [];
      const newBannerUrls: string[] = [];
      try {
        const promises = newSlides.map(async (slide) => {
          if (isSlideInsertionPayload(slide)) {
            const bannerUrl = await firebaseService.apis.insertImageToFireBase(
              slide.file,
              `slides`
            );
            newBannerUrls.push(bannerUrl);
            return {
              url: bannerUrl,
              ref: slide.ref,
              index: slide.index,
            };
          } else {
            return {
              url: slide.url,
              ref: slide.ref,
              index: slide.index,
            };
          }
        });

        const results = await Promise.all(promises);
        payload.push(...results);

        await axiosInstance.patch(
          `${storeEndpoint}/${storeID}/slides`,
          payload
        );

        //delete all slides which are not contained in the newer slider
        prevSlide.forEach((slide) => {
          if (payload.findIndex((e) => e.url === slide.url) === -1) {
            firebaseService.apis.deleteImageInFireBase(slide.url);
          }
        });

        return true;
      } catch (error) {
        console.error("Unexpected error:", error);
        if (newBannerUrls) {
          console.debug("delete from firebase urls : ", newBannerUrls);
          firebaseService.apis.deleteImagesInFireBase(newBannerUrls);
        }
        return false;
      }
    },
  },
};

export default storeService;

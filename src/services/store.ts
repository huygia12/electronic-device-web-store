import { axiosInstance } from "@/config";
import firebaseService from "./firebase";
import { Store } from "@/types/model";

const storeEndpoint = "/stores";

const storeService = {
  apis: {
    getStore: async (): Promise<Store> => {
      const res = await axiosInstance.get<{
        info: Store;
      }>(`${storeEndpoint}`);

      return res.data.info;
    },
    updateBannerImage: async (
      storeID: string,
      prevBanner: string | null,
      position: string,
      newBanner: File | null = null
    ): Promise<string | null> => {
      try {
        let path = `${storeEndpoint}/${storeID}/banners`;
        let bannerUrl: string | null = null;
        if (newBanner) {
          bannerUrl = await firebaseService.apis.insertImageToFireBase(
            newBanner,
            `store/banners`
          );
        }

        if (prevBanner) {
          firebaseService.apis.deleteImageInFireBase(prevBanner);
          path = `${path}?prevBannerUrl=${prevBanner}`;
        }

        await axiosInstance.patch<{ info: string }>(path, {
          newBanner: bannerUrl,
          position: position,
        });

        return bannerUrl;
      } catch (error) {
        console.error("Unexpected error:", error);
        return null;
      }
    },
  },
};

export default storeService;

import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import { Nullable } from "@/utils/declare";
import axios from "axios";
import firebaseService from "./firebase";
import { StoreFullJoin } from "@/types/model";

const storeService = {
  apis: {
    getStore: async () => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: StoreFullJoin;
        }>("/stores", reqConfig);

        return res.data.info;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
        return null;
      }
    },
    updateBannerImage: async (
      storeID: string,
      prevBanner: Nullable<string>,
      position: string,
      newBanner: Nullable<File> = null
    ): Promise<Nullable<string>> => {
      try {
        let path = `/stores/${storeID}/banners`;
        let bannerUrl: Nullable<string> = null;
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

        await axiosInstance.patch<{ info: string }>(
          path,
          {
            newBanner: bannerUrl,
            position: position,
          },
          reqConfig
        );

        return bannerUrl;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
        return null;
      }
    },
  },
};

export default storeService;

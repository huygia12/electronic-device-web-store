import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDB } from "@/config";

const firebaseService = {
  apis: {
    insertImageToFireBase: async (file: File, folder: string) => {
      const imageUrl: StorageReference = ref(imageDB, `${folder}/${uuidv4()}`);
      await uploadBytes(imageUrl, file);
      return await getDownloadURL(imageUrl);
    },
    insertImagesToFireBase: async (
      files: FileList,
      folder: string
    ): Promise<string[]> => {
      return await Promise.all(
        Array.from(files).map(
          async (_, index) =>
            await firebaseService.apis.insertImageToFireBase(
              files[index],
              folder
            )
        )
      );
    },
    deleteImageInFireBase: async (fileUrl: string) => {
      const imageUrl: StorageReference = ref(imageDB, fileUrl);
      await deleteObject(imageUrl);
    },
    deleteImagesInFireBase: async (imageUrls: string[]) => {
      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          await firebaseService.apis.deleteImageInFireBase(imageUrl);
        })
      );
    },
  },
};

export default firebaseService;

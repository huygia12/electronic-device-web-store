import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { imageDB } from "../firebase";

const insertImageToFireBase = async (file: File, folder: string) => {
  const imageUrl: StorageReference = ref(imageDB, `${folder}/${uuidv4()}`);
  await uploadBytes(imageUrl, file);
  return await getDownloadURL(imageUrl);
};

const insertImagesToFireBase = async (
  files: FileList,
  folder: string
): Promise<string[]> => {
  const fileUrls: string[] = [];
  await Promise.all(
    Array({ length: FileList.length }).map(async (_, index) => {
      const url = await insertImageToFireBase(files[index], folder);
      fileUrls.push(url);
    })
  );
  return fileUrls;
};

const deleteImageInFireBase = async (fileUrl: string) => {
  const imageUrl: StorageReference = ref(imageDB, fileUrl);
  await deleteObject(imageUrl);
};

const deleteImagesInFireBase = async (imageUrls: string[]) => {
  await Promise.all(
    imageUrls.map(async (imageUrl) => {
      await deleteImageInFireBase(imageUrl);
    })
  );
};

export default { insertImagesToFireBase, deleteImagesInFireBase };

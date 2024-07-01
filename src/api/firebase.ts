import { imageDb } from "@/utils/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const insertImageToFireBase = async (file: File, folder: string) => {
  const imageUrl: StorageReference = ref(imageDb, `${folder}/${uuidv4()}`);
  await uploadBytes(imageUrl, file);
  return await getDownloadURL(imageUrl);
};

const deleteImageFromFireBase = async (fileUrl: string) => {
  const imageUrl: StorageReference = ref(imageDb, fileUrl);
  await deleteObject(imageUrl);
};

export { insertImageToFireBase, deleteImageFromFireBase };

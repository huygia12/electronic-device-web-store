import { Button } from "@/components/ui/button";
// import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import { useState } from "react";

const Intro = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>();

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages(files);
    }
  };

  return (
    <div>
      <form>
        <input type="file" accept="image/*" multiple onChange={uploadFile} />
        <Button type="submit">Upload</Button>
      </form>

      {selectedImages && (
        <div>
          <h3>Selected File Details:</h3>
          <ul>
            {selectedImages.map((file, index) => (
              <li key={index}>
                <p>Name: {file.name}</p>
                <p>Type: {file.type}</p>
                <p>Size: {file.size} bytes</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Intro;

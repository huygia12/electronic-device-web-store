import { Button } from "@/components/ui/button";
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

  const handleImages = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedImages) {
      console.log(selectedImages);

      const urlObject = await fetch("http://localhost:5000/s3Url").then((res) =>
        res.json()
      );
      console.log(urlObject.url);

      await fetch(urlObject.url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: selectedImages[0],
      });

      console.log(urlObject.url.split("?")[0]);
    }
  };

  return (
    <div>
      <form>
        <input type="file" accept="image/*" multiple onChange={uploadFile} />
        <Button type="submit" onClick={handleImages}>
          Upload
        </Button>
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

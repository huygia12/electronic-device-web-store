import {
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  CustomImage,
  FileImagePlaceholder,
  RemoveIcon,
} from "@/components/common";
import { useDropzone } from "react-dropzone";
import { retrieveImageUrl } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { storeService } from "@/services";
import { toast } from "sonner";
import { Banner } from "@/types/component";

interface SideBannerProps extends HTMLAttributes<HTMLDivElement> {
  banner: Banner;
  setBanner: Dispatch<SetStateAction<Banner>>;
  storeID: string;
  position: string;
  modifiable?: boolean;
}

const SideBanner: FC<SideBannerProps> = ({ modifiable = true, ...props }) => {
  const [displayImage, setDisplayImage] = useState<string | null>(
    props.banner.prevBanner
  );
  const setNewBannerFile = (
    file: File | undefined | null,
    prevBanner?: string | null
  ) => {
    props.setBanner((banner) => {
      return {
        newBanner: file,
        prevBanner: prevBanner !== undefined ? prevBanner : banner.prevBanner,
      };
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewBannerFile(acceptedFiles[0]);
    setDisplayImage(retrieveImageUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSaveButton = async () => {
    if (props.banner.newBanner !== undefined) {
      const getBannerUrl = storeService.apis.updateBannerImage(
        props.storeID,
        props.banner.prevBanner,
        props.position,
        props.banner.newBanner
      );

      toast.promise(getBannerUrl, {
        loading: "Đang xử lý...",
        success: (bannerUrl) => {
          setDisplayImage(bannerUrl);
          setNewBannerFile(undefined, bannerUrl);
          return "Cập nhật banner thành công!";
        },
        error: "Cập nhật banner thất bại!",
      });
    } else {
      console.warn(`banner value must be image file or null`);
    }
  };

  const handleRemoveButton = () => {
    setNewBannerFile(null);
    setDisplayImage(null);
  };

  const handleResetButton = () => {
    setDisplayImage(props.banner.prevBanner);
    setNewBannerFile(undefined);
  };

  return (
    <div className={props.className}>
      {displayImage ? (
        <div className="relative w-[12rem]">
          <CustomImage
            src={displayImage}
            alt="sideBanner"
            className="rounded-lg"
          />
          {modifiable && <RemoveIcon onClick={handleRemoveButton} />}
        </div>
      ) : (
        <div className="w-[12rem]" {...getRootProps()}>
          <input {...getInputProps()} />{" "}
          <FileImagePlaceholder
            isDragActive={isDragActive}
            className="min-h-[36rem]"
          />
        </div>
      )}
      {modifiable && (
        <div className="flex justify-between mt-2">
          {props.banner.newBanner !== undefined && (
            <Button variant="positive" onClick={handleSaveButton}>
              Lưu
            </Button>
          )}
          {props.banner.newBanner !== undefined && (
            <Button variant="negative" onClick={handleResetButton}>
              Hoàn tác
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SideBanner;

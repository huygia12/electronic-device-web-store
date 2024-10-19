import { Slide } from "@/types/model";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SlideWrapper from "./slide-wrapper";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useDropzone } from "react-dropzone";
import { SlideInsertionPayload } from "@/types/payload";
import { FileImagePlaceholder } from "../common";
import { retrieveImageUrl } from "@/utils/helpers";

interface SlideShowProps extends HTMLAttributes<HTMLDivElement> {
  slides: (Slide | SlideInsertionPayload)[];
  editSlides: Dispatch<SetStateAction<(Slide | SlideInsertionPayload)[]>>;
}

const EditableSlideShow: FC<SlideShowProps> = ({ className, ...props }) => {
  const slideIds = useMemo(
    () => props.slides.map((slide) => slide.index),
    [props.slides]
  );
  const [activeSlide, setActiveSlide] = useState<
    Slide | SlideInsertionPayload | null
  >(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  const onDrop = useCallback((acceptedFiles: File[]) => {
    props.editSlides((prevSlides) => [
      ...prevSlides,
      {
        file: acceptedFiles[0],
        url: retrieveImageUrl(acceptedFiles[0]),
        ref: null,
        index: prevSlides.length + 1,
      },
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Slide") {
      setActiveSlide(event.active.data.current.slide);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    props.editSlides((prevSlides) => {
      const activeSlideIndex = prevSlides.findIndex(
        (slide) => slide.index === active.id
      );

      const overSlideIndex = prevSlides.findIndex(
        (slide) => slide.index === over.id
      );

      return arrayMove(prevSlides, activeSlideIndex, overSlideIndex);
    });
  };

  const handleDeleteSlide = (slideID: string) => {
    props.editSlides((prevSlides) =>
      prevSlides.filter((slide) => `${slide.index}` !== slideID)
    );
  };

  return (
    <div className={cn("grid grid-cols-3 gap-6 px-4", className)}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={slideIds}>
          {props.slides.map((slide) => (
            <SlideWrapper
              key={slide.index}
              slide={slide}
              handleDeleteSlide={handleDeleteSlide}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeSlide && (
              <SlideWrapper
                slide={activeSlide}
                handleDeleteSlide={handleDeleteSlide}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <div className="col-span-3" {...getRootProps()}>
        <input {...getInputProps()} />
        <FileImagePlaceholder isDragActive={isDragActive} className="h-40" />
      </div>
    </div>
  );
};

export default EditableSlideShow;

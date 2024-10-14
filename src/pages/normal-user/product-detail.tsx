import {
  ProductItem,
  ProductFullJoin,
  ReviewFullJoin,
  ReviewFullJoinChild,
  Review,
} from "@/types/model";
import { FC, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouteLoaderData } from "react-router-dom";
import {
  ReviewList,
  ProductDetailHeader,
  LeftDetailSection,
  RightDetailSection,
  PersonalReviewBox,
} from "@/components/product-detail";
import { useSocket } from "@/hooks";
import { productService, reviewService } from "@/services";
import { Optional } from "@/utils/declare";

const ProductDetailPage: FC = () => {
  const product = useRouteLoaderData("product_detail") as ProductFullJoin;
  const [currentItem, setCurrentItem] = useState<ProductItem>(
    product.productItems[0]
  );
  const [reviews, setReviews] = useState<ReviewFullJoin[]>([]);
  const { socket } = useSocket();
  const [replyToComment, setReplyToComment] = useState<ReviewFullJoin>();
  const [reviewDisplay, setReviewDisplay] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<ProductFullJoin[]>();
  const personalReviewBox = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const setup = async () => {
      socket?.emit(`product:join`, { productID: product.productID });
      const reviewResponse = await reviewService.apis.getReviews(
        product.productID
      );
      setReviews(reviewResponse);
      setReviewDisplay(reviewResponse.length > 5 ? 5 : reviewResponse.length);

      const products: ProductFullJoin[] =
        await productService.apis.getProductsFullJoin({
          categoryID: product.category.categoryID,
          providerID: product.provider.providerID,
          exceptID: product.productID,
          take: 5,
        });
      setRelatedProducts(products);
    };

    setup();

    const handleReviewCreate = (payload: { review: ReviewFullJoin }) => {
      if (payload.review.productID === product.productID) {
        setReviews((prevReviews) =>
          reviewService.addNewReview(payload.review, prevReviews)
        );
        if (!payload.review.parentID) {
          setReviewDisplay((prevReviewDisplay) => prevReviewDisplay + 1);
        }
      }
    };

    const handleReviewDelete = (payload: { review: Review }) => {
      if (payload.review.productID === product.productID) {
        setReviews((prevReviews) =>
          reviewService.deleteReview(payload.review, prevReviews)
        );
        if (!payload.review.parentID) {
          setReviewDisplay((prevReviewDisplay) => prevReviewDisplay - 1);
        }
      }
    };

    socket?.on("review:create", handleReviewCreate);
    socket?.on("review:delete", handleReviewDelete);

    return () => {
      socket?.emit(`product:leave`, { productID: product.productID });
      socket?.off("review:create", handleReviewCreate);
      socket?.off("review:delete", handleReviewDelete);
    };
  }, []);

  const handleReplyToComment = (
    review: ReviewFullJoin | ReviewFullJoinChild | undefined
  ) => {
    let temp: Optional<ReviewFullJoin>;
    if (review) {
      const reviewID: string = review.parentID
        ? review.parentID
        : review.reviewID;
      temp = reviews.find((review) => reviewID === review.reviewID);
    }

    setReplyToComment(temp);
  };

  return (
    <div>
      <ProductDetailHeader product={product} currentItem={currentItem} />

      <div className="grid grid-cols-2 gap-10 mb-10">
        <LeftDetailSection product={product} currentItem={currentItem} />

        <RightDetailSection
          product={product}
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          relatedProducts={relatedProducts}
        />
      </div>

      {/** DESCRIPTION AND REVIEWS*/}
      <Accordion type="single" collapsible className="w-full">
        {/** DESCRIPTION */}
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-theme rounded-tl-md rounded-tr-md p-5 font-semibold">
            Mô Tả Sản Phẩm
          </AccordionTrigger>
          <AccordionContent className="py-4 px-10 !border-x-2 border-slate-200 text-[0.9rem] contain-content">
            {product.description}
          </AccordionContent>
        </AccordionItem>

        {/** REVIEWS */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="bg-theme-softer p-5 font-semibold ">
            Đánh Giá Từ Khách Hàng
          </AccordionTrigger>
          <AccordionContent className="flex flex-col p-4 justify-center border-2 border-slate-100">
            <ReviewList
              reviews={reviews}
              setReplyToComment={handleReplyToComment}
              reviewDisplay={reviewDisplay}
              setReviewDisplay={setReviewDisplay}
              fillInRef={personalReviewBox}
            />

            <PersonalReviewBox
              ref={personalReviewBox}
              product={product}
              replyToComment={replyToComment || null}
              setReplyToComment={handleReplyToComment}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetailPage;

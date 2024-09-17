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
import ReviewList from "@/components/product-detail/review-list";
import ProductDetailHeader from "@/components/product-detail/product-detail-header";
import LeftProductDetailSection from "@/components/product-detail/left-detail-section";
import RightProductDetailSection from "@/components/product-detail/right-detail-section";
import PersonalReviewBox from "@/components/product-detail/personal-review-box";
import { useSocket } from "@/hooks";
import { reviewService } from "@/services";
import { Optional } from "@/utils/declare";

const ProductDetailPage: FC = () => {
  const product = useRouteLoaderData("product_detail") as ProductFullJoin;
  const [currentItem, setCurrentItem] = useState<ProductItem>(
    product.productItems[0]
  );
  const [reviews, setReviews] = useState<ReviewFullJoin[]>([]);
  const { commentSocket } = useSocket();
  const [replyToComment, setReplyToComment] = useState<ReviewFullJoin>();
  const [reviewDisplay, setReviewDisplay] = useState<number>(0);
  const personalReviewBox = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const setup = async () => {
      commentSocket?.emit(`product:join`, { productID: product.productID });
      const reviewResponse = await reviewService.apis.getReviews(
        product.productID
      );

      setReviews(reviewResponse);
      setReviewDisplay(reviewResponse.length > 5 ? 5 : reviewResponse.length);
    };

    setup();

    const handleReviewCreate = (payload: { review: ReviewFullJoin }) => {
      if (payload.review.productID === product.productID) {
        setReviews((prevReviews) => {
          let newReviewList: ReviewFullJoin[];
          if (payload.review.parentID) {
            newReviewList = prevReviews.map((review) => {
              if (review.reviewID === payload.review.parentID) {
                review.childrenReview.push(payload.review);
              }
              return review;
            });
          } else {
            newReviewList = [payload.review, ...prevReviews];
            setReviewDisplay((prevReviewDisplay) => prevReviewDisplay + 1);
          }
          return newReviewList;
        });
      }
    };

    const handleReviewDelete = (payload: { review: Review }) => {
      if (payload.review.productID === product.productID) {
        setReviews((prevReviews) => {
          let newReviewList: ReviewFullJoin[];
          if (payload.review.parentID) {
            newReviewList = reviewService.deleteReviewChild(
              prevReviews,
              payload.review
            );
          } else {
            newReviewList = reviewService.deleteReview(
              prevReviews,
              payload.review
            );
            setReviewDisplay((prevReviewDisplay) => prevReviewDisplay - 1);
          }
          return newReviewList;
        });
      }
    };

    commentSocket?.on("review:create", handleReviewCreate);
    commentSocket?.on("review:delete", handleReviewDelete);

    return () => {
      commentSocket?.emit(`product:leave`, { productID: product.productID });
      commentSocket?.off("review:create", handleReviewCreate);
      commentSocket?.off("review:delete", handleReviewDelete);
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
    <>
      <div>
        <ProductDetailHeader product={product} currentItem={currentItem} />

        <div className="grid grid-cols-2 gap-10 mb-10">
          <LeftProductDetailSection
            product={product}
            currentItem={currentItem}
          />

          <RightProductDetailSection
            product={product}
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
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
    </>
  );
};

export default ProductDetailPage;

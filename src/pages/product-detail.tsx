import {
  ProductItem,
  ProductFullJoin,
  ReviewFullJoin,
  ReviewFullJoinChild,
  Review,
} from "@/types/api";
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
import reviewApis from "@/services/apis/review";
import { Optional } from "@/utils/declare";
import reviewService from "@/utils/review";

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
      const reviewResponse = await reviewApis.getReviews(product.productID);

      setReviews(reviewResponse);
      setReviewDisplay(reviewResponse.length > 5 ? 5 : reviewResponse.length);
    };

    setup();
    return () => {
      commentSocket?.emit(`product:leave`, { productID: product.productID });
    };
  }, []);

  useEffect(() => {
    commentSocket?.on(
      "review:create",
      (payload: { review: ReviewFullJoin }) => {
        if (payload.review.productID === product.productID) {
          let newReviewList: ReviewFullJoin[] = [];
          if (payload.review.parentID) {
            newReviewList = reviews.map((review) => {
              if (review.reviewID === payload.review.parentID) {
                review.childrenReview.push(payload.review);
              }
              return review;
            });
          } else {
            newReviewList = [payload.review, ...reviews];
            setReviewDisplay(reviewDisplay + 1);
          }
          setReviews(newReviewList);
        }
      }
    );

    commentSocket?.on("review:delete", (payload: { review: Review }) => {
      if (payload.review.productID === product.productID) {
        let newReviewList: ReviewFullJoin[] = [];
        if (!payload.review.parentID) {
          newReviewList = reviewService.deleteReview(reviews, payload.review);
          setReviewDisplay(reviewDisplay - 1);
        } else {
          newReviewList = reviewService.deleteReviewChild(
            reviews,
            payload.review
          );
        }

        setReviews(newReviewList);
      }
    });
  }, [reviews]);

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

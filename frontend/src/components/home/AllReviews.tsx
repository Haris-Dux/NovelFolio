import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  getALLReviews,
} from "../../redux/actions/review";
import { FaStar } from "react-icons/fa";
import SingleBook from "../books/SingleBook";


// Define type for the review
interface Review {
  id: string;
  title: string;
  author: string;
  rating: number;
  image: {
    downloadURL: string;
  };
  createdAt: string;
  page?: number;
}

// Modify the reviews state type
interface ReviewsState {
  reviews: Review[];
  review_loading: boolean;
  totalPages: number;
  page: number;

}

const AllReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [productId, setProductId] = useState<string>("");
  const [singleReviewModal, setsingleReviewModal] = useState<boolean>(false);


  const { reviews, review_loading, totalPages, page } = useSelector(
    (state: any) => state.review
  ) as ReviewsState;

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageNum = pageParam ? parseInt(pageParam) : 1;

  useEffect(() => {
   
      dispatch(getALLReviews({ page: pageNum }));
    
  }, [dispatch, pageNum]);


  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} className="text-[#FFC209]" />);
    }
    return <div className="flex">{stars}</div>;
  };

  const renderPaginationLinks = () => {
    const paginationLinks = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <li key={i}>
          <Link
            to={`/?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
              i === page ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => dispatch(getALLReviews({ page: i }))}
          >
            {i}
          </Link>
        </li>
      );
    }
    return paginationLinks;
  };

  const closeReviewModal = () => {
    setsingleReviewModal(false);
    setProductId("");
  };


  const handleItemClick = (productId: string) => {
    setsingleReviewModal(true);
    setProductId(productId);
  };

  

  return (
    <>
      <section>
        <div className="mx-auto min-h-screen max-w-screen-2xl px-4 py-8 sm:py-10 lg:px-8">
          {review_loading ? (
           <div className="flex justify-center items-center min-h-screen">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
         </div>
          ) : (
            <>
              <header className="flex justify-between items-center flex-wrap">
                <div className="heading">
                  <h2 className="playfair text-xl font-bold text-gray-900 sm:text-3xl">
                    All Reviews
                  </h2>
                </div>
              </header>

              {reviews?.length > 0 ? (
                <>
                  <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {reviews.map((data, index) => (
                      <li
                        key={index}
                        className="rounded-md border bg-white border-gray-200 shadow-md"
                      >
                        <img
                          onClick={() => handleItemClick(data?.id)}
                          src={data?.image?.downloadURL}
                          alt="review book image"
                          className="h-[250px] cursor-pointer w-full rounded-t-md object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h1 className="inline-flex items-center text-lg font-semibold">
                              {data?.title}
                            </h1>
                           
                          </div>

                          <div className="flex gap-1">
                            <StarRating rating={data?.rating} />
                          </div>

                          <div className="mt-2">
                            <span className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-900">
                              {data?.author}
                            </span>
                            <span className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-4 py-1 text-[11px] font-semibold text-gray-900">
                              {new Date(data?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-center">
                    <nav aria-label="Page navigation example">
                      <ul className="flex items-center -space-x-px h-8 py-10 text-sm">
                        <li>
                          {page > 1 ? (
                            <Link
                              to={`/?page=${page - 1}`}
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 1 1 5l4 4"
                                />
                              </svg>
                            </Link>
                          ) : (
                            <button
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                              disabled
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 1 1 5l4 4"
                                />
                              </svg>
                            </button>
                          )}
                        </li>
                        {renderPaginationLinks()}
                        <li>
                          {totalPages !== page ? (
                            <Link
                              to={`/?page=${page + 1}`}
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </Link>
                          ) : (
                            <button
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-not-allowed"
                              disabled
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </button>
                          )}
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center min-h-[60vh]">
                  <p className="text-sm">You have no reviews</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {singleReviewModal && (
        <SingleBook productId={productId} closeReviewModal={closeReviewModal} />
      )}
    </>
  );
};

export default AllReviews;

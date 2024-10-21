import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AppDispatch, RootState } from "../../redux/store";
import {
  deleteUserReviews,
  getALLUserReviews,
} from "../../redux/actions/review";
import { FaStar } from "react-icons/fa";
import SingleBook from "../books/SingleBook";
import DeleteModal from "../deleteModal/DeleteModal";
import toast from "react-hot-toast";
import { AuthenticationContext } from "../../context/authenticationContext";
import { BiEdit } from "react-icons/bi";
import EditReviewModal from "../ReviewModal/EditreviewModal";

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

const UserReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [productId, setProductId] = useState<string>("");
  const [reviewData, setReviewData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [singleReviewModal, setsingleReviewModal] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = (id: string) => {
    setModalOpen(true);
    setProductId(id);
  };

  const { reviews, review_loading, totalPages, page } = useSelector(
    (state: any) => state.review
  ) as ReviewsState;

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageNum = pageParam ? parseInt(pageParam) : 1;
  const { userIsAuthenticated } = useContext(AuthenticationContext);
  const token = useSelector((state: RootState) => state?.auth?.token);

  useEffect(() => {
    if (token) {
      dispatch(getALLUserReviews({ page: pageNum }));
    }
  }, [dispatch, pageNum, token]);


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
            to={`/profile?page=${i}`}
            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
              i === page ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => dispatch(getALLUserReviews({ page: i }))}
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
    setEditModal(false);
    setProductId("");
    setReviewData(null);
  };

  const handleDelete = (id: string) => {
    const reviewId = id;
    function alterFormToAPIResult(success: string | null) {
      if (success) {
        toast.success(success);
        dispatch(getALLUserReviews({ page }));
        closeModal();
      }
    }
    dispatch(deleteUserReviews({ reviewId }, alterFormToAPIResult));
  };

  const handleItemClick = (productId: string) => {
    setsingleReviewModal(true);
    setProductId(productId);
  };

  const openEditModal = (data: any) => {
    setReviewData(data);
    setEditModal(true);
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
                    Your Reviews
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
                            {userIsAuthenticated && (
                              <>
                                <button
                                  onClick={() => openEditModal(data)}
                                  className="text-gray-500 text-xl transform transition-transform hover:scale-150"
                                >
                                  <BiEdit />
                                </button>

                                <button
                                  onClick={() => openModal(data?.id)}
                                  className="text-red-600 text-xl transform transition-transform hover:scale-150"
                                >
                                  <MdOutlineDeleteOutline />
                                </button>
                              </>
                            )}
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
                              to={`/profile?page=${page - 1}`}
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
                              to={`/profile?page=${page + 1}`}
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
      <DeleteModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        handleDelete={handleDelete}
        productId={productId}
      />
      {singleReviewModal && (
        <SingleBook productId={productId} closeReviewModal={closeReviewModal} />
      )}
      {editModal && <EditReviewModal reviewData={reviewData} closeReviewModal={closeReviewModal}/>}
    </>
  );
};

export default UserReviews;

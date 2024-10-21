import React from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store"; 

interface SingleBookProps {
  productId: string;
  closeReviewModal: () => void;
}


const SingleBook: React.FC<SingleBookProps> = ({ productId, closeReviewModal }) => {
  const { reviews } = useSelector((state: RootState) => state.review);

  const book:any = reviews?.find(
    (review:any) => review.id === productId
  );

  if (!book) {
    return <p>Book not found.</p>;
  }

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FaStar key={i} className="text-[#FFC209]" />);
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full sm:max-w-lg bg-white h-[90vh] sm:h-max overflow-y-auto shadow-md rounded-lg p-4 sm:p-6 m-4">
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
          onClick={closeReviewModal}
        >
          &times;
        </button>

        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">{book.title}</h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
          <div className="w-full sm:w-48">
            <img
              src={book.image.downloadURL}
              alt={book.title}
              className="w-full lg:h-auto h-48 rounded-md shadow-sm"
            />
          </div>

          <div className="flex-1">
            <p className="text-gray-700 mb-2 text-center sm:text-left">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-gray-700 mb-4 text-center sm:text-left">
              <strong>Published:</strong> {new Date(book.createdAt).toLocaleDateString()}
            </p>
            <div className="flex justify-center sm:justify-start">
              <StarRating rating={book.rating} />
            </div>
            <p className="text-gray-700 mt-4 text-center sm:text-left">
              <strong>Description:</strong> {book.reviewText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;

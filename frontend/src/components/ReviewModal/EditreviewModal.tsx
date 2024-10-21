import React, { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getALLUserReviews, updateReview } from "../../redux/actions/review";
import { useSearchParams } from "react-router-dom";

interface EditReviewModalProps {
  reviewData: {
    id: string;
    title: string;
    author: string;
    rating: number;
    image: {
      downloadURL: string;
    };
    reviewText: string;
    createdAt: string;

  };
  closeReviewModal: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ reviewData, closeReviewModal }) => {
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageNum = pageParam ? parseInt(pageParam) : 1;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rating: 0,
    reviewText: "",
    image: null as any,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Prefill the form with the reviewData props
    setFormData({
      title: reviewData.title,
      author: reviewData.author,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      image: reviewData.image.downloadURL,
    });
  }, [reviewData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      checkForChanges(updatedData);
      return updatedData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    const updatedData = { ...formData, image: file as any };
    setFormData(updatedData);
    checkForChanges(updatedData);
  };

  const checkForChanges = (newData: any) => {
    const hasFormChanged =
      newData.title !== reviewData.title ||
      newData.author !== reviewData.author ||
      newData.rating !== reviewData.rating ||
      newData.reviewText !== reviewData.reviewText ||
      newData.image !== reviewData.image.downloadURL;
    setHasChanges(hasFormChanged);
  };

  const getUpdatedFields = () => {
    const updatedFields: { [key: string]: any } = {};

    if (formData.title !== reviewData.title) updatedFields.title = formData.title;
    if (formData.author !== reviewData.author) updatedFields.author = formData.author;
    if (formData.rating !== reviewData.rating) updatedFields.rating = formData.rating;
    if (formData.reviewText !== reviewData.reviewText) updatedFields.reviewText = formData.reviewText;
    if (image) updatedFields.image = image;
    updatedFields.reviewId = reviewData.id;

    return updatedFields;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      toast.error("No changes made.");
      return;
    }

    const formDataToSend: any = new FormData();
    for (const key in updatedFields) {
      formDataToSend.append(key, updatedFields[key]);
    }

    dispatch(
        updateReview(formDataToSend, (error, success) => {
        if (error) {
          toast.error(error);
        } else if (success) {
          toast.success(success);
          dispatch(getALLUserReviews({ page: pageNum }));
          closeReviewModal();
        }
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="fixed inset-0 opacity-50 z-40 pointer-events-none"></div>
      <div className="relative w-full max-w-lg mx-auto bg-gray-200 shadow-md rounded px-8 pt-5 pb-8 mb-2">
        <BiX
          size={32}
          onClick={closeReviewModal}
          className="text-red-500 absolute right-1 top-1 cursor-pointer"
        />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            {/* TITLE */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Book Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter Title"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              />
            </div>

            {/* AUTHOR */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Enter Author"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              />
            </div>

            {/* Rating */}
            <div className="mb-2 col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star}>
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={formData.rating === star}
                      onChange={() =>
                        setFormData((prevData) => {
                          const updatedData = { ...prevData, rating: star };
                          checkForChanges(updatedData);
                          return updatedData;
                        })
                      }
                      className="hidden"
                    />
                    <svg
                      className={`h-6 w-6 cursor-pointer ${
                        star <= formData.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21 16.54 14.97 22 10.24 15.82 9.63 12 3.5 8.18 9.63 2 10.24 7.46 14.97 5.82 21z" />
                    </svg>
                  </label>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-2 col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter Review
              </label>
              <textarea
                id="reviewText"
                name="reviewText"
                value={formData.reviewText}
                onChange={handleInputChange}
                required
                placeholder="Enter your review"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-2 flex items-center justify-center gap-2 col-span-2">
              <div>
                {image && (
                  <img
                    src={image ? URL.createObjectURL(image) : ""}
                    alt="Uploaded Image"
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold ">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mb-4 text-gray-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 20 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG (MAX. 800x400px)
                    </p>
                    <input
                      type="file"
                      name="file"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="submit"
              disabled={!hasChanges}
              className={`w-full mt-5 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none ${
                hasChanges
                  ? "hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;

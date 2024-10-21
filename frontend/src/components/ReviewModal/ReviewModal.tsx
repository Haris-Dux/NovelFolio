import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createBookReview } from "../../redux/actions/review";

interface ReviewModalProps {
  closeReviewModal: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ closeReviewModal }) => {
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rating: 0,
    reviewText: "",
    image: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setFormData({ ...formData, image: file as any });

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend:any = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("rating", formData.rating);
    formDataToSend.append("reviewText", formData.reviewText);
    formDataToSend.append("image", image); 
    

    // Update your dispatch to handle FormData
    dispatch(createBookReview(formDataToSend, (error, success) => {
        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success(success);
            closeReviewModal();
        }
    }));
};
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="fixed inset-0  opacity-50 z-40 pointer-events-none"></div>
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
                      onChange={() => setFormData({ ...formData, rating: star })}
                      className="hidden"
                    />
                    <svg
                      className={`h-6 w-6 cursor-pointer ${
                        star <= formData.rating ? "text-yellow-500" : "text-gray-300"
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
                    className="w-full h-48 object-cover "
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
                      <span className="font-semibold">Click to upload</span>{" "}
                    </p>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../api.js";

function AddComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (images.length < 2) {
      setError("Please upload at least 2 images.");
      return;
    }

    setLoading(true);

    try {
      await createComplaint({
        ...formData,
        images,
      });
      navigate("/home/complaints");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="border w-120 min-h-175 rounded-2xl px-12 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-center">
            Add Complaint
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              className="w-full rounded-2xl border px-3 py-2 outline-none"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              className="w-full rounded-2xl border px-3 py-2 outline-none"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="technical">Technical</option>
              <option value="administrative">Administrative</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              className="w-full h-24 resize-none rounded-lg border px-4 py-3 outline-none"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Evidence Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-lg border px-3 py-2 cursor-pointer"
            />

            <p className="mt-2 text-sm text-gray-500">
              Upload at least 2 images.
            </p>

            {images.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm text-gray-700">
                  {images.length} image(s) selected
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <div key={`${image.name}-${index}`} className="border rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-28 object-cover rounded-md"
                      />
                      <p className="mt-2 text-xs truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddComplaint;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../api.js";

function AddComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });
  const [customCategory, setCustomCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "category" && e.target.value !== "other") {
      setCustomCategory("");
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.category === "other" && !customCategory.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (images.length < 2) {
      setError("Please upload at least 2 images.");
      return;
    }

    setLoading(true);

    try {
      await createComplaint({
        ...formData,
        category: formData.category === "other" ? customCategory : formData.category,
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
              <option value="Maintenance">Maintenance</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Road & Transportation">Road & Transportation</option>
              <option value="Garbage Management">Garbage Management</option>
              <option value="Cleanliness & Sanitation">Cleanliness & Sanitation</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Street Lighting">Street Lighting</option>
              <option value="Environmental Issues">Environmental Issues</option>
              <option value="Internet Issues">Internet Issues</option>
              <option value="Staff/Employee Behaviour">Staff/Employee Behaviour</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Billing & Payment Issues">Billing & Payment Issues</option>
              <option value="Unauthorized Charges">Unauthorized Charges</option>
              <option value="Product Issues">Product Issues</option>
              <option value="Service Quality">Service Quality</option>
              <option value="Delivery & Logistics">Delivery & Logistics</option>
              <option value="Public Facilities">Public Facilities</option>
              <option value="Parking Issues">Parking Issues</option>
              <option value="Fraud & Suspicious Activity">Fraud & Suspicious Activity</option>
              <option value="Harassment & Misconduct">Harassment & Misconduct</option>
              <option value="Accessibility Issues">Accessibility Issues</option>
              <option value="Policy & Procedure Issues">Policy & Procedure Issues</option>
              <option value="Documentation & Records">Documentation & Records</option>
              <option value="other">Other</option>
            </select>
            {formData.category === "other" && (
              <input
                type="text"
                placeholder="Enter your category"
                className="w-full rounded-2xl border px-3 py-2 mt-3 outline-none"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            )}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter the location where the issue occurred"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-2xl border px-3 py-2 outline-none"
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
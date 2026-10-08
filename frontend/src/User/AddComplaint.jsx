import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../api.js";
import LocationPicker from "./LocationPicker.jsx";

function AddComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    latitude: null,
    longitude: null
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
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
    <div className="w-full min-h-screen flex justify-center items-center bg-stone-50">
      <div className="border w-120 min-h-175 rounded-2xl px-12 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-center text-black">
            Add Complaint
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block font-bold text-black">
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
            <label className="mb-2 block font-bold text-black">
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
              <option value="General Administration Department (GAD)">
                General Administration Department (GAD)
              </option>
              <option value="Personnel and Administrative Reforms">
                Personnel and Administrative Reforms
              </option>
              <option value="Law & Legislative Affairs">
                Law & Legislative Affairs
              </option>
              <option value="Finance Department">
                Finance Department
              </option>
              <option value="Excise and Taxation">
                Excise and Taxation
              </option>
              <option value="Industries and Commerce Department">
                Industries and Commerce Department
              </option>
              <option value="Information Technology & Communications">
                Information Technology & Communications
              </option>
              <option value="Higher Education">
                Higher Education
              </option>

              <option value="Police Department">
                Police Department
              </option>
              <option value="Revenue and Land Records">
                Revenue and Land Records
              </option>
              <option value="Public Works Department (PWD)">
                Public Works Department (PWD)
              </option>
              <option value="Transport Department (RTO)">
                Transport Department (RTO)
              </option>
              <option value="Energy / Electricity Board">
                Energy / Electricity Board
              </option>
              <option value="Public Health Engineering Department (PHED)">
                Public Health Engineering Department (PHED)
              </option>
              <option value="Health and Family Welfare Department">
                Health and Family Welfare Department
              </option>
              <option value="School Education & Literacy">
                School Education & Literacy
              </option>
              <option value="Women and Child Development">
                Women and Child Development
              </option>
              <option value="Social Justice and Empowerment">
                Social Justice and Empowerment
              </option>
              <option value="Backward Classes & Minorities Welfare">
                Backward Classes & Minorities Welfare
              </option>
              <option value="Labour and Employment">
                Labour and Employment
              </option>
              <option value="Food, Civil Supplies & Consumer Affairs">
                Food, Civil Supplies & Consumer Affairs
              </option>
              <option value="Panchayati Raj and Rural Development">
                Panchayati Raj and Rural Development
              </option>
              <option value="Agriculture and Farmers Welfare Department">
                Agriculture and Farmers Welfare Department
              </option>
              <option value="Animal Husbandry, Dairying & Fisheries">
                Animal Husbandry, Dairying & Fisheries
              </option>
              <option value="Forest, Wildlife & Climate Change">
                Forest, Wildlife & Climate Change
              </option>
              <option value="New and Renewable Energy">
                New and Renewable Energy
              </option>
              <option value="Housing and Urban Development">
                Housing and Urban Development
              </option>
              <option value="Tourism and Cultural Affairs">
                Tourism and Cultural Affairs
              </option>
              <option value="Sports and Youth Services">
                Sports and Youth Services
              </option>
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
            <label className="mb-2 block font-bold text-black">
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
            <label className="mb-2 block text-sm font-bold text-black">
              Complaint Location
            </label>

            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-left transition hover:border-black hover:bg-gray-50"
            >
              {formData.location ? (
                <div>
                  <p className="font-medium text-gray-800">
                    {formData.location}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {formData.latitude?.toFixed(6)},{" "}
                    {formData.longitude?.toFixed(6)}
                  </p>
                </div>
              ) : (
                <span className="text-black">
                  Select complaint location from map
                </span>
              )}
            </button>

            {formData.location && (
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="mt-2 text-sm font-medium text-black hover:underline"
              >
                Change Location
              </button>
            )}
          </div>
          {showLocationPicker && (
            <LocationPicker
              onLocationSelect={(locationData) => {
                setFormData((prev) => ({
                  ...prev,
                  location: locationData.location,
                  latitude: locationData.latitude,
                  longitude: locationData.longitude
                }));
              }}
              onClose={() => setShowLocationPicker(false)}
            />
          )}
          <div className="mb-5">
            <label className="mb-2 block font-bold text-black">
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
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-stone-400 px-6 py-3 font-semibold text-black cursor-pointer disabled:opacity-50"
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
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createComplaint(formData);
      navigate("/home/complaints");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-313.5 justify-center items-center flex">
        <div className="border h-150 w-120 justify-center items-center flex rounded-2xl">
            <div>
                <div className="-mt-50">
                    <div>
                        <h1 className="font-bold text-3xl text-center">Add Complaint</h1>
                    </div>
                </div>
                <div className="h-50 justify-center items-center flex mt-20">
                    <form onSubmit={handleSubmit}>
                        <label className="mb-2 block font-medium text-gray-700">
                          Title
                        </label>
                        <input type="text" name="title" placeholder="Enter title" className="outline w-100 rounded-2xl px-2 mb-5" value={formData.title} onChange={handleChange}/><br />
                        <label className="mb-2 block font-medium text-gray-700">
                          Category
                        </label>
                        <select name="category" id="" className="outline w-100 rounded-2xl px-2 mb-5" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="technical">Technical</option>
                            <option value="administrative">Administrative</option>
                            <option value="other">Other</option>
                        </select><br />
                        <label className="mb-2 block font-medium text-gray-700">
                          Description
                        </label>
                        <input type="text" name="description" placeholder="Enter description" className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition" value={formData.description} onChange={handleChange} />
                        <div className="flex justify-end mt-10 gap-3">
                        <button type="button" onClick={() => navigate("/home")} className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100">
                          Cancel
                        </button>
                        <button type="submit" disabled={loading} className="rounded-xl bg-black px-6 py-3 font-semibold text-white cursor-pointer">
                          {loading ? "Submitting..." : "Submit Complaint"}
                        </button>
                      </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddComplaint;
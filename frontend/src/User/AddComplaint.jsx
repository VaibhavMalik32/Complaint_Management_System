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
                <div className="-mt-60">
                    <div>
                        <h1 className="font-bold text-3xl text-center">Add Complaint</h1>
                    </div>
                </div>
                <div className="h-50 justify-center items-center flex">
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Enter title" className="outline w-100 rounded-2xl px-2 mb-5" value={formData.title} onChange={handleChange}/><br />
                        <select name="category" id="" className="outline w-100 rounded-2xl px-2 mb-5" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="technical">Technical</option>
                            <option value="administrative">Administrative</option>
                            <option value="other">Other</option>
                        </select><br />
                        <input type="text" placeholder="Enter description" className="w-full resize-none rounded-lg border px-4 py-3 outline-none transition" value={formData.description} onChange={handleChange} />
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddComplaint;
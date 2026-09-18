const API_URL = "http://127.0.0.1:8000";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
};

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
};

export const createComplaint = async ({
  title,
  description,
  category,
  images,
}) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  images.forEach((image) => {
    formData.append("images", image);
  });
  const response = await fetch(`${API_URL}/complaints/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to create complaint"
    );
  }
  return data;
};

export const getMyComplaints = async () => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/my`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch complaints"
    );
  }
  return data;
};

export const deleteComplaint = async (complaintId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/${complaintId}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to delete complaint"
    );
  }
  return data;
};

export const getAllComplaints = async () => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/complaints/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch complaints");
  }
  return data;
};

export const updateComplaintStatus = async (
  complaintId,
  status
) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/${complaintId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update complaint status"
    );
  }
  return data;
};

export const getComplaintHistory = async (complaintId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/${complaintId}/history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch complaint history"
    );
  }
  return data;
};

export const getComplaint = async (complaintId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/${complaintId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch complaint"
    );
  }
  return data;
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to send OTP");
  }
  return data;
};


export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      otp: otp,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Invalid OTP");
  }
  return data;
};

export const getMatchingEmployees = async () => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/complaints/employees`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    console.log("Backend error:", data);
    throw new Error(
      data.detail || `Request failed with status ${response.status}`
    );
  }
  return data;
};

export const assignComplaint = async (complaintId, employeeId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/${complaintId}/assign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        employee_id: employeeId,
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to assign complaint");
  }
  return data;
};

export const getAssignedComplaints = async () => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/complaints/assigned`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch assigned complaints");
  }
  return data;
};

export const getSuperAdminStats = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/complaints/super-admin/stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch Super Admin statistics"
    );
  }

  return data;
};

export const getSuperAdminComplaints = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_URL}/complaints/super-admin/all`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch complaints"
    );
  }

  return data;
};
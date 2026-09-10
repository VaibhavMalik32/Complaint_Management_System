const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Request failed"
        );
    }

    return data;
}


// =========================
// ORGANIZATIONS
// =========================

export const getOrganizations = () =>
    request("/organizations");

export const getOrganization = (id) =>
    request(`/organizations/${id}`);

export const createOrganization = (data) =>
    request("/organizations", {
        method: "POST",
        body: JSON.stringify(data)
    });


// =========================
// DEPARTMENTS
// =========================

export const getDepartments = () =>
    request("/departments");

export const getDepartment = (id) =>
    request(`/departments/${id}`);

export const createDepartment = (data) =>
    request("/departments", {
        method: "POST",
        body: JSON.stringify(data)
    });


// =========================
// CATEGORIES
// =========================

export const getCategories = () =>
    request("/categories");

export const getCategory = (id) =>
    request(`/categories/${id}`);

export const createCategory = (data) =>
    request("/categories", {
        method: "POST",
        body: JSON.stringify(data)
    });


// =========================
// USERS
// =========================

export const getUsers = () =>
    request("/users");


// =========================
// COMPLAINTS
// =========================

export const getComplaints = () =>
    request("/complaints");

export const getComplaint = (id) =>
    request(`/complaints/${id}`);

export const createComplaint = (data) =>
    request("/complaints", {
        method: "POST",
        body: JSON.stringify(data)
    });


// =========================
// STAFF
// =========================

export const getStaff = () =>
    request("/staff");

export const getAvailableUsers = () =>
    request("/staff/available-users");

export const createStaff = (data) =>
    request("/staff", {
        method: "POST",
        body: JSON.stringify(data)
    });


// =========================
// MANAGEMENT
// =========================

export const getManagedComplaints = () =>
    request("/management/complaints");

export const getAssignmentStaff = () =>
    request("/management/staff");

export const assignComplaint = (
    complaintId,
    staffId
) =>
    request(
        `/management/complaints/${complaintId}/assign`,
        {
            method: "POST",
            body: JSON.stringify({
                staff_id: staffId
            })
        }
    );

export const updateComplaintStatus = (
    complaintId,
    status,
    remarks
) =>
    request(
        `/management/complaints/${complaintId}/status`,
        {
            method: "PUT",
            body: JSON.stringify({
                status,
                remarks
            })
        }
    );

export const getComplaintHistory = (
    complaintId
) =>
    request(
        `/management/complaints/${complaintId}/history`
    );


// =========================
// RESOLUTION
// =========================

export const getResolution = (
    complaintId
) =>
    request(
        `/resolutions/complaints/${complaintId}`
    );

export const createResolution = (
    complaintId,
    data
) =>
    request(
        `/resolutions/complaints/${complaintId}`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );

export const closeComplaint = (
    complaintId,
    data
) =>
    request(
        `/resolutions/complaints/${complaintId}/close`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    );


// =========================
// FEEDBACK
// =========================

export const getFeedback = (
    complaintId
) =>
    request(
        `/feedback/complaints/${complaintId}`
    );

export const createFeedback = (
    complaintId,
    data
) =>
    request(
        `/feedback/complaints/${complaintId}`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );

export const getUserComplaints = async (userId) => {
    const response = await fetch(`${API_URL}/complaints/user/${userId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch user complaints");
    }

    return response.json();
};
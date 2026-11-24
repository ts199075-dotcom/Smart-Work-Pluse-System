import apiRequest from "./api";

// Get current user's profile
export const getMyProfile = async () => {
  return await apiRequest("/Profile/ShowProfile", {
    method: "GET",
  });
};

// Update current user's profile
export const updateMyProfile = async (profileData) => {
  return await apiRequest("/Profile/UpdateProfile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

// Update current user's password
export const updateMyPassword = async (passwordData) => {
  return await apiRequest("/Profile/UpdatePassword", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
};
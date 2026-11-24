import apiRequest from "./api";

// Login
export const loginUser = async (email, password, rememberMe = false) => {
  const params = new URLSearchParams({
    Email: email,
    Password: password,
    RememberMe: rememberMe,
  });

  const response = await apiRequest(
    `/UserAuth/login?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (response.status !== 0) {
    throw new Error("Invalid email or password");
  }

  return response;
};

// Register
export const registerUser = async (form, image) => {
  const formData = new FormData();

  formData.append("FullName", form.fullName.trim());
  formData.append("Phone", form.phone.trim());
  formData.append("Email", form.email.trim());
  formData.append("Password", form.password);
  formData.append("ConfirmPassword", form.confirmPassword);
  formData.append("Department", form.department.trim());
  formData.append("Gavernate", form.governorate.trim());
  formData.append("City", form.city.trim());
  formData.append("gender", form.gender);
  formData.append("Role", form.role);
  formData.append("ImageUrl", image);

  const response = await apiRequest("/UserAuth/register", {
    method: "POST",
    body: formData,
  });

  return response;
};
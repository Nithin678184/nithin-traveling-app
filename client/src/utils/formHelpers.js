export const getApiError = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";

export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export const today = () => new Date().toISOString().slice(0, 10);

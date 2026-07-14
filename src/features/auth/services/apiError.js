export const getApiErrorMessage = (
  error,
  fallbackMessage = "Something went wrong"
) => {
  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    return fallbackMessage;
  }

  if (error.request) {
    return "Cannot reach server. Please check your connection.";
  }

  return error.message || fallbackMessage;
};

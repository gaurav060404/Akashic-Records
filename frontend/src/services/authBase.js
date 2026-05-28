export const getAuthBaseUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

  if (!backendUrl) {
    return "";
  }

  if (backendUrl.endsWith("/auth")) {
    return backendUrl;
  }

  return `${backendUrl}/auth`;
};

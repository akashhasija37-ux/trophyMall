export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user") || "null");
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === "Super Admin";
};

export const hasPermission = (key: string) => {
  const user = getUser();
  return user?.permissions?.includes(key);
};
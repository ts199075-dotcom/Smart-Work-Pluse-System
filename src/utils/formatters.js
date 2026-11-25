export const formatNumber = (value) =>
  Number(value || 0).toLocaleString();

export const formatDate = (date, fallback = "—") => {
  if (!date) return fallback;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return typeof date === "string" ? date : fallback;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTitle = (title) => {
  return title.length < 50 ? title : title.slice(0, 47) + "...";
};

const formatDate = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
};

export { formatTitle, formatDate };

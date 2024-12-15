const formatTitle = (title) => {
  return title.length < 50 ? title : title.slice(0, 47) + "...";
};

export { formatTitle };

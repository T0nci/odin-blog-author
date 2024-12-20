import PropTypes from "prop-types";

const DeleteButton = ({ postId, navigate, setErrors, setToken, ...props }) => {
  const handleClick = async () => {
    try {
      const fetched = await fetch(
        import.meta.env.VITE_API_URL + `/posts/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "DELETE",
        },
      );

      const response = await fetched.json();

      if (
        response.error &&
        (response.error === "401: Unauthorized" || response.error === "401")
      ) {
        setToken(null);
        localStorage.removeItem("token");
      } else if (response.status || response.error === "404") navigate("/");
      else setErrors([{ msg: "Unknown response." }]);
    } catch (error) {
      setErrors([{ msg: error + "" }]);
    }
  };

  return (
    <button onClick={handleClick} type="button" {...props}>
      Delete
    </button>
  );
};

DeleteButton.propTypes = {
  postId: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
};

export default DeleteButton;

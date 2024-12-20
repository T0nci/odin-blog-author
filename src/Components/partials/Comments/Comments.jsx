import PropTypes from "prop-types";
import styles from "./Comments.module.css";
import { formatDate } from "../../../utils";

const Comments = ({
  postId,
  comments,
  navigate,
  setToken,
  setErrors,
  deleteComment,
}) => {
  const handleClick = async (commentId) => {
    try {
      const fetched = await fetch(
        import.meta.env.VITE_API_URL + `/posts/${postId}/comments/${commentId}`,
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
      } else if (response.error === "404") navigate("/");
      else if (response.status) deleteComment(commentId);
      else setErrors([{ msg: "Unknown response." }]);
    } catch (error) {
      setErrors([{ msg: error + "" }]);
    }
  };

  return (
    <ul className={styles.comments}>
      <h1 className={styles.heading}>Comments:</h1>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.comment}>
          <p className={styles.bold}>{comment.displayName}</p>
          <button
            onClick={() => handleClick(comment.id)}
            className={styles.delete}
          >
            Delete
          </button>
          <p className={styles.bold}>{formatDate(new Date(comment.date))}</p>
          <p>{comment.content}</p>
        </li>
      ))}
    </ul>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

export default Comments;

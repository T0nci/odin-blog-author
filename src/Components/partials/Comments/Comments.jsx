import PropTypes from "prop-types";
import styles from "./Comments.module.css";
import { formatDate } from "../../../utils";

const Comments = ({ comments, setToken, setErrors }) => {
  const handleClick = async () => {};

  return (
    <ul className={styles.comments}>
      <h1 className={styles.heading}>Comments:</h1>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.comment}>
          <p className={styles.bold}>{comment.displayName}</p>
          <button onClick={handleClick} className={styles.delete}>
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
  comments: PropTypes.array.isRequired,
  setToken: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default Comments;

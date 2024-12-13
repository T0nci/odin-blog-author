import PropTypes from "prop-types";
import styles from "./Errors.module.css";

const Errors = ({ errors }) => {
  return (
    <ul className={styles.errors}>
      {errors.map((error) => (
        <li key={error.msg} className={styles.error}>
          {error.msg}
        </li>
      ))}
    </ul>
  );
};

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({ msg: PropTypes.string })),
};

export default Errors;

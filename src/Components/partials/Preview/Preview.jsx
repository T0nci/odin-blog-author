import PropTypes from "prop-types";
import styles from "./Preview.module.css";

const Preview = ({ fields }) => {
  return (
    <>
      <header className={styles["main-heading"]}>{fields.title}</header>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: fields.content }}
      />
    </>
  );
};

Preview.propTypes = {
  fields: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default Preview;

import { useRef, useState } from "react";
import { useOutletContext } from "react-router";
import PropTypes from "prop-types";
import styles from "./Blog.module.css";
import BlogForm from "../partials/BlogForm/BlogForm";
import Preview from "../partials/Preview/Preview";

const Blog = ({ action }) => {
  const [fields, setFields] = useState({
    title: "",
    content: "<p>What will we orchestrate today?</p>",
  });
  const [tab, setTab] = useState("editing");
  const editorRef = useRef(null);

  const { setToken } = useOutletContext();

  return (
    <>
      <div className={styles.btns}>
        <button onClick={() => setTab("editing")} className={styles.btn}>
          Editing
        </button>
        <button
          onClick={() => {
            setFields((prevFields) => ({
              ...prevFields,
              content: editorRef.current.getContent(),
            }));
            setTab("preview");
          }}
          className={styles.btn}
        >
          Preview
        </button>
      </div>
      {tab === "editing" && (
        <BlogForm
          changeTitle={(e) => {
            setFields((prevFields) => ({
              ...prevFields,
              title: e.target.value,
            }));
          }}
          fields={fields}
          setToken={setToken}
          action={action}
          ref={editorRef}
        />
      )}
      {tab === "preview" && <Preview fields={fields} />}
    </>
  );
};

Blog.propTypes = {
  action: PropTypes.oneOf(["create", "update"]).isRequired,
};

export default Blog;

import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    let isActive = true;
    if (action === "update") {
      const main = async () => {
        const fetched = await fetch(
          import.meta.env.VITE_API_URL + "/posts/" + postId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const response = await fetched.json();

        if (!isActive) return;

        if (response.post)
          setFields({
            title: response.post.title,
            content: response.post.content,
          });
        else if (response.error === "404") navigate("/");
        else {
          setToken(null);
          localStorage.removeItem("token");
        }
      };

      main();
    }

    return () => {
      isActive = false;
    };
  }, [action, navigate, postId, setToken]);

  return (
    <>
      <h1 className={styles.action}>
        {action === "create" ? "New blog" : `Editing blog ${postId}`}
      </h1>
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
          postId={postId}
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

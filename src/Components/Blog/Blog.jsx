import { useRef, useState } from "react";
import { useParams } from "react-router";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import styles from "./Blog.module.css";

const Blog = ({ action }) => {
  const [fields, setFields] = useState({
    title: "",
    content: "<p>What will we orchestrate today?</p>",
    pending: false,
  });
  const [tab, setTab] = useState("editing");
  const editorRef = useRef(null);

  const { postId } = useParams();
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
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={fields.content}
        init={{
          width: "100%",
          height: 400,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={() => console.log(editorRef.current.getContent())}>
        Log content
      </button>
    </>
  );
};

Blog.propTypes = {
  action: PropTypes.oneOf(["create", "update"]).isRequired,
};

export default Blog;

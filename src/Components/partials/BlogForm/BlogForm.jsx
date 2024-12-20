import { forwardRef, useState } from "react";
import { useNavigate } from "react-router";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import Errors from "../Errors/Errors";
import DeleteButton from "../DeleteButton/DeleteButton";
import Comments from "../Comments/Comments";
import styles from "./BlogForm.module.css";

const BlogForm = forwardRef(function BlogForm(
  { changeTitle, deleteComment, fields, setToken, action, postId },
  editorRef,
) {
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fetched = await fetch(
        import.meta.env.VITE_API_URL +
          `/posts${action === "update" ? `/${postId}` : ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            action: "update",
            title: fields.title,
            content: editorRef.current.getContent(),
          }),
          method: action === "create" ? "POST" : "PUT",
        },
      );

      const response = await fetched.json();

      if (
        response.error &&
        (response.error === "401: Unauthorized" || response.error === "401")
      ) {
        setToken(null);
        localStorage.removeItem("token");
      } else if (response.errors) setErrors(response.errors);
      else if (response.post || response.error === "404") navigate("/");
      else setErrors([{ msg: "Unknown response." }]);
    } catch (error) {
      setErrors([{ msg: error + "" }]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors && <Errors errors={errors} data-testid="errors" />}
        <div>
          <label htmlFor="title" className={styles.label}>
            Title:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            minLength="1"
            maxLength="100"
            required
            autoComplete="off"
            value={fields.title}
            onChange={changeTitle}
            className={styles.input}
          />
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
        <div className={styles.buttons}>
          {action === "update" && (
            <DeleteButton
              postId={postId}
              navigate={navigate}
              setErrors={setErrors}
              setToken={setToken}
              className={styles.submit}
            />
          )}
          <button type="submit" className={styles.submit}>
            Save
          </button>
        </div>
      </form>
      {action === "update" && (
        <Comments
          postId={postId}
          comments={fields.comments}
          navigate={navigate}
          setErrors={setErrors}
          setToken={setToken}
          deleteComment={deleteComment}
        />
      )}
    </>
  );
});

BlogForm.propTypes = {
  changeTitle: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  fields: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    comments: PropTypes.array,
  }).isRequired,
  setToken: PropTypes.func.isRequired,
  action: PropTypes.oneOf(["create", "update"]).isRequired,
  postId: PropTypes.string,
};

export default BlogForm;

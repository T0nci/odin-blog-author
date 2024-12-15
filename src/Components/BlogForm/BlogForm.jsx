import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const BlogForm = () => {
  const [fields, setFields] = useState({
    title: "",
    content: "",
    pending: false,
  });

  const editorRef = useRef(null);

  return (
    <>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>P for Popcorn!</p>"
        init={{
          height: 500,
          menubar: false,
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

export default BlogForm;

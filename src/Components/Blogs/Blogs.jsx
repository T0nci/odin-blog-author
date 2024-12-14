import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import styles from "./Blogs.module.css";

const Blogs = () => {
  const [posts, setPosts] = useState(null);

  return (
    <>
      <div className="loading">
        <div className="box">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        Loading
      </div>
    </>
  );
};

export default Blogs;

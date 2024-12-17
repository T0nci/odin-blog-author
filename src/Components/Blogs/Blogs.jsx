import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, Link } from "react-router";
import styles from "./Blogs.module.css";
import { formatTitle } from "../../utils";

const Blogs = () => {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState(null);

  const { setToken } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;
    fetch(import.meta.env.VITE_API_URL + "/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (isActive) {
          if (response.error === "401: Unauthorized") {
            setToken(null);
            localStorage.removeItem("token");
          } else
            setPosts(
              response.posts.sort((a, b) => a.title.localeCompare(b.title)),
            );
        }
      })
      .catch((err) => {
        console.error(err);
        setPosts(err);
      });

    return () => {
      isActive = false;
    };
  }, [setPosts, setToken]); // setPosts and setToken are memoised by React meaning the functions is the same every time, so there aren't unnecessary useEffect calls. I confirmed this by putting a console.log in the useEffect and rerendering the component by publishing and un-publishing

  const handlePublish = async (id, e) => {
    e.stopPropagation(); // to stop bubbling(default vs capturing) to upper handlers

    const fetched = await fetch(import.meta.env.VITE_API_URL + `/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "publish" }),
      method: "PUT",
    });

    const response = await fetched.json();

    if (response.error === "401") {
      setToken(null);
      localStorage.removeItem("token");
    } else if (response.post) {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === id) return { ...response.post };

          return post;
        }),
      );
      setError(null);
    } else if (response.error) setError(response.error);
    else if (response.errors) setError(response.errors[0].msg);
    else setError("Unknown response.");
  };

  return (
    <>
      <div className={styles.positioned}>
        <Link to="/posts/create" className={styles.new}>
          +
        </Link>
        {posts instanceof Error ? (
          <p className={styles.error}>{posts + ""}</p>
        ) : posts === null ? (
          <div className="loading">
            <div className="box">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            Loading
          </div>
        ) : Array.isArray(posts) ? (
          <>
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.blogs}>
              {posts.map((post) => (
                <li key={post.id} className={styles.blog}>
                  <p className={styles.title}>{formatTitle(post.title)}</p>
                  <button
                    onClick={(e) => handlePublish(post.id, e)}
                    className={styles["blog-button"]}
                  >
                    {post.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/posts/update/" + post.id);
                    }}
                    className={styles["blog-button"]}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className={styles.error}>Unknown error</p>
        )}
      </div>
    </>
  );
};

export default Blogs;

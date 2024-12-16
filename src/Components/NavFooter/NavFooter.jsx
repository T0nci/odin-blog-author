import { useState } from "react";
import { Link, Navigate, Outlet } from "react-router";
import Footer from "../partials/Footer/Footer";
import styles from "./NavFooter.module.css";

const NavFooter = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [posts, setPosts] = useState(null);

  if (!token) return <Navigate to="/login" />;

  const handleLogout = () => {
    localStorage.clear("token");
    setToken(null);
    setPosts(null);
  };

  return (
    <div className="position-footer" data-testid="component">
      <nav className={styles["main-nav"]}>
        <ul className={styles.nav + " container"}>
          <li>
            <Link to="/" className={styles["nav-link"]}>
              All blogs
            </Link>
          </li>
          <li className={styles["last-child"]}>
            <button onClick={handleLogout} className={styles.logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main>
        <div className="container">
          <Outlet context={{ token, setToken, posts, setPosts }} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NavFooter;

import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Footer from "../Footer/Footer";
import Errors from "../Errors/Errors";
import styles from "./Login.module.css";

const Login = () => {
  const [fields, setFields] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  if (localStorage.getItem("token")) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resJson = await fetch(
        import.meta.env.VITE_API_URL + "/login-author",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(fields),
          method: "POST",
        },
      );

      const res = await resJson.json();

      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/");
      } else if (res.error || res.errors) setErrors([{ msg: "401" }]);
      else throw new Error("Unknown response");
    } catch (error) {
      console.error(error);
      setErrors([{ msg: "Unknown error." }]);
    }
  };

  return (
    <div className="position-footer" data-testid="component">
      <main>
        <div className="container">
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.heading}>Login</h1>
            {errors.length > 0 && <Errors errors={errors} />}
            <div>
              <label htmlFor="username" className={styles.label}>
                Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                autoFocus
                autoComplete="off"
                value={fields.username}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    username: e.target.value,
                  }))
                }
                className={styles.input}
              />
            </div>
            <div>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={fields.password}
                onChange={(e) =>
                  setFields((prevFields) => ({
                    ...prevFields,
                    password: e.target.value,
                  }))
                }
                className={styles.input}
                data-testid="password"
              />
            </div>
            <div>
              <button type="submit" className={styles.submit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;

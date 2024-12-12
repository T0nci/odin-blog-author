import { useRouteError, Link } from "react-router";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  let errorMessage = "";
  if (error.status) errorMessage = `${error.status}: ${error.statusText}`;
  else if (error.error) errorMessage = `${error.error}`;
  else errorMessage = `${error}`;

  return (
    <>
      <div className="container" data-testid="error">
        <p className={styles.error}>{errorMessage}</p>
        <Link to="/" className={styles.link}>
          Go back to home
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;

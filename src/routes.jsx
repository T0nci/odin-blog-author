import App from "./App";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Login from "./Components/Login/Login";

const routes = [
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
];

export default routes;

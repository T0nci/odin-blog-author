import NavFooter from "./Components/NavFooter/NavFooter";
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
    element: <NavFooter />,
    errorElement: <ErrorPage />,
    children: [],
  },
];

export default routes;

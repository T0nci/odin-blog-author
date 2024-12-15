import NavFooter from "./Components/NavFooter/NavFooter";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Login from "./Components/Login/Login";
import Blogs from "./Components/Blogs/Blogs";
import BlogForm from "./Components/BlogForm/BlogForm";

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
    children: [
      { index: true, element: <Blogs /> },
      { path: "/posts/create", element: <BlogForm /> },
    ],
  },
];

export default routes;

import NavFooter from "./Components/NavFooter/NavFooter";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Login from "./Components/Login/Login";
import Blogs from "./Components/Blogs/Blogs";
import Blog from "./Components/Blog/Blog";

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
      { path: "/posts/create", element: <Blog action="create" /> },
      { path: "/posts/update/:postId", element: <Blog action="update" /> },
    ],
  },
];

export default routes;

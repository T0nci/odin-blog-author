import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import ErrorPage from "./ErrorPage";

const App = () => {
  throw new Error("Test Error");
};

const setupRouter = (initialEntries) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
      },
    ],
    {
      initialEntries,
      initialIndex: 0,
    },
  );

  render(<RouterProvider router={router} />);

  // Returned the router for checking of history
  return router;
};

describe("ErrorPage Component", () => {
  it("renders with component error", () => {
    const router = setupRouter(["/"]);

    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByTestId("error")).toMatchInlineSnapshot(`
      <div
        class="container"
        data-testid="error"
      >
        <p
          class="_error_804c82"
        >
          Error: Test Error
        </p>
        <a
          class="_link_804c82"
          data-discover="true"
          href="/"
        >
          Go back to home
        </a>
      </div>
    `);
  });

  it("renders with React Router error", () => {
    const router = setupRouter(["/404"]);

    expect(router.state.location.pathname).toBe("/404");
    expect(screen.getByTestId("error")).toMatchInlineSnapshot(`
      <div
        class="container"
        data-testid="error"
      >
        <p
          class="_error_804c82"
        >
          404: Not Found
        </p>
        <a
          class="_link_804c82"
          data-discover="true"
          href="/"
        >
          Go back to home
        </a>
      </div>
    `);
  });
});

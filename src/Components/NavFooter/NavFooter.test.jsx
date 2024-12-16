/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import NavFooter from "./NavFooter";

const Login = () => {};

const setupRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <NavFooter />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
    { initialEntries: ["/"], initialIndex: 0 },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe("NavFooter Component", () => {
  it("renders", () => {
    global.localStorage = { getItem: () => "some token value" };

    setupRouter();

    expect(screen.getByTestId("component")).toMatchInlineSnapshot(`
      <div
        class="position-footer"
        data-testid="component"
      >
        <nav
          class="_main-nav_a87031"
        >
          <ul
            class="_nav_a87031 container"
          >
            <li>
              <a
                class="_nav-link_a87031"
                data-discover="true"
                href="/"
              >
                All blogs
              </a>
            </li>
            <li
              class="_last-child_a87031"
            >
              <button
                class="_logout_a87031"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
        <main>
          <div
            class="container"
          />
        </main>
        <footer
          class="_main-footer_b16bb0"
        >
          <div
            class="_footer_b16bb0 container"
          >
            <a
              class="_link_b16bb0"
              href="https://github.com/T0nci/"
            >
              <img
                alt="Tonci's GitHub"
                src="/src/assets/github.svg"
              />
              T0nci
            </a>
          </div>
        </footer>
      </div>
    `);
  });

  it("redirects to Login if there's no token", () => {
    global.localStorage = { getItem: () => null };

    const router = setupRouter();

    expect(router.state.location.pathname).toBe("/login");
  });

  it("redirects to Login if logout is clicked", async () => {
    const clear = vi.fn();
    global.localStorage = { getItem: () => "some token value", clear };

    const router = setupRouter();
    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Logout" }));
    });

    expect(router.state.location.pathname).toBe("/login");
    expect(clear).toHaveBeenCalledWith("token");
  });

  it("goes to the home route when 'All blogs' is clicked", async () => {
    global.localStorage = { getItem: () => "some token value" };

    const router = setupRouter();
    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByRole("link", { name: "All blogs" }));
    });

    expect(router.state.location.pathname).toBe("/");
  });
});

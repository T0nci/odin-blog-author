/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import Login from "./Login";

global.fetch = vi.fn();

const Home = () => <></>;
const setupRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
    { initialEntries: ["/login"], initialIndex: 0 },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe("Login Component", () => {
  it("renders", () => {
    setupRouter();

    expect(screen.getByTestId("component")).toMatchInlineSnapshot(`
      <div
        class="position-footer"
        data-testid="component"
      >
        <main>
          <div
            class="container"
          >
            <form
              class="_form_b527bd"
            >
              <h1
                class="_heading_b527bd"
              >
                Login
              </h1>
              <div>
                <label
                  class="_label_b527bd"
                  for="username"
                >
                  Username:
                </label>
                <input
                  autocomplete="off"
                  class="_input_b527bd"
                  id="username"
                  name="username"
                  required=""
                  type="text"
                  value=""
                />
              </div>
              <div>
                <label
                  class="_label_b527bd"
                  for="password"
                >
                  Password:
                </label>
                <input
                  class="_input_b527bd"
                  data-testid="password"
                  id="password"
                  name="password"
                  required=""
                  type="password"
                  value=""
                />
              </div>
              <div>
                <button
                  class="_submit_b527bd"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
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

  it("redirects to Home if there's a token", () => {
    const getItem = vi.fn();
    getItem.mockImplementationOnce(() => "some token value");
    global.localStorage = { getItem };

    const router = setupRouter();

    expect(router.state.location.pathname).toBe("/");
  });

  it("logs the user in successfully", async () => {
    const getItem = vi.fn(() => null);
    const setItem = vi.fn();
    global.localStorage = { getItem, setItem };

    global.fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ token: "some token value" }),
    });

    const router = setupRouter();
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox"), "username");
    await user.type(screen.getByTestId("password"), "password");
    await user.click(screen.getByRole("button"));

    expect(setItem).toHaveBeenCalledWith("token", "some token value");
    expect(router.state.location.pathname).toBe("/");
  });

  it("shows errors in bad request", async () => {
    const getItem = vi.fn(() => null);
    global.localStorage = { getItem };

    global.fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ error: "401" }),
    });

    setupRouter();
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox"), "username");
    await user.type(screen.getByTestId("password"), "password");
    await user.click(screen.getByRole("button"));

    const listItem = screen.getByRole("listitem");
    expect(listItem).toBeInTheDocument();
    expect(listItem.textContent).toBe("401");
  });

  it("shows errors when something in fetch fails", async () => {
    const getItem = vi.fn(() => null);
    global.localStorage = { getItem };

    global.fetch.mockRejectedValueOnce(new Error("test error"));

    setupRouter();
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox"), "username");
    await user.type(screen.getByTestId("password"), "password");
    await user.click(screen.getByRole("button"));

    const listItem = screen.getByRole("listitem");
    expect(listItem).toBeInTheDocument();
    expect(listItem.textContent).toBe("Unknown error.");
  });
});

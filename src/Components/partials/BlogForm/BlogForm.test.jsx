/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import Blog from "../../Blog/Blog";
import NavFooter from "../../NavFooter/NavFooter";

// Need to mock TinyMCE because it returns new ID every time => useless snapshot
vi.mock(import("@tinymce/tinymce-react"), async (importOriginal) => {
  const mod = await importOriginal();

  const Editor = () => (
    <div>
      <textarea>Some blog content...</textarea>
    </div>
  );

  return {
    ...mod,
    Editor,
  };
});
vi.mock(import("react"), async (importOriginal) => {
  const mod = await importOriginal();

  const useRef = () => ({
    current: { getContent: () => "Some blog content..." },
  });

  return {
    ...mod,
    useRef,
  };
});

global.fetch = vi.fn();

const Home = () => {};

const setupRouter = (action) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <NavFooter />,
        children: [
          { index: true, element: <Home /> },
          { path: "/posts/create", element: <Blog action="create" /> },
          { path: "/posts/update/:postId", element: <Blog action="update" /> },
        ],
      },
    ],
    {
      initialEntries: [
        action === "create" ? "/posts/create" : "/posts/update/1",
      ],
      initialIndex: 0,
    },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe("BlogForm Component", () => {
  it("renders", () => {
    global.localStorage = { getItem: () => "some token value" };

    setupRouter("create");

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
          >
            <h1
              class="_action_8b7481"
            >
              New blog
            </h1>
            <div
              class="_btns_8b7481"
            >
              <button
                class="_btn_8b7481"
              >
                Editing
              </button>
              <button
                class="_btn_8b7481"
              >
                Preview
              </button>
            </div>
            <form
              class="_form_104b85"
            >
              <div>
                <label
                  class="_label_104b85"
                  for="title"
                >
                  Title:
                </label>
                <input
                  autocomplete="off"
                  class="_input_104b85"
                  id="title"
                  maxlength="100"
                  minlength="1"
                  name="title"
                  required=""
                  type="text"
                  value=""
                />
              </div>
              <div>
                <textarea>
                  Some blog content...
                </textarea>
              </div>
              <div>
                <button
                  class="_submit_104b85"
                  type="submit"
                >
                  Save
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

  it("redirects to home when new post is created", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValue({
      post: {
        // some post data...
      },
    });
    global.fetch.mockResolvedValue({ json });

    const router = setupRouter("create");
    const user = userEvent.setup();

    await act(async () => {
      await user.type(
        screen.getByRole("textbox", { name: "Title:" }),
        "Blog Title",
      );
      await user.click(screen.getByRole("button", { name: "Save" }));
    });

    expect(router.state.location.pathname).toBe("/");
  });

  it("redirects to login when token is invalid", async () => {
    const removeItem = vi.fn();
    global.localStorage = { getItem: () => "invalid token", removeItem };
    const json = vi.fn();
    json.mockResolvedValue({
      error: "401", // or "401: Unauthorized"
    });
    global.fetch.mockResolvedValue({ json });

    const router = setupRouter("create");
    const user = userEvent.setup();

    await act(async () => {
      await user.type(
        screen.getByRole("textbox", { name: "Title:" }),
        "Blog Title",
      );
      await user.click(screen.getByRole("button", { name: "Save" }));
    });

    expect(removeItem).toHaveBeenCalledWith("token");
    expect(router.state.location.pathname).toBe("/login");
  });

  it("shows errors if server responds with any", async () => {
    const removeItem = vi.fn();
    global.localStorage = { getItem: () => "invalid token", removeItem };
    const json = vi.fn();
    json.mockResolvedValue({
      errors: [{ msg: "example error" }],
    });
    global.fetch.mockResolvedValue({ json });

    setupRouter("create");
    const user = userEvent.setup();

    await act(async () => {
      await user.type(
        screen.getByRole("textbox", { name: "Title:" }),
        "Blog Title",
      );
      await user.click(screen.getByRole("button", { name: "Save" }));
    });

    expect(screen.getByTestId("errors")).toBeInTheDocument();
  });

  it("renders for editing", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValue({
      post: {
        id: 1,
        title: "test title",
        content: "test content",
      },
    });
    global.fetch.mockResolvedValue({ json });

    await act(() => setupRouter("update"));

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
          >
            <h1
              class="_action_8b7481"
            >
              Editing blog 1
            </h1>
            <div
              class="_btns_8b7481"
            >
              <button
                class="_btn_8b7481"
              >
                Editing
              </button>
              <button
                class="_btn_8b7481"
              >
                Preview
              </button>
            </div>
            <form
              class="_form_104b85"
            >
              <div>
                <label
                  class="_label_104b85"
                  for="title"
                >
                  Title:
                </label>
                <input
                  autocomplete="off"
                  class="_input_104b85"
                  id="title"
                  maxlength="100"
                  minlength="1"
                  name="title"
                  required=""
                  type="text"
                  value="test title"
                />
              </div>
              <div>
                <textarea>
                  Some blog content...
                </textarea>
              </div>
              <div>
                <button
                  class="_submit_104b85"
                  type="submit"
                >
                  Save
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

  it("redirects to home when blog doesn't exist", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValue({
      error: "404",
    });
    global.fetch.mockResolvedValue({ json });

    let router = null;
    await act(() => (router = setupRouter("update")));

    expect(router.state.location.pathname).toBe("/");
  });

  it("redirects to login when token is invalid", async () => {
    const removeItem = vi.fn();
    global.localStorage = { getItem: () => "invalid token", removeItem };
    const json = vi.fn();
    json.mockResolvedValue({
      error: "401",
    });
    global.fetch.mockResolvedValue({ json });

    let router = null;
    await act(() => (router = setupRouter("update")));

    expect(removeItem).toHaveBeenCalledWith("token");
    expect(router.state.location.pathname).toBe("/login");
  });
});

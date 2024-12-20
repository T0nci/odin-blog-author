/* eslint-disable no-undef */
// just test if switching tabs works since its components are tested already
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import Blog from "./Blog";
import NavFooter from "../NavFooter/NavFooter";

vi.mock(import("@tinymce/tinymce-react"), async (importOriginal) => {
  const mod = await importOriginal();

  const Editor = () => <textarea data-testid="Editor"></textarea>;

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

vi.mock(import("../partials/Preview/Preview"), async (importOriginal) => {
  const mod = await importOriginal();

  const Preview = () => <form data-testid="Preview"></form>;

  return {
    ...mod,
    default: Preview,
  };
});

const setupRouter = (action) => {
  const route =
    action === "update"
      ? { path: "/posts/update/:postId", element: <Blog action="update" /> }
      : { path: "/posts/create", element: <Blog action="create" /> };

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <NavFooter />,
        children: [route],
      },
    ],
    {
      initialEntries: [
        action === "update" ? "/posts/update/1" : "/posts/create",
      ],
      initialIndex: 0,
    },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe("Blog Component", () => {
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
              <textarea
                data-testid="Editor"
              />
              <div
                class="_buttons_104b85"
              >
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

  it("renders for editing", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      post: {
        id: 1,
        title: "test title",
        content: "test content",
      },
    });
    json.mockResolvedValueOnce({
      comments: [
        {
          id: 1,
          content: "test comment",
          displayName: "Tester",
          date: "2000-01-01",
        },
      ],
    });
    global.fetch = vi.fn().mockResolvedValue({ json });

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
              <textarea
                data-testid="Editor"
              />
              <div
                class="_buttons_104b85"
              >
                <button
                  class="_submit_104b85"
                  type="button"
                >
                  Delete
                </button>
                <button
                  class="_submit_104b85"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
            <ul
              class="_comments_3280f7"
            >
              <h1
                class="_heading_3280f7"
              >
                Comments:
              </h1>
              <li
                class="_comment_3280f7"
              >
                <p
                  class="_bold_3280f7"
                >
                  Tester
                </p>
                <button
                  class="_delete_3280f7"
                >
                  Delete
                </button>
                <p
                  class="_bold_3280f7"
                >
                  01:00 01.01.2000
                </p>
                <p>
                  test comment
                </p>
              </li>
            </ul>
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

  it("switches tabs", async () => {
    global.localStorage = { getItem: () => "some token value" };

    setupRouter();
    const user = userEvent.setup();

    expect(screen.getByTestId("Editor")).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Preview" }));
    });

    expect(screen.getByTestId("Preview")).toBeInTheDocument();
  });
});

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

const setupRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <NavFooter />,
        children: [
          { path: "/posts/create", element: <Blog action="create" /> },
        ],
      },
    ],
    { initialEntries: ["/posts/create"], initialIndex: 0 },
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

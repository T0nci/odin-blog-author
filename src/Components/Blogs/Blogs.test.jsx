/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import Blogs from "./Blogs";
import NavFooter from "../NavFooter/NavFooter";

global.fetch = vi.fn();

const setupRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <NavFooter />,
        children: [{ index: true, element: <Blogs /> }],
      },
    ],
    {
      initialEntries: ["/"],
      initialIndex: 0,
    },
  );

  render(<RouterProvider router={router} />);

  return router;
};

describe("Blogs Component", () => {
  it("renders", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      posts: [
        { id: 1, title: "title 1", is_published: true },
        { id: 2, title: "title 2", is_published: false },
      ],
    });
    global.fetch.mockResolvedValueOnce({ json });

    await act(() => setupRouter());

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
            <div
              class="_positioned_113509"
            >
              <a
                class="_new_113509"
                data-discover="true"
                href="/posts/create"
              >
                +
              </a>
              <ul
                class="_blogs_113509"
              >
                <li
                  class="_blog_113509"
                >
                  <p
                    class="_title_113509"
                  >
                    title 1
                  </p>
                  <button
                    class="_blog-button_113509"
                  >
                    Unpublish
                  </button>
                  <button
                    class="_blog-button_113509"
                  >
                    Edit
                  </button>
                </li>
                <li
                  class="_blog_113509"
                >
                  <p
                    class="_title_113509"
                  >
                    title 2
                  </p>
                  <button
                    class="_blog-button_113509"
                  >
                    Publish
                  </button>
                  <button
                    class="_blog-button_113509"
                  >
                    Edit
                  </button>
                </li>
              </ul>
            </div>
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

  it("redirects to login when token is invalid", async () => {
    const mock = vi.fn();

    global.localStorage = {
      getItem: () => "invalid token",
      removeItem: mock,
    };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      error: "401: Unauthorized",
    });
    global.fetch.mockResolvedValueOnce({ json });

    let router = null;
    await act(() => {
      router = setupRouter();
    });

    expect(mock).toHaveBeenCalledWith("token");
    expect(router.state.location.pathname).toBe("/login");
  });

  it("publishes and unpublishes a blog", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      posts: [
        { id: 1, title: "title 1", is_published: true },
        { id: 2, title: "title 2", is_published: false },
      ],
    });
    json.mockResolvedValueOnce({
      post: { id: 1, title: "title 1", is_published: false },
    });
    json.mockResolvedValueOnce({
      post: { id: 2, title: "title 2", is_published: true },
    });
    global.fetch.mockResolvedValue({ json });

    await act(() => setupRouter());
    const user = userEvent.setup();

    const toUnpublish = screen.getByRole("button", { name: "Unpublish" });
    const toPublish = screen.getByRole("button", { name: "Publish" });

    await act(async () => {
      await user.click(toUnpublish);
      await user.click(toPublish);
    });

    expect(toUnpublish.textContent).toBe("Publish");
    expect(toPublish.textContent).toBe("Unpublish");
  });

  it("redirects to home if token is invalid/tampered with when publishing/un-publishing", async () => {
    const mock = vi.fn();

    global.localStorage = {
      getItem: () => "invalid token",
      removeItem: mock,
    };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      posts: [
        { id: 1, title: "title 1", is_published: true },
        { id: 2, title: "title 2", is_published: false },
      ],
    });
    json.mockResolvedValueOnce({ error: "401" });
    global.fetch.mockResolvedValue({ json });

    let router = null;
    await act(() => {
      router = setupRouter();
    });
    const user = userEvent.setup();

    await act(
      async () =>
        await user.click(screen.getByRole("button", { name: "Unpublish" })),
    );

    expect(mock).toHaveBeenCalledWith("token");
    expect(router.state.location.pathname).toBe("/login");
  });

  it("goes to edit the post when Edit is clicked", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      posts: [{ id: 1, title: "title 1", is_published: true }],
    });
    global.fetch.mockResolvedValueOnce({ json });

    let router = null;
    await act(() => {
      router = setupRouter();
    });
    const user = userEvent.setup();

    await act(
      async () =>
        await user.click(screen.getByRole("button", { name: "Edit" })),
    );

    expect(router.state.location.pathname).toBe("/posts/update/1");
  });

  it("goes to create a new post when '+' is clicked", async () => {
    global.localStorage = { getItem: () => "some token value" };
    const json = vi.fn();
    json.mockResolvedValueOnce({
      posts: [],
    });
    global.fetch.mockResolvedValueOnce({ json });

    let router = null;
    await act(() => {
      router = setupRouter();
    });
    const user = userEvent.setup();

    await act(
      async () => await user.click(screen.getByRole("link", { name: "+" })),
    );

    expect(router.state.location.pathname).toBe("/posts/create");
  });
});

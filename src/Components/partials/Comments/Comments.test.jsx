/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Comments from "./Comments";

global.fetch = vi.fn();
const navigate = vi.fn();
const setToken = vi.fn();
const deleteComment = vi.fn();

describe("Comments Component", () => {
  it("renders", () => {
    let container = null;
    act(() => {
      const { container: temp } = render(
        <Comments
          postId="1"
          comments={[
            { id: 1, content: "Hi", displayName: "Odin", date: "2000-01-01" },
          ]}
          navigate={() => {}}
          setToken={() => {}}
          setErrors={() => {}}
          deleteComment={() => {}}
        />,
      );

      container = temp;
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
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
              Odin
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
              Hi
            </p>
          </li>
        </ul>
      </div>
    `);
  });

  it("deletes a comment", async () => {
    const json = vi.fn().mockResolvedValueOnce({ status: "200" });
    global.fetch.mockResolvedValueOnce({ json });

    act(() =>
      render(
        <Comments
          postId="1"
          comments={[
            { id: 1, content: "Hi", displayName: "Odin", date: "2000-01-01" },
          ]}
          navigate={() => {}}
          setToken={() => {}}
          setErrors={() => {}}
          deleteComment={deleteComment}
        />,
      ),
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));

    expect(deleteComment).toHaveBeenCalledWith(1);
  });

  it("redirects to home when the post or comment are not found", async () => {
    const json = vi.fn().mockResolvedValueOnce({ error: "404" });
    global.fetch.mockResolvedValueOnce({ json });

    act(() =>
      render(
        <Comments
          postId="1"
          comments={[
            { id: 1, content: "Hi", displayName: "Odin", date: "2000-01-01" },
          ]}
          navigate={navigate}
          setToken={() => {}}
          setErrors={() => {}}
          deleteComment={() => {}}
        />,
      ),
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("deletes a comment", async () => {
    const removeItem = vi.fn();
    global.localStorage = { getItem: () => {}, removeItem };
    const json = vi.fn().mockResolvedValueOnce({ error: "401" });
    global.fetch.mockResolvedValueOnce({ json });

    act(() =>
      render(
        <Comments
          postId="1"
          comments={[
            { id: 1, content: "Hi", displayName: "Odin", date: "2000-01-01" },
          ]}
          navigate={() => {}}
          setToken={setToken}
          setErrors={() => {}}
          deleteComment={() => {}}
        />,
      ),
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));

    expect(removeItem).toHaveBeenCalledWith("token");
    expect(setToken).toHaveBeenCalledWith(null);
  });
});

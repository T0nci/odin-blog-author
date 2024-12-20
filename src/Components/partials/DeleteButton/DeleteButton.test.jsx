/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteButton from "./DeleteButton";

global.fetch = vi.fn();
const navigate = vi.fn();
const setToken = vi.fn();

describe("DeleteButton Component", () => {
  it("renders", () => {
    let container = null;
    act(() => {
      const { container: temp } = render(
        <DeleteButton
          postId="1"
          navigate={() => {}}
          setErrors={() => {}}
          setToken={() => {}}
        />,
      );
      container = temp;
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          type="button"
        >
          Delete
        </button>
      </div>
    `);
  });

  it("deletes post", async () => {
    const json = vi.fn().mockResolvedValueOnce({ status: "200" });
    global.fetch.mockResolvedValueOnce({ json });

    act(() =>
      render(
        <DeleteButton
          postId="1"
          navigate={navigate}
          setErrors={() => {}}
          setToken={setToken}
        />,
      ),
    );
    const user = userEvent.setup();

    await act(async () => await user.click(screen.getByRole("button")));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("navigates to home when post is not found", async () => {
    const json = vi.fn().mockResolvedValueOnce({ error: "404" });
    global.fetch.mockResolvedValueOnce({ json });

    act(() =>
      render(
        <DeleteButton
          postId="1"
          navigate={navigate}
          setErrors={() => {}}
          setToken={setToken}
        />,
      ),
    );
    const user = userEvent.setup();

    await act(async () => await user.click(screen.getByRole("button")));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("navigates to login when token is invalid", async () => {
    const json = vi.fn().mockResolvedValueOnce({ error: "401: Unauthorized" });
    global.fetch.mockResolvedValueOnce({ json });
    const removeItem = vi.fn();
    global.localStorage = { removeItem, getItem: () => {} };

    act(() =>
      render(
        <DeleteButton
          postId="1"
          navigate={navigate}
          setErrors={() => {}}
          setToken={setToken}
        />,
      ),
    );
    const user = userEvent.setup();

    await act(async () => await user.click(screen.getByRole("button")));

    expect(removeItem).toHaveBeenCalledWith("token");
    expect(setToken).toHaveBeenCalledWith(null);
  });
});

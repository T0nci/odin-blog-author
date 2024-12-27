/* eslint-disable no-undef */
import { describe, it, expect, vi } from "vitest";
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemoButton from "./DemoButton";

global.fetch = vi.fn();
const navigate = vi.fn();

describe("DemoButton Component", () => {
  it("renders", () => {
    let container = null;
    act(() => {
      const { container: temp } = render(
        <DemoButton navigate={() => {}} setErrors={() => {}} />,
      );
      container = temp;
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button>
          Try Demo Account
        </button>
      </div>
    `);
  });

  it("logs the user in", async () => {
    const setItem = vi.fn();
    global.localStorage = { setItem };
    const json = vi.fn().mockResolvedValueOnce({
      token: "some token value",
    });
    global.fetch.mockResolvedValueOnce({ json });

    act(() => render(<DemoButton navigate={navigate} setErrors={() => {}} />));
    const user = userEvent.setup();

    await act(async () => await user.click(screen.getByRole("button")));

    expect(navigate).toHaveBeenCalledWith("/");
    expect(setItem).toHaveBeenCalledWith("token", "some token value");
  });
});

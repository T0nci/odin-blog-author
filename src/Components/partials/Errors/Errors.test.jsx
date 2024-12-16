import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Errors from "./Errors";

describe("Errors Component", () => {
  it("renders correctly", () => {
    const errors = [{ msg: "401" }, { msg: "Bad request" }];
    const { container } = render(<Errors errors={errors} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <ul
          class="_errors_8c030b"
        >
          <li
            class="_error_8c030b"
          >
            401
          </li>
          <li
            class="_error_8c030b"
          >
            Bad request
          </li>
        </ul>
      </div>
    `);
  });
});

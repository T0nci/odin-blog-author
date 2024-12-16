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
          class="_errors_ae1fe8"
        >
          <li
            class="_error_ae1fe8"
          >
            401
          </li>
          <li
            class="_error_ae1fe8"
          >
            Bad request
          </li>
        </ul>
      </div>
    `);
  });
});

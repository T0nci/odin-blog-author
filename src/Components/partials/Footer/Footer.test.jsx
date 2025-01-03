import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders correctly", () => {
    const { container } = render(<Footer />);

    expect(container).toMatchInlineSnapshot(`
      <div>
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
});

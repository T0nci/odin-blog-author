import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import Preview from "./Preview";

describe("Preview Component", () => {
  it("renders", () => {
    let container = null;
    act(() => {
      const { container: temp } = render(
        <Preview fields={{ title: "Test title", content: "Test content" }} />,
      );
      container = temp;
    });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <header
          class="_main-heading_3ae0c3"
        >
          Test title
        </header>
        <div
          class="_content_3ae0c3"
        >
          Test content
        </div>
      </div>
    `);
  });
});

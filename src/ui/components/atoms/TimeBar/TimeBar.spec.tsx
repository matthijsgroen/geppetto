import { fireEvent, render, screen } from "@testing-library/react";

import { TimeBar } from "./TimeBar";

describe(TimeBar, () => {
  it("triggers onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <TimeBar duration={10} onClick={onClick} start={0} trackIndex={0} />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  describe("mini variant", () => {
    it("does not trigger onClick when clicked", () => {
      const onClick = vi.fn();
      render(
        <TimeBar
          duration={10}
          onClick={onClick}
          start={0}
          trackIndex={0}
          variant="mini"
        />
      );

      const div = screen.getByRole("presentation");
      fireEvent.click(div);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});

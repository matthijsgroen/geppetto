import { fireEvent, render } from "@testing-library/react";

import { TimeStretchHandle } from "./TimeStretchHandle";

describe("TimeStretchHandle", () => {
  const baseProps = {
    location: 0,
    zoom: 1,
  };

  describe("drag behavior", () => {
    it("calls onDrag with correct time delta on drag (no modifier)", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 101 }); // 1 pixel move
      expect(onDrag).toHaveBeenCalledWith(0.0625);
    });

    it("applies extraSmall step size with Alt+Shift", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, {
        clientX: 101,
        altKey: true,
        shiftKey: true,
      }); // 1 pixel move
      expect(onDrag).toHaveBeenCalledWith(0.1);
    });

    it("applies small step size with Alt", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 101, altKey: true });
      expect(onDrag).toHaveBeenCalledWith(0); // rounded down to 0.2 step size
      onDrag.mockClear();
      fireEvent.mouseMove(window, { clientX: 102, altKey: true });
      expect(onDrag).toHaveBeenCalledWith(0.2); // rounded up to 0.2 step size
    });

    it("applies large step size with Shift", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle =
        container.querySelector("div[onmousedown]") || container.firstChild;
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 103, shiftKey: true });
      expect(onDrag).toHaveBeenCalledWith(0);
      onDrag.mockClear();
      fireEvent.mouseMove(window, { clientX: 104, shiftKey: true });
      expect(onDrag).toHaveBeenCalledWith(0.5);
    });

    it("applies extraLarge step size with Ctrl", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 107, ctrlKey: true });
      expect(onDrag).toHaveBeenCalledWith(0);
      onDrag.mockClear();
      fireEvent.mouseMove(window, { clientX: 108, ctrlKey: true });
      expect(onDrag).toHaveBeenCalledWith(1);
    });

    it("applies extraLarge step size with Cmd", () => {
      const onDrag = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDrag={onDrag} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 107, metaKey: true });
      expect(onDrag).toHaveBeenCalledWith(0);
      onDrag.mockClear();
      fireEvent.mouseMove(window, { clientX: 108, metaKey: true });
      expect(onDrag).toHaveBeenCalledWith(1);
    });

    it("calls onDragRelease on mouse up", () => {
      const onDragRelease = vi.fn();
      const { container } = render(
        <TimeStretchHandle {...baseProps} onDragRelease={onDragRelease} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 116 });
      fireEvent.mouseUp(window, { clientX: 116 });
      expect(onDragRelease).toHaveBeenCalledWith(1);
    });
  });

  describe("tooltip display", () => {
    it("shows tooltip on drag", () => {
      const { container, getByText } = render(
        <TimeStretchHandle {...baseProps} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      expect(getByText("0 ms")).toBeInTheDocument();
    });

    it("shows tooltip on drag in ms under the second", () => {
      const { container, getByText } = render(
        <TimeStretchHandle {...baseProps} location={0.3} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      expect(getByText("300 ms")).toBeInTheDocument();
    });

    it("shows tooltip on drag in s over the second", () => {
      const { container, getByText } = render(
        <TimeStretchHandle {...baseProps} location={18.3} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      expect(getByText("18.30 s")).toBeInTheDocument();
    });

    it("hides tooltip on drag end", () => {
      const { container, queryByText } = render(
        <TimeStretchHandle {...baseProps} />
      );
      const handle = container.querySelector(".cursor-ew-resize");
      fireEvent.mouseDown(handle as Element, { clientX: 100 });
      fireEvent.mouseUp(window, { clientX: 100 });
      expect(queryByText("0 ms")).not.toBeInTheDocument();
    });
  });
});

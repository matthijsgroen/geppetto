import { fireEvent } from "@storybook/testing-library";

function getElementClientCenter(element: HTMLElement) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export default async function drag(
  element: HTMLElement,
  options:
    | { to: HTMLElement; steps?: number; duration?: number }
    | { delta: { x: number; y: number }; steps?: number; duration?: number }
) {
  const steps = options.steps ?? 20;
  const duration = options.duration ?? 500;
  const from = getElementClientCenter(element);
  const to =
    "delta" in options
      ? {
          x: from.x + options.delta.x,
          y: from.y + options.delta.y,
        }
      : getElementClientCenter(options.to);

  const step = {
    x: (to.x - from.x) / steps,
    y: (to.y - from.y) / steps,
  };

  const current = {
    clientX: from.x,
    clientY: from.y,
  };

  fireEvent.mouseEnter(element, current);
  fireEvent.mouseOver(element, current);
  fireEvent.mouseMove(element, current);
  fireEvent.mouseDown(element, current);
  for (let i = 0; i < steps; i++) {
    current.clientX += step.x;
    current.clientY += step.y;
    await sleep(duration / steps);
    fireEvent.mouseMove(element, current);
  }
  fireEvent.mouseUp(element, current);
}
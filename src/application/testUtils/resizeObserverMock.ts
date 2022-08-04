class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    const fakeEntry: ResizeObserverEntry = {
      target: document.createElement("div"),
      contentRect: {
        x: 1,
        y: 1,
        top: 1,
        left: 1,
        right: 2,
        bottom: 2,
        height: 1,
        width: 1,
        toJSON: jest.fn(),
      },
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    };
    callback([fakeEntry], this);
  }

  disconnect() {}
  observe() {}
  unobserve() {}
}

export const mockResizeObserver = () => {
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverMock;
  }
};

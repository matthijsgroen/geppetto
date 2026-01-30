import { formatSpeed } from "./speedFormatter";

describe("speedFormatter", () => {
  it("displays slower speeds correctly", () => {
    expect(formatSpeed(1 / 8)).toBe("8× slower");
    expect(formatSpeed(1 / 4)).toBe("4× slower");
    expect(formatSpeed(1 / 2)).toBe("2× slower");
    expect(formatSpeed(1 / 1.5)).toBe("1.5× slower");
  });

  it("displays original speed correctly", () => {
    expect(formatSpeed(1)).toBe("Original speed");
  });

  it("displays faster speeds correctly", () => {
    expect(formatSpeed(1.5)).toBe("1.5× faster");
    expect(formatSpeed(2)).toBe("2× faster");
    expect(formatSpeed(4)).toBe("4× faster");
    expect(formatSpeed(8)).toBe("8× faster");
  });
});

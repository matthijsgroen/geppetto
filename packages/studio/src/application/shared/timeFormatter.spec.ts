import { formatTime } from "./timeFormatter";

describe("timeFormatter", () => {
  it("displays milliseconds if less than 1 second", () => {
    expect(formatTime(500)).toBe("500 ms");
    expect(formatTime(999)).toBe("999 ms");
  });

  it("displays seconds if less than 1 minute", () => {
    expect(formatTime(1000)).toBe("1 s");
    expect(formatTime(1500)).toBe("1.5 s");
    expect(formatTime(59000)).toBe("59 s");
  });

  it("displays minutes and seconds if 1 minute or more", () => {
    expect(formatTime(60000)).toBe("01:00");
    expect(formatTime(61000)).toBe("01:01");
    expect(formatTime(61500)).toBe("01:01.500");
    expect(formatTime(3599000)).toBe("59:59");
    expect(formatTime(3599876)).toBe("59:59.876");
  });
});

import { shortcutStr } from "./shortcut";

describe("shortcutStr", () => {
  describe("for mac", () => {
    const mShort = (options: Parameters<typeof shortcutStr>[0]) =>
      shortcutStr({ ...options, mac: true });

    it("supports simple keys", () => {
      const result = mShort({ key: "KeyH" });
      expect(result).toEqual("H");
    });

    it("supports shift", () => {
      const result = mShort({ key: "KeyH", shift: true });
      expect(result).toEqual("⇧ H");
    });

    it("supports cmd", () => {
      const result = mShort({ key: "KeyH", ctrlOrCmd: true });
      expect(result).toEqual("⌘ H");
    });

    it("supports option", () => {
      const result = mShort({ key: "KeyH", alt: true });
      expect(result).toEqual("⎇ H");
    });

    it("supports option and cmd", () => {
      const result = mShort({ key: "KeyH", alt: true, ctrlOrCmd: true });
      expect(result).toEqual("⎇ ⌘ H");
    });

    it("supports shift and cmd", () => {
      const result = mShort({ key: "KeyH", shift: true, ctrlOrCmd: true });
      expect(result).toEqual("⇧ ⌘ H");
    });

    it("supports shift and option", () => {
      const result = mShort({ key: "KeyH", shift: true, alt: true });
      expect(result).toEqual("⎇ ⇧ H");
    });

    it("supports cmd and shift and option", () => {
      const result = mShort({
        key: "KeyH",
        ctrlOrCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("⎇ ⇧ ⌘ H");
    });
  });

  describe("for non-mac", () => {
    const short = (options: Parameters<typeof shortcutStr>[0]) =>
      shortcutStr({ ...options, mac: false });

    it("supports simple keys", () => {
      const result = short({ key: "KeyH" });
      expect(result).toEqual("H");
    });

    it("supports shift", () => {
      const result = short({ key: "KeyH", shift: true });
      expect(result).toEqual("Shift+H");
    });

    it("supports cmd", () => {
      const result = short({ key: "KeyH", ctrlOrCmd: true });
      expect(result).toEqual("Ctrl+H");
    });

    it("supports option", () => {
      const result = short({ key: "KeyH", alt: true });
      expect(result).toEqual("Alt+H");
    });

    it("supports option and cmd", () => {
      const result = short({ key: "KeyH", alt: true, ctrlOrCmd: true });
      expect(result).toEqual("Ctrl+Alt+H");
    });

    it("supports shift and cmd", () => {
      const result = short({ key: "KeyH", shift: true, ctrlOrCmd: true });
      expect(result).toEqual("Ctrl+Shift+H");
    });

    it("supports shift and option", () => {
      const result = short({ key: "KeyH", shift: true, alt: true });
      expect(result).toEqual("Alt+Shift+H");
    });

    it("supports cmd and shift and option", () => {
      const result = short({
        key: "KeyH",
        ctrlOrCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("Ctrl+Alt+Shift+H");
    });
  });
});

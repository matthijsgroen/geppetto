import { shortcut } from "./shortcut";

describe("shortcut", () => {
  describe("for mac", () => {
    const mShort = (options: Parameters<typeof shortcut>[0]) =>
      shortcut({ ...options, mac: true });

    it("supports simple keys", () => {
      const result = mShort({ key: "H" });
      expect(result).toEqual("H");
    });

    it("supports shift", () => {
      const result = mShort({ key: "H", shift: true });
      expect(result).toEqual("⇧ H");
    });

    it("supports cmd", () => {
      const result = mShort({ key: "H", ctrlCmd: true });
      expect(result).toEqual("⌘ H");
    });

    it("supports option", () => {
      const result = mShort({ key: "H", alt: true });
      expect(result).toEqual("⎇ H");
    });

    it("supports option and cmd", () => {
      const result = mShort({ key: "H", alt: true, ctrlCmd: true });
      expect(result).toEqual("⎇ ⌘ H");
    });

    it("supports shift and cmd", () => {
      const result = mShort({ key: "H", shift: true, ctrlCmd: true });
      expect(result).toEqual("⇧ ⌘ H");
    });

    it("supports shift and option", () => {
      const result = mShort({ key: "H", shift: true, alt: true });
      expect(result).toEqual("⎇ ⇧ H");
    });

    it("supports cmd and shift and option", () => {
      const result = mShort({
        key: "H",
        ctrlCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("⎇ ⇧ ⌘ H");
    });
  });

  describe("for non-mac", () => {
    const short = (options: Parameters<typeof shortcut>[0]) =>
      shortcut({ ...options, mac: false });

    it("supports simple keys", () => {
      const result = short({ key: "H" });
      expect(result).toEqual("H");
    });

    it("supports shift", () => {
      const result = short({ key: "H", shift: true });
      expect(result).toEqual("Shift+H");
    });

    it("supports cmd", () => {
      const result = short({ key: "H", ctrlCmd: true });
      expect(result).toEqual("Ctrl+H");
    });

    it("supports option", () => {
      const result = short({ key: "H", alt: true });
      expect(result).toEqual("Alt+H");
    });

    it("supports option and cmd", () => {
      const result = short({ key: "H", alt: true, ctrlCmd: true });
      expect(result).toEqual("Ctrl+Alt+H");
    });

    it("supports shift and cmd", () => {
      const result = short({ key: "H", shift: true, ctrlCmd: true });
      expect(result).toEqual("Ctrl+Shift+H");
    });

    it("supports shift and option", () => {
      const result = short({ key: "H", shift: true, alt: true });
      expect(result).toEqual("Alt+Shift+H");
    });

    it("supports cmd and shift and option", () => {
      const result = short({
        key: "H",
        ctrlCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("Ctrl+Alt+Shift+H");
    });
  });
});

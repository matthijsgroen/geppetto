import { shortcutStr } from "./shortcut";

describe("shortcutStr", () => {
  describe("for mac", () => {
    const mShort = (options: Parameters<typeof shortcutStr>[0]) =>
      shortcutStr({ ...options, mac: true });

    it("supports simple keys", () => {
      const result = mShort({ interaction: "KeyH" });
      expect(result).toEqual("H");
    });

    it("supports Delete", () => {
      const result = mShort({ interaction: "Delete" });
      expect(result).toEqual("⌦");
    });

    it("supports Delete or Backspace", () => {
      const result = mShort({ interaction: "DelOrBackspace" });
      expect(result).toEqual("⌫");
    });

    it("supports Backspace", () => {
      const result = mShort({ interaction: "Backspace" });
      expect(result).toEqual("⌫");
    });

    it("supports shift", () => {
      const result = mShort({ interaction: "KeyH", shift: true });
      expect(result).toEqual("⇧ H");
    });

    it("supports cmd", () => {
      const result = mShort({ interaction: "KeyH", ctrlOrCmd: true });
      expect(result).toEqual("⌘ H");
    });

    it("supports option", () => {
      const result = mShort({ interaction: "KeyH", alt: true });
      expect(result).toEqual("⎇ H");
    });

    it("supports option and cmd", () => {
      const result = mShort({
        interaction: "KeyH",
        alt: true,
        ctrlOrCmd: true,
      });
      expect(result).toEqual("⎇ ⌘ H");
    });

    it("supports shift and cmd", () => {
      const result = mShort({
        interaction: "KeyH",
        shift: true,
        ctrlOrCmd: true,
      });
      expect(result).toEqual("⇧ ⌘ H");
    });

    it("supports shift and option", () => {
      const result = mShort({ interaction: "KeyH", shift: true, alt: true });
      expect(result).toEqual("⎇ ⇧ H");
    });

    it("supports cmd and shift and option", () => {
      const result = mShort({
        interaction: "KeyH",
        ctrlOrCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("⎇ ⇧ ⌘ H");
    });

    it("supports mouse gestures", () => {
      const result = mShort({
        interaction: "MouseDrag",
        shift: true,
      });
      expect(result).toEqual("⇧ Drag");
    });
  });

  describe("for non-mac", () => {
    const short = (options: Parameters<typeof shortcutStr>[0]) =>
      shortcutStr({ ...options, mac: false });

    it("supports simple keys", () => {
      const result = short({ interaction: "KeyH" });
      expect(result).toEqual("H");
    });

    it("supports Delete", () => {
      const result = short({ interaction: "Delete" });
      expect(result).toEqual("Del");
    });

    it("supports Delete or Backspace", () => {
      const result = short({ interaction: "DelOrBackspace" });
      expect(result).toEqual("Del");
    });

    it("supports BackSpace", () => {
      const result = short({ interaction: "Backspace" });
      expect(result).toEqual("Backspace");
    });

    it("supports shift", () => {
      const result = short({ interaction: "KeyH", shift: true });
      expect(result).toEqual("Shift+H");
    });

    it("supports cmd", () => {
      const result = short({ interaction: "KeyH", ctrlOrCmd: true });
      expect(result).toEqual("Ctrl+H");
    });

    it("supports option", () => {
      const result = short({ interaction: "KeyH", alt: true });
      expect(result).toEqual("Alt+H");
    });

    it("supports option and cmd", () => {
      const result = short({ interaction: "KeyH", alt: true, ctrlOrCmd: true });
      expect(result).toEqual("Ctrl+Alt+H");
    });

    it("supports shift and cmd", () => {
      const result = short({
        interaction: "KeyH",
        shift: true,
        ctrlOrCmd: true,
      });
      expect(result).toEqual("Ctrl+Shift+H");
    });

    it("supports shift and option", () => {
      const result = short({ interaction: "KeyH", shift: true, alt: true });
      expect(result).toEqual("Alt+Shift+H");
    });

    it("supports cmd and shift and option", () => {
      const result = short({
        interaction: "KeyH",
        ctrlOrCmd: true,
        shift: true,
        alt: true,
      });
      expect(result).toEqual("Ctrl+Alt+Shift+H");
    });

    it("supports mouse gestures", () => {
      const result = short({
        interaction: "MouseDrag",
        shift: true,
      });
      expect(result).toEqual("Shift+Drag");
    });
  });
});

import { describe, expect, it } from "vitest";

import type { Shortcut } from "./shortcut";
import { isEvent, shortcutStr } from "./shortcut";

describe("shortcutStr", () => {
  describe("for mac", () => {
    const mShort = (options: Parameters<typeof shortcutStr>[0]) =>
      shortcutStr({ ...options, mac: true });

    it("supports simple keys", () => {
      const result = mShort({ interaction: "KeyH" });
      expect(result).toEqual("H");
    });

    it("supports digits", () => {
      const result = mShort({ interaction: "Digit1" });
      expect(result).toEqual("1");
    });

    it("supports Delete", () => {
      const result = mShort({ interaction: "Delete" });
      expect(result).toEqual("⌦");
    });

    it("supports Delete or Backspace", () => {
      const result = mShort({ interaction: "DelOrBackspace" });
      expect(result).toEqual("⌫");
    });

    it("supports Undo", () => {
      const result = mShort({ interaction: "Undo" });
      expect(result).toEqual("⌘ Z");
    });

    it("supports Redo", () => {
      const result = mShort({ interaction: "Redo" });
      expect(result).toEqual("⇧ ⌘ Z");
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

    it("supports Undo", () => {
      const result = short({ interaction: "Undo" });
      expect(result).toEqual("Ctrl+Z");
    });

    it("supports Redo", () => {
      const result = short({ interaction: "Redo" });
      expect(result).toEqual("Ctrl+Y");
    });

    it("supports BackSpace", () => {
      const result = short({ interaction: "Backspace" });
      expect(result).toEqual("Backspace");
    });

    it("supports digits", () => {
      const result = short({ interaction: "Digit1" });
      expect(result).toEqual("1");
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

describe("isEvent", () => {
  it("matches correct event", () => {
    const shortcut: Shortcut = {
      interaction: "KeyH",
      ctrlOrCmd: true,
      shift: true,
      alt: true,
      mac: false,
    };
    const event = {
      code: "KeyH",
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      metaKey: false,
    } as unknown as React.KeyboardEvent<HTMLElement>;

    const result = isEvent(shortcut, event);
    expect(result).toBe(true);
  });

  describe("non-mac undo/redo", () => {
    it("matches undo shortcut", () => {
      const shortcut: Shortcut = {
        interaction: "Undo",
      };
      // Ctrl+Z
      const event = {
        code: "KeyZ",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      const result = isEvent(shortcut, event);
      expect(result).toBe(true);
    });

    it("matches redo shortcut", () => {
      const shortcut: Shortcut = {
        interaction: "Redo",
      };
      // Ctrl+Y
      const event = {
        code: "KeyY",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      const result = isEvent(shortcut, event);
      expect(result).toBe(true);
    });
  });

  describe("mac undo/redo", () => {
    it("matches undo shortcut", () => {
      const shortcut: Shortcut = {
        interaction: "Undo",
        mac: true,
      };
      // Cmd+Z
      const event = {
        code: "KeyZ",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      const result = isEvent(shortcut, event);
      expect(result).toBe(true);
    });

    it("matches redo shortcut", () => {
      const shortcut: Shortcut = {
        interaction: "Redo",
        mac: true,
      };
      // Shift+Cmd+Z
      const event = {
        code: "KeyZ",
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
        metaKey: true,
      } as unknown as React.KeyboardEvent<HTMLElement>;

      const result = isEvent(shortcut, event);
      expect(result).toBe(true);
    });
  });

  it("does not match incorrect event", () => {
    const shortcut: Shortcut = {
      interaction: "KeyH",
      ctrlOrCmd: true,
      shift: true,
      alt: true,
      mac: false,
    };
    const event = {
      code: "KeyH",
      ctrlKey: false,
      shiftKey: true,
      altKey: true,
      metaKey: false,
    } as unknown as React.KeyboardEvent<HTMLElement>;

    const result = isEvent(shortcut, event);
    expect(result).toBe(false);
  });
});

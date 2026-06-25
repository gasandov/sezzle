import { describe, it, expect } from "vitest";
import {
  BUTTON_LAYOUT,
  KEYBOARD_MAP,
  PREVENT_DEFAULT_KEYS,
} from "./buttonLayout";

describe("BUTTON_LAYOUT", () => {
  it("contains an EQUALS button", () => {
    expect(BUTTON_LAYOUT.some((b) => b.value === "EQUALS")).toBe(true);
  });
  it("contains a CLEAR button", () => {
    expect(BUTTON_LAYOUT.some((b) => b.value === "CLEAR")).toBe(true);
  });
  it("contains a BACKSPACE button", () => {
    expect(BUTTON_LAYOUT.some((b) => b.value === "BACKSPACE")).toBe(true);
  });
  it("all buttons have a label and variant", () => {
    BUTTON_LAYOUT.forEach((b) => {
      expect(b.label).toBeTruthy();
      expect(b.variant).toBeTruthy();
    });
  });
});

describe("KEYBOARD_MAP", () => {
  it("maps Enter to EQUALS", () =>
    expect(KEYBOARD_MAP["Enter"]).toBe("EQUALS"));
  it("maps Backspace to BACKSPACE", () =>
    expect(KEYBOARD_MAP["Backspace"]).toBe("BACKSPACE"));
  it("maps Escape to CLEAR", () =>
    expect(KEYBOARD_MAP["Escape"]).toBe("CLEAR"));
  it("maps digit keys", () => {
    for (let i = 0; i <= 9; i++) {
      expect(KEYBOARD_MAP[String(i)]).toBe(String(i));
    }
  });
});

describe("PREVENT_DEFAULT_KEYS", () => {
  it("includes /", () => expect(PREVENT_DEFAULT_KEYS.has("/")).toBe(true));
  it("includes Backspace", () =>
    expect(PREVENT_DEFAULT_KEYS.has("Backspace")).toBe(true));
});

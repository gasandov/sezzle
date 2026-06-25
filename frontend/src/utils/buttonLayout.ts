import { CalcButtonDef } from "../types";

export const BUTTON_LAYOUT: CalcButtonDef[] = [
  { label: "C", value: "CLEAR", variant: "clear" },
  { label: "⌫", value: "BACKSPACE", variant: "function" },
  { label: "%", value: "%", variant: "function" },
  { label: "÷", value: "/", variant: "operator" },

  { label: "7", value: "7", variant: "number" },
  { label: "8", value: "8", variant: "number" },
  { label: "9", value: "9", variant: "number" },
  { label: "×", value: "*", variant: "operator" },

  { label: "4", value: "4", variant: "number" },
  { label: "5", value: "5", variant: "number" },
  { label: "6", value: "6", variant: "number" },
  { label: "−", value: "-", variant: "operator" },

  { label: "1", value: "1", variant: "number" },
  { label: "2", value: "2", variant: "number" },
  { label: "3", value: "3", variant: "number" },
  { label: "+", value: "+", variant: "operator" },

  { label: "(", value: "(", variant: "function" },
  { label: "0", value: "0", variant: "number" },
  { label: ")", value: ")", variant: "function" },
  { label: ".", value: ".", variant: "number" },

  { label: "√", value: "sqrt(", variant: "function" },
  { label: "xʸ", value: "^", variant: "function" },
  { label: "=", value: "EQUALS", variant: "equals", wide: true },
];

export const KEYBOARD_MAP: Record<string, string> = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  ".": ".",
  "(": "(",
  ")": ")",
  "%": "%",
  "^": "^",
  Enter: "EQUALS",
  "=": "EQUALS",
  Backspace: "BACKSPACE",
  Escape: "CLEAR",
  Delete: "CLEAR",
};

export const PREVENT_DEFAULT_KEYS = new Set(["/", "Backspace"]);

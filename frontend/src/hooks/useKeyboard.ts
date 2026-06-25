import { useEffect, useRef } from "react";
import { KEYBOARD_MAP, PREVENT_DEFAULT_KEYS } from "../utils/buttonLayout";

/**
 * Attaches a global keydown listener that maps physical keys to calculator
 * inputs. Uses a ref to track whether the last interaction was a mouse click
 * on a button — if so, we skip the next Enter key to prevent double-fire.
 */
export function useKeyboard(onInput: (value: string) => void) {
  const skipNextEnterRef = useRef(false);

  const markMouseClick = () => {
    skipNextEnterRef.current = true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (PREVENT_DEFAULT_KEYS.has(e.key)) {
        e.preventDefault();
      }

      if (e.key === "Enter" && skipNextEnterRef.current) {
        skipNextEnterRef.current = false;
        return;
      }

      if (e.key === "Enter") {
        skipNextEnterRef.current = false;
      }

      const mapped = KEYBOARD_MAP[e.key];
      if (mapped) {
        onInput(mapped);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInput]);

  return { markMouseClick };
}

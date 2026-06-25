import { ButtonVariant } from "../types";

interface CalcButtonProps {
  label: string;
  value: string;
  variant: ButtonVariant;
  wide?: boolean;
  disabled?: boolean;
  onPress: (value: string) => void;
  onMouseDown?: () => void;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  number: "bg-calc-key text-white hover:bg-opacity-80",
  operator: "bg-calc-key-op text-white hover:bg-opacity-80",
  equals: "bg-calc-key-eq text-white hover:bg-opacity-80 font-bold",
  function: "bg-calc-key-fn text-white hover:bg-opacity-80",
  clear: "bg-red-700 text-white hover:bg-red-600 font-bold",
};

export function CalcButton({
  label,
  value,
  variant,
  wide = false,
  disabled = false,
  onPress,
  onMouseDown,
}: CalcButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onMouseDown={onMouseDown}
      onClick={() => onPress(value)}
      className={[
        "flex items-center justify-center rounded-lg text-xl font-medium",
        "shadow-key active:shadow-key-pressed active:translate-y-0.5",
        "transition-all duration-75 select-none cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "h-14 md:h-16",
        wide ? "col-span-2" : "",
        VARIANT_CLASSES[variant],
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}

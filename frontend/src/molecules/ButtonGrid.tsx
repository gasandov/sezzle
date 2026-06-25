import { CalcButton } from "../atoms/CalcButton";
import { BUTTON_LAYOUT } from "../utils/buttonLayout";

interface ButtonGridProps {
  disabled?: boolean;
  onPress: (value: string) => void;
  onMouseDown: () => void;
}

export function ButtonGrid({
  disabled,
  onPress,
  onMouseDown,
}: ButtonGridProps) {
  return (
    <div
      className="grid grid-cols-4 gap-2"
      role="group"
      aria-label="Calculator buttons"
    >
      {BUTTON_LAYOUT.map((btn) => (
        <CalcButton
          key={btn.value + btn.label}
          label={btn.label}
          value={btn.value}
          variant={btn.variant}
          wide={btn.wide}
          disabled={disabled}
          onPress={onPress}
          onMouseDown={onMouseDown}
        />
      ))}
    </div>
  );
}

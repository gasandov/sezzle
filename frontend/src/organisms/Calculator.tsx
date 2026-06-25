import { Display } from "../molecules/Display";
import { ButtonGrid } from "../molecules/ButtonGrid";
import { useCalculate } from "../hooks/useCalculate";
import { useKeyboard } from "../hooks/useKeyboard";

export function Calculator() {
  const { state, handleInput } = useCalculate();
  const { markMouseClick } = useKeyboard(handleInput);

  return (
    <div
      className="bg-calc-surface rounded-2xl p-4 shadow-2xl w-full max-w-sm mx-auto"
      role="application"
      aria-label="Calculator"
    >
      <Display
        equation={state.equation}
        result={state.result}
        status={state.status}
        errorMessage={state.errorMessage}
      />
      <ButtonGrid
        disabled={state.status === "loading"}
        onPress={handleInput}
        onMouseDown={markMouseClick}
      />
    </div>
  );
}

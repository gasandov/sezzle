import { CalcStatus } from "../../types";
import { DisplayLine } from "../atoms/DisplayLine";
import { Spinner } from "../atoms/Spinner";
import { formatEquation } from "../../utils/formatEquation";

interface DisplayProps {
  equation: string;
  result: string | null;
  status: CalcStatus;
  errorMessage: string | null;
}

export function Display({
  equation,
  result,
  status,
  errorMessage,
}: DisplayProps) {
  const renderSecondLine = () => {
    if (status === "loading") {
      return (
        <div className="flex justify-end items-center h-8">
          <Spinner />
        </div>
      );
    }
    if (status === "error" && errorMessage) {
      return (
        <DisplayLine
          value={errorMessage}
          aria-label="Error"
          className="text-red-400 text-base"
        />
      );
    }
    if (status === "success" && result) {
      return (
        <DisplayLine
          value={`= ${result}`}
          aria-label="Result"
          className="text-calc-key-eq text-3xl font-bold"
        />
      );
    }
    return <div className="h-8" />;
  };

  return (
    <div
      className="bg-calc-display rounded-xl p-4 mb-4 min-h-[112px] flex flex-col justify-between"
      aria-live="polite"
    >
      <DisplayLine
        value={formatEquation(equation)}
        aria-label="Equation"
        className="text-gray-300 text-lg min-h-[1.5rem]"
      />
      {renderSecondLine()}
    </div>
  );
}

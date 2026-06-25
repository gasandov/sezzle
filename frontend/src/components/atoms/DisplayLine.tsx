interface DisplayLineProps {
  value: string;
  className?: string;
  "aria-label"?: string;
}

export function DisplayLine({
  value,
  className = "",
  "aria-label": ariaLabel,
}: DisplayLineProps) {
  return (
    <div
      className={`text-right break-all leading-tight ${className}`}
      aria-label={ariaLabel}
      role="status"
    >
      {value || " "}
    </div>
  );
}

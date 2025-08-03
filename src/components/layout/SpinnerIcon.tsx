type SpinnerProps = {
  className?: string;
};

export const SpinnerIcon: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={`animate-spin ${className}`}
      style={{ background: "none", shapeRendering: "auto" }}
      aria-label="Loading indicator"
      role="status"
    >
      <circle
        cx="50"
        cy="50"
        r="32"
        strokeWidth="8"
        stroke="currentColor"
        strokeDasharray="50.26548245743669 50.26548245743669"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

import type React from "react";

const LoadingSpinner = ({ size }: { size?: number }) => {
  return (
    <div
      className={`animate-spin rounded-full h-${size ? size : 32} w-${size ? size : 32} border-t-2 border-b-2 border-gray-900`}
    ></div>
  );
};

const LoadingSpinnerLayout: React.FC = () => {
  // const shade = `from-black to-violet`;
  const className =
    `fixed inset-0 flex items-center justify-center bg-gradient-to-br` +
    `min-h-screen z-50`;
  return (
    <div className={className}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export { LoadingSpinner, LoadingSpinnerLayout };

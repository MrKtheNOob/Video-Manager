interface ButtonProps {
  onClick: () => void;
  textContent: string;
  variant?: "default" | "delete";
}

export default function Button({
  onClick,
  textContent,
  variant = "default",
}: ButtonProps) {
  // Map variants to Tailwind classes
  const baseClasses =
    "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition";

  const variantClasses = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-400",
    delete:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {textContent}
    </button>
  );
}

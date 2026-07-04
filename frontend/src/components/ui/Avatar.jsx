export default function Avatar({ emoji, size = "md", color }) {
  const sizes = {
    sm: "w-10 h-10 text-xl",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
    xl: "w-28 h-28 text-5xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-2xl flex items-center justify-center shadow-md shrink-0`}
      style={{ backgroundColor: color ? `${color}22` : "#E0F2FE" }}
    >
      {emoji}
    </div>
  );
}

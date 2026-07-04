import Icon from "../icons/Icons";

const sizeMap = {
  sm: { box: "w-10 h-10", icon: 20 },
  md: { box: "w-14 h-14", icon: 28 },
  lg: { box: "w-20 h-20", icon: 40 },
  xl: { box: "w-28 h-28", icon: 56 },
};

export default function Avatar({ icon = "paw", size = "md", color }) {
  const { box, icon: iconSize } = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`${box} rounded-2xl flex items-center justify-center shadow-md shrink-0 text-emerald-600`}
      style={{ backgroundColor: color ? `${color}22` : "#E0F2FE" }}
    >
      <Icon name={icon} size={iconSize} />
    </div>
  );
}

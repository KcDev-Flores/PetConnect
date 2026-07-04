const defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  strokeWidth: 1.75,
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ size = 20, className = "", children, ...props }) {
  return (
    <svg
      {...defaultProps}
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

const icons = {
  home: (p) => (
    <Svg {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </Svg>
  ),
  passport: (p) => (
    <Svg {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M8.5 16.5c.8-1.8 2.2-2.8 3.5-2.8s2.7 1 3.5 2.8" />
    </Svg>
  ),
  alert: (p) => (
    <Svg {...p}>
      <path d="M12 3 2.5 19h19L12 3z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </Svg>
  ),
  search: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 4 4" />
    </Svg>
  ),
  user: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </Svg>
  ),
  paw: (p) => (
    <Svg {...p}>
      <ellipse cx="8" cy="7.5" rx="2" ry="2.5" />
      <ellipse cx="16" cy="7.5" rx="2" ry="2.5" />
      <ellipse cx="5.5" cy="12" rx="1.8" ry="2.2" />
      <ellipse cx="18.5" cy="12" rx="1.8" ry="2.2" />
      <path d="M9 12.5c1.2 3.5 4.8 3.5 6 0 1.2-3.5-1.4-6.5-3-6.5s-4.2 3-3 6.5z" />
    </Svg>
  ),
  dog: (p) => (
    <Svg {...p}>
      <path d="M6 10c-1.5 0-2.5 1.2-2 2.8.4 1.4 1.8 2.2 3.2 2.2" />
      <path d="M18 10c1.5 0 2.5 1.2 2 2.8-.4 1.4-1.8 2.2-3.2 2.2" />
      <path d="M8 8.5 9.5 5.5a2 2 0 0 1 3.8.5L14 8.5" />
      <path d="M7 14.5c1.5 3 3.5 4.5 5 4.5s3.5-1.5 5-4.5" />
      <circle cx="10" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <path d="M11.5 14h1" />
    </Svg>
  ),
  cat: (p) => (
    <Svg {...p}>
      <path d="M6 8 8 4l2 3" />
      <path d="M18 8l-2-4-2 3" />
      <ellipse cx="12" cy="13" rx="5.5" ry="5" />
      <circle cx="10" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <path d="M11 15.5h2" />
      <path d="M9 16.5 8 18M15 16.5l1 1.5" />
    </Svg>
  ),
  heart: (p) => (
    <Svg {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.2A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </Svg>
  ),
  comment: (p) => (
    <Svg {...p}>
      <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V5z" />
    </Svg>
  ),
  share: (p) => (
    <Svg {...p}>
      <path d="M16 5c1.7 0 3 1.3 3 3s-1.3 3-3 3" />
      <path d="M8 12c1.7 0 3 1.3 3 3s-1.3 3-3 3" />
      <path d="M8 12c1.7 0 3-1.3 3-3S9.7 6 8 6" />
      <path d="m11.5 10.5 5-3M11.5 13.5l5 3" />
    </Svg>
  ),
  camera: (p) => (
    <Svg {...p}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3" />
    </Svg>
  ),
  pin: (p) => (
    <Svg {...p}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </Svg>
  ),
  phone: (p) => (
    <Svg {...p}>
      <path d="M6.5 4h3l1.2 4.5-2 1.2a11 11 0 0 0 5.8 5.8l1.2-2 4.5 1.2v3A1.5 1.5 0 0 1 19 19C10.2 18.2 5.8 13.8 5 5a1.5 1.5 0 0 1 1.5-1z" />
    </Svg>
  ),
  edit: (p) => (
    <Svg {...p}>
      <path d="M4 18h4l9.5-9.5a2.1 2.1 0 0 0-3-3L5 15v3z" />
      <path d="M13.5 6.5 17.5 10.5" />
    </Svg>
  ),
  plus: (p) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  check: (p) => (
    <Svg {...p}>
      <path d="M5 12.5 9.5 17 19 7" />
    </Svg>
  ),
  mail: (p) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Svg>
  ),
  lock: (p) => (
    <Svg {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  ),
  users: (p) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.7-5 6-5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 20c0-2.5 2-4 4.5-4" />
    </Svg>
  ),
  image: (p) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m3 16 5-5 4 4 3-3 6 6" />
    </Svg>
  ),
  activity: (p) => (
    <Svg {...p}>
      <path d="M4 12h3l2-7 4 14 2-7h5" />
    </Svg>
  ),
  more: (p) => (
    <Svg {...p}>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </Svg>
  ),
  calendar: (p) => (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </Svg>
  ),
  shield: (p) => (
    <Svg {...p}>
      <path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z" />
      <path d="m9 12 2 2 4-5" />
    </Svg>
  ),
  map: (p) => (
    <Svg {...p}>
      <path d="m9 18-5 2V6l5-2 6 2 5-2v14l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </Svg>
  ),
  upload: (p) => (
    <Svg {...p}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </Svg>
  ),
  clock: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </Svg>
  ),
  spark: (p) => (
    <Svg {...p}>
      <path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3 2-6z" />
      <path d="M19 4v4M17 6h4M5 17v3M3.5 18.5h3" />
    </Svg>
  ),
  qr: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="5" height="5" rx="1" />
      <rect x="15" y="4" width="5" height="5" rx="1" />
      <rect x="4" y="15" width="5" height="5" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h2M14 18h6M12 4v3M12 10v2M4 12h4M10 20v-4" />
    </Svg>
  ),
};

export default function Icon({ name, size = 20, className = "" }) {
  const Component = icons[name];
  if (!Component) return null;
  return Component({ size, className });
}

export function Logo({ size = 36, className = "" }) {
  return (
    <img
      src="/logo.png"
      alt="PetConnect"
      className={`object-contain ${className}`}
      style={{ height: size, width: "auto" }}
    />
  );
}

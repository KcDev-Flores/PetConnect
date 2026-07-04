import { NavLink, Link } from "react-router-dom";
import Icon, { Logo } from "../icons/Icons";

const links = [
  { to: "/", label: "Feed", icon: "home", end: true },
  { to: "/passport", label: "Pasaporte", icon: "passport" },
  { to: "/emergency", label: "Emergencia", icon: "alert" },
  { to: "/search", label: "Buscar", icon: "search" },
  { to: "/profile", label: "Perfil", icon: "user" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-emerald-600 hover:text-emerald-700 transition-colors">
          <Logo size={36} />
          PetConnect
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`
              }
            >
              <Icon name={icon} size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/login"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Entrar
        </Link>
      </div>

      <div className="md:hidden flex justify-around py-2 border-t border-slate-100 bg-white">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium ${
                isActive ? "text-emerald-600" : "text-slate-500"
              }`
            }
          >
            <Icon name={icon} size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

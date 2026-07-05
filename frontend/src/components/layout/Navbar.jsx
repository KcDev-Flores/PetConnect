import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import Icon, { Logo } from "../icons/Icons";

const links = [
  { to: "/", label: "Feed", icon: "home", end: true },
  { to: "/passport", label: "Pasaporte", icon: "passport" },
  { to: "/emergency", label: "Emergencia", icon: "alert" },
  { to: "/search", label: "Buscar", icon: "search" },
  { to: "/profile", label: "Perfil", icon: "user" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCreatePost = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }

    window.setTimeout(() => {
      window.dispatchEvent(new Event("petconnect:open-composer"));
    }, 80);
  };

  const handleLogout = () => {
    localStorage.removeItem("petconnect:auth-token");
    localStorage.removeItem("petconnect:user");
    navigate("/login");
  };

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreatePost}
            className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:flex"
          >
            <Icon name="plus" size={17} />
            Crear
          </button>
          <Link
            to="/login?mode=register"
            className="hidden text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-700 sm:block"
          >
            No tienes cuenta? <span className="font-black text-emerald-600">Registrate aqui</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
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
        <button
          type="button"
          onClick={handleCreatePost}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium text-slate-900"
        >
          <Icon name="plus" size={22} />
          Crear
        </button>
      </div>
    </nav>
  );
}

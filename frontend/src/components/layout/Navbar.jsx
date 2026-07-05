import { useState } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreatePost = () => {
    setIsMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
    }

    window.setTimeout(() => {
      window.dispatchEvent(new Event("petconnect:open-composer"));
    }, 80);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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

        <div className="hidden items-center gap-2 md:flex">
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

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 md:hidden"
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <Icon name={isMobileMenuOpen ? "close" : "menu"} size={23} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Cerrar menu"
            className="fixed inset-0 top-16 z-40 bg-slate-950/35 backdrop-blur-[2px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute left-3 right-3 top-[4.5rem] z-50 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-slate-900/20">
            <div className="bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,#ffffff,#f0fdf4)] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm">
                  <Logo size={30} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Menu</p>
                  <h2 className="text-lg font-black text-slate-950">PetConnect</h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreatePost}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <Icon name="plus" size={18} />
                Crear publicacion
              </button>
            </div>

            <div className="grid gap-2 p-3">
              {links.map(({ to, label, icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon name={icon} size={20} />
                    {label}
                  </span>
                  <Icon name="more" size={18} className="opacity-45" />
                </NavLink>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-4">
              <Link
                to="/login?mode=register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-700"
              >
                No tienes cuenta? <span className="font-black text-emerald-600">Registrate aqui</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-red-600"
              >
                <Icon name="user" size={18} />
                Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

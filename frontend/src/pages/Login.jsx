import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Icon, { Logo } from "../components/icons/Icons";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser, registerUser, loading, error } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "register");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await registerUser(name, email, password);
    } else {
      await loginUser(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3 text-white">
            <Logo size={80} className="drop-shadow-lg" />
            <span className="font-bold text-2xl">PetConnect</span>
          </Link>
          <p className="text-emerald-100 mt-2">La red social para tu mascota</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            {isRegister ? "Crear cuenta" : "Bienvenido"}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {isRegister ? "Regístrate para conectar con la comunidad" : "Inicia sesión en tu cuenta"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="user" size={18} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="mail" size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
            >
              {loading ? "Cargando..." : (isRegister ? "Registrarse" : "Iniciar sesión")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              Continuar sin cuenta →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../../stores/authStore";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta de redirección del estado de la ubicación o usar el dashboard por defecto
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Obtener saludo personalizado según la hora
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({
        correo: email,
        clave: password,
      });

      login(
        {
          id: response.usuario.empresa_id,
          role: response.usuario.rol,
          name: response.usuario.nombre,
        },
        response.token
      );

      // Redirigir al usuario a la página que intentaba acceder
      navigate(from, { replace: true });
    } catch (err) {
      setError("Credenciales inválidas. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Formulario de login */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Header con logo y branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}
            </h1>
            <p className="text-gray-600 text-lg">
              Bienvenido a{" "}
              <span className="font-semibold text-indigo-600">Archímedes</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alerta de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error de autenticación
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Campo de correo electrónico */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 bg-white shadow-sm"
                  placeholder="correo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 bg-white shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>

            {/* Enlaces adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Archímedes - Sistema Contable
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {currentTime.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho - Imagen de fondo y información */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 bg-white bg-opacity-10">
            <svg
              className="absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="hero-pattern"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="1"
                    fill="white"
                    fillOpacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          {/* Contenido */}
          <div className="relative flex flex-col justify-center h-full px-8 lg:px-12">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-white mb-6">
                Bienvenido a Archímedes
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Sistema de Gestión Contable Integral para optimizar y
                automatizar todos los procesos financieros de nuestra empresa.
              </p>

              {/* Módulos disponibles */}
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-indigo-100">
                    Control de Ventas y Compras
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-indigo-100">
                    Gestión de Inventario y Proyectos
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-indigo-100">
                    Tesorería y Nómina Integrada
                  </span>
                </div>
                <div className="flex items-center text-white">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-indigo-100">
                    Reportes DGII y Cumplimiento Fiscal
                  </span>
                </div>
              </div>

              {/* Información de la empresa */}
              <div className="mt-12 space-y-4">
                <div className="border-t border-white border-opacity-20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Información del Sistema
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between text-indigo-100">
                      <span>Versión:</span>
                      <span className="text-white font-medium">v2.1.4</span>
                    </div>
                    <div className="flex justify-between text-indigo-100">
                      <span>Último Update:</span>
                      <span className="text-white font-medium">Enero 2024</span>
                    </div>
                    <div className="flex justify-between text-indigo-100">
                      <span>Soporte:</span>
                      <span className="text-white font-medium">TI Interno</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hora y fecha */}
            <div className="absolute bottom-8 left-8 lg:left-12">
              <div className="text-white">
                <div className="text-2xl font-light">
                  {currentTime.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="text-sm text-indigo-200">
                  {currentTime.toLocaleDateString("es-ES", {
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

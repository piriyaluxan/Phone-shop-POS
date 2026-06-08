import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ userId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError()); // cleanup error on unmount
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full bg-white opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-success opacity-10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
            <span className="text-white font-heading font-bold text-lg">P</span>
          </div>
          <span className="text-white font-heading font-bold text-xl tracking-wide">
            PhoneShop POS
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h1 className="text-white font-heading font-bold text-5xl leading-tight mb-6">
            Manage your shop
            <br />
            <span className="text-success">smarter.</span>
          </h1>
          <p className="text-blue-200 font-body text-lg leading-relaxed max-w-sm">
            One platform for inventory, repairs, billing, and finances — built
            for modern phone shops.
          </p>

          {/* Role pills */}
          <div className="flex gap-3 mt-10">
            {["Admin", "Retail Operator"].map((role) => (
              <span
                key={role}
                className="px-4 py-2 rounded-full border border-white/20 text-white/80 font-body text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-blue-300 font-body text-sm">
          © 2025 PhoneShop POS · All roles, one login
        </p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-heading font-bold">P</span>
            </div>
            <span className="text-primary font-heading font-bold text-lg">
              PhoneShop POS
            </span>
          </div>

          <h2 className="text-dark font-heading font-bold text-3xl mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 font-body text-sm mb-8">
            Sign in to your account to continue
          </p>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠</span>
              <p className="text-red-600 font-body text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-dark font-body font-medium text-sm mb-1.5">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="e.g. ADM-001 or OP-001"
                required
                autoCapitalize="characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-mono text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all uppercase"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-dark font-body font-medium text-sm">
                  Password
                </label>
                <button
                  type="button"
                  className="text-primary font-body text-xs hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-body text-sm text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Dev helper — quick role login hints */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-xs font-body text-gray-400 font-medium mb-2 uppercase tracking-wide">
              Dev credentials
            </p>
            <div className="space-y-1">
              {[
                { role: "Admin", userId: "ADM-001" },
                { role: "Retail Operator", userId: "OP-001" },
              ].map(({ role, userId }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ userId, password: "admin123" })}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors group"
                >
                  <span className="text-xs font-body text-gray-500 group-hover:text-primary transition-colors">
                    <span className="font-semibold text-dark">{role}</span> —{" "}
                    <span className="font-mono">{userId}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

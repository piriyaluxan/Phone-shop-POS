import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const roleColors = {
  admin: "bg-primary text-white",
  technician: "bg-success text-white",
  cashier: "bg-warning text-white",
};

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-surface transition-colors lg:hidden"
        >
          <svg
            className="w-5 h-5 text-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="font-heading font-semibold text-dark text-base hidden sm:block">
          PhoneShop POS
        </h1>
      </div>

      {/* Right: role badge + user + logout */}
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-body font-semibold capitalize ${roleColors[user?.role]}`}
        >
          {user?.role}
        </span>
        <div className="hidden sm:block text-right">
          <p className="font-body font-medium text-dark text-sm leading-none">
            {user?.name}
          </p>
          <p className="font-body text-gray-400 text-xs mt-0.5">
            {user?.email}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-heading font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
          title="Logout"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// Nav items per role
const navConfig = {
  admin: [
    { label: "Dashboard", to: "/admin", icon: "◈", end: true },
    { label: "Inventory", to: "/admin/inventory", icon: "▦" },
    { label: "POS / Billing", to: "/admin/pos", icon: "⊡" },
    { label: "Repairs", to: "/admin/repairs", icon: "⚙" },
    { label: "Finance", to: "/admin/finance", icon: "◎" },
    { label: "Users", to: "/admin/users", icon: "◉" },
  ],
  technician: [
    { label: "Dashboard", to: "/technician", icon: "◈", end: true },
    { label: "Repair Queue", to: "/technician/repairs", icon: "⚙" },
    { label: "Device Lookup", to: "/technician/devices", icon: "▦" },
  ],
  cashier: [
    { label: "Dashboard", to: "/cashier", icon: "◈", end: true },
    { label: "POS / Billing", to: "/cashier/pos", icon: "⊡" },
    { label: "Transactions", to: "/cashier/transactions", icon: "◎" },
  ],
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const links = navConfig[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-primary z-40 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-heading font-bold text-sm">P</span>
          </div>
          <span className="text-white font-heading font-bold text-base tracking-wide">
            PhoneShop
          </span>
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="ml-auto text-white/60 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-blue-300 font-body text-xs">
            v1.0.0 · {user?.role}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

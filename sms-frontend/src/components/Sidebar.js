import { Link, useLocation } from "react-router-dom";
import "../styles/sms.css";

const links = [
  { to: "/admin",           icon: "📊", label: "Dashboard" },
  { to: "/students",        icon: "👥", label: "Students" },
  { to: "/courses",         icon: "📚", label: "Courses" },
  { to: "/marks",           icon: "🎯", label: "Marks" },
  { to: "/mark-attendance", icon: "✅", label: "Mark Attendance" },
  { to: "/attendance",      icon: "📋", label: "Attendance Report" },
  { to: "/announcements",   icon: "📢", label: "Announcements" },
];

function Sidebar() {
  const { pathname } = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <aside className="sms-sidebar">
      <div className="sms-sidebar-brand">
        <div className="sms-sidebar-brand-icon">S</div>
        <div>
          <div className="sms-sidebar-brand-text">SMS Portal</div>
          <div className="sms-sidebar-brand-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sms-sidebar-nav">
        <div className="sms-sidebar-section">Main Menu</div>
        {links.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`sms-sidebar-link ${pathname === to ? "active" : ""}`}
          >
            <span className="sms-sidebar-icon">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="sms-sidebar-footer">
        <button className="sms-logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
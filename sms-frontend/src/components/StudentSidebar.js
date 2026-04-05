import { Link, useLocation } from "react-router-dom";
import "../styles/sms.css";

const links = [
  { to: "/student",               icon: "🏠", label: "Dashboard" },
  { to: "/my-marks",              icon: "🎯", label: "My Marks" },
  { to: "/my-attendance",         icon: "✅", label: "My Attendance" },
  { to: "/student/courses",       icon: "📚", label: "Courses" },
  { to: "/my-courses",            icon: "🎓", label: "My Courses" },
  { to: "/profile",               icon: "👤", label: "Profile" },
  { to: "/student/announcements", icon: "📢", label: "Announcements" },
];

function StudentSidebar() {
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
          <div className="sms-sidebar-brand-sub">Student Panel</div>
        </div>
      </div>

      <nav className="sms-sidebar-nav">
        <div className="sms-sidebar-section">My Space</div>
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

export default StudentSidebar;
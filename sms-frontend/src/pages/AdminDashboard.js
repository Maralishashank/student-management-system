import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCharts from "../components/DashboardCharts";
import "../styles/sms.css";

function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, marks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/stats")
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Students", value: stats.students, icon: "👥", color: "indigo", hint: "Enrolled across all depts" },
    { label: "Active Courses", value: stats.courses,  icon: "📚", color: "cyan",   hint: "Available for enrollment" },
    { label: "Marks Recorded", value: stats.marks,    icon: "🎯", color: "green",  hint: "Subject scores logged" },
  ];

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">Admin Dashboard</div>
            <div className="sms-page-sub">Welcome back — here's what's happening today.</div>
          </div>

          {loading ? <div className="sms-spinner" /> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {cards.map(c => (
                  <div className="sms-stat-card" key={c.label}>
                    <div className={`sms-stat-icon ${c.color}`}>{c.icon}</div>
                    <div>
                      <div className="sms-stat-value">{c.value}</div>
                      <div className="sms-stat-label">{c.label}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{c.hint}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sms-card">
                <div className="sms-card-header">
                  <span className="sms-card-title">📊 Students per Department</span>
                </div>
                <div className="sms-card-body">
                  <DashboardCharts />
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
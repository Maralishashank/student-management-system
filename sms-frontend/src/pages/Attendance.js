// Attendance.js
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/sms.css";

export function Attendance() {
  const [report, setReport]   = useState({});
  const [dept, setDept]       = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.allSettled([
      API.get(`/attendance/report?date=${today}`),
      API.get("/attendance/department-report"),
      API.get("/attendance/all"),
    ]).then(([r, d, a]) => {
      if (r.status === "fulfilled") setReport(r.value.data);
      if (d.status === "fulfilled") setDept(d.value.data);
      if (a.status === "fulfilled") setRecords(a.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const depts = [
    { name: "CSE", color: "#4f46e5", bg: "#ede9fe" },
    { name: "IT",  color: "#0891b2", bg: "#cffafe" },
    { name: "ECE", color: "#d97706", bg: "#fef3c7" },
  ];

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">Attendance Report</div>
            <div className="sms-page-sub">Today's attendance overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
          </div>

          {loading ? <div className="sms-spinner" /> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Students", value: report.totalStudents ?? "—", icon: "👥", color: "indigo" },
                  { label: "Present Today",  value: report.presentToday  ?? "—", icon: "✅", color: "green" },
                  { label: "Absent Today",   value: report.absentToday   ?? "—", icon: "❌", color: "amber" },
                ].map(c => (
                  <div className="sms-stat-card" key={c.label}>
                    <div className={`sms-stat-icon ${c.color}`}>{c.icon}</div>
                    <div><div className="sms-stat-value">{c.value}</div><div className="sms-stat-label">{c.label}</div></div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">🏛 Department Breakdown</span></div>
                  <div className="sms-card-body">
                    {depts.map(d => {
                      const val = dept[d.name] ?? 0;
                      const total = report.totalStudents ? Math.round(report.totalStudents / 3) : 1;
                      const pct = Math.min(100, Math.round((val / total) * 100));
                      return (
                        <div key={d.name} style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, fontSize: 13 }}>{d.name}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{val} present</span>
                          </div>
                          <div className="sms-progress">
                            <div className="sms-progress-bar green" style={{ width: `${pct}%`, background: d.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">📊 Quick Stats</span></div>
                  <div className="sms-card-body">
                    {depts.map(d => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: d.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: d.color }}>{d.name}</div>
                          <span style={{ fontWeight: 600 }}>{d.name} Department</span>
                        </div>
                        <span className="sms-badge" style={{ background: d.bg, color: d.color }}>{dept[d.name] ?? 0} present</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sms-card">
                <div className="sms-card-header">
                  <span className="sms-card-title">📋 All Attendance Records</span>
                  <span className="sms-badge sms-badge-indigo">{records.length} records</span>
                </div>
                <div className="sms-table-wrap">
                  {records.length === 0
                    ? <div className="sms-empty"><div className="sms-empty-icon">📋</div><div className="sms-empty-text">No records yet</div></div>
                    : (
                      <table className="sms-table">
                        <thead><tr><th>Student ID</th><th>Date</th><th>Status</th></tr></thead>
                        <tbody>
                          {records.map(r => (
                            <tr key={r.id}>
                              <td style={{ fontWeight: 600, color: "#64748b" }}>#{r.studentId}</td>
                              <td>{r.date}</td>
                              <td>
                                <span className={`sms-badge ${r.status === "PRESENT" ? "sms-badge-success" : "sms-badge-danger"}`}>
                                  {r.status === "PRESENT" ? "✅ Present" : "❌ Absent"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
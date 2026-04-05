import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/sms.css";

function MarkAttendance() {
  const [dept, setDept] = useState("");
  const [students, setStudents] = useState([]);
  const [att, setAtt] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dept) return;
    API.get(`/students/department/${dept}`)
      .then(r => { setStudents(r.data); setAtt({}); })
      .catch(() => setStudents([]));
  }, [dept]);

  const toggle = (id, status) => setAtt(prev => ({ ...prev, [id]: status }));

  const submit = async () => {
    const unmarked = students.filter(s => !att[s.id]);
    if (unmarked.length) return alert(`${unmarked.length} student(s) not marked yet.`);
    setSubmitting(true);
    const today = new Date().toISOString().split("T")[0];
    try {
      for (const id in att) await API.post("/attendance/mark", { studentId: Number(id), date: today, status: att[id] });
      alert("Attendance submitted successfully!");
      setAtt({});
    } catch (e) { alert(e.response?.data?.error || "Submission failed"); }
    setSubmitting(false);
  };

  const presentCount = Object.values(att).filter(v => v === "PRESENT").length;
  const absentCount  = Object.values(att).filter(v => v === "ABSENT").length;
  const allMarked    = students.length > 0 && students.every(s => att[s.id]);

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">Mark Attendance</div>
            <div className="sms-page-sub">Record today's attendance by department</div>
          </div>

          <div className="sms-card" style={{ marginBottom: 20 }}>
            <div className="sms-card-body">
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div className="sms-form-group" style={{ maxWidth: 200 }}>
                  <label className="sms-label">Select Department</label>
                  <select className="sms-select" value={dept} onChange={e => setDept(e.target.value)}>
                    <option value="">Choose department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                {students.length > 0 && (
                  <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
                    <span className="sms-badge sms-badge-success">✅ {presentCount} Present</span>
                    <span className="sms-badge sms-badge-danger">❌ {absentCount} Absent</span>
                    <span className="sms-badge sms-badge-indigo">👥 {students.length} Total</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {dept && students.length === 0 && (
            <div className="sms-empty"><div className="sms-empty-icon">👥</div><div className="sms-empty-text">No students in {dept}</div></div>
          )}

          {students.length > 0 && (
            <div className="sms-card">
              <div className="sms-card-header">
                <span className="sms-card-title">👥 {dept} Students — {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div style={{ padding: "8px 20px 16px" }}>
                {students.map(s => {
                  const status = att[s.id];
                  return (
                    <div key={s.id} className={`sms-att-row ${status === "PRESENT" ? "present" : status === "ABSENT" ? "absent" : ""}`}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: status === "PRESENT" ? "#d1fae5" : status === "ABSENT" ? "#fee2e2" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#334155", flexShrink: 0 }}>
                        {s.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span className="sms-att-name">{s.name}</span>
                      <div className="sms-att-options">
                        <label className="sms-att-option">
                          <input type="radio" name={`att-${s.id}`} checked={status === "PRESENT"} onChange={() => toggle(s.id, "PRESENT")} />
                          <label style={{ color: "#059669", fontWeight: 700, cursor: "pointer" }}>Present</label>
                        </label>
                        <label className="sms-att-option">
                          <input type="radio" name={`att-${s.id}`} checked={status === "ABSENT"} onChange={() => toggle(s.id, "ABSENT")} />
                          <label style={{ color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>Absent</label>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center" }}>
                <button className="sms-btn sms-btn-primary" onClick={submit} disabled={submitting || !allMarked}>
                  {submitting ? "Submitting..." : "✅ Submit Attendance"}
                </button>
                {!allMarked && <span style={{ fontSize: 12, color: "#94a3b8" }}>Mark all students to enable submit</span>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
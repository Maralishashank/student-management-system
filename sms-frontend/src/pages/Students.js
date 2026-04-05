import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

const DEPT_COLORS = { CSE: "#ede9fe", IT: "#cffafe", ECE: "#fef3c7" };
const DEPT_TEXT   = { CSE: "#4338ca", IT: "#164e63", ECE: "#92400e" };
const initials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
const AV_COLORS = ["#dbeafe", "#d1fae5", "#fce7f3", "#fef3c7", "#ede9fe", "#cffafe"];

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const r = await API.get("/students"); setStudents(r.data.content ?? []); }
    catch { setStudents([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim() || !email.trim() || !department) return alert("Fill in all fields.");
    try {
      await API.post("/students", { name, email, department });
      setName(""); setEmail(""); setDepartment(""); load();
    } catch (e) { alert(e.response?.data?.error || "Error adding student"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try { await API.delete(`/students/${id}`); load(); }
    catch { alert("Error deleting student"); }
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">Students</div>
            <div className="sms-page-sub">{students.length} students registered across all departments</div>
          </div>

          {/* Add form */}
          <div className="sms-card" style={{ marginBottom: 20 }}>
            <div className="sms-card-header"><span className="sms-card-title">➕ Add New Student</span></div>
            <div className="sms-card-body">
              <div className="sms-form-row">
                <div className="sms-form-group">
                  <label className="sms-label">Full Name</label>
                  <input className="sms-input" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="sms-form-group">
                  <label className="sms-label">Email Address</label>
                  <input className="sms-input" placeholder="e.g. rahul@college.edu" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="sms-form-group" style={{ maxWidth: 160 }}>
                  <label className="sms-label">Department</label>
                  <select className="sms-select" value={department} onChange={e => setDepartment(e.target.value)}>
                    <option value="">Select dept</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div style={{ paddingBottom: 0, alignSelf: "flex-end" }}>
                  <button className="sms-btn sms-btn-primary" onClick={add}>Add Student</button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="sms-card">
            <div className="sms-card-header">
              <span className="sms-card-title">👥 All Students</span>
              <div className="sms-search" style={{ width: 240 }}>
                <span className="sms-search-icon">🔍</span>
                <input className="sms-input" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="sms-table-wrap">
              {loading ? <div className="sms-spinner" /> : filtered.length === 0
                ? <div className="sms-empty"><div className="sms-empty-icon">👥</div><div className="sms-empty-text">No students found</div></div>
                : (
                  <table className="sms-table">
                    <thead><tr><th>#</th><th>Student</th><th>Email</th><th>Department</th><th>Action</th></tr></thead>
                    <tbody>
                      {filtered.map((s, i) => (
                        <tr key={s.id}>
                          <td style={{ color: "#94a3b8", fontWeight: 600 }}>{s.id}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div className="sms-avatar" style={{ background: AV_COLORS[i % AV_COLORS.length], color: "#334155" }}>{initials(s.name)}</div>
                              <span style={{ fontWeight: 600 }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={{ color: "#64748b" }}>{s.email}</td>
                          <td>
                            <span className="sms-badge" style={{ background: DEPT_COLORS[s.department] || "#f1f5f9", color: DEPT_TEXT[s.department] || "#334155" }}>
                              {s.department}
                            </span>
                          </td>
                          <td>
                            <button className="sms-btn sms-btn-danger sms-btn-sm" onClick={() => del(s.id)}>🗑 Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Students;
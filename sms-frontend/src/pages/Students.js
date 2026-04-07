import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

const DEPT_COLORS = { CSE: { bg: "#ede9fe", color: "#4338ca" }, IT: { bg: "#cffafe", color: "#164e63" }, ECE: { bg: "#fef3c7", color: "#92400e" } };
const AV_COLORS   = ["#dbeafe", "#d1fae5", "#fce7f3", "#fef3c7", "#ede9fe", "#cffafe"];
const initials    = name => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

function Students() {
  const [students,   setStudents]   = useState([]);
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [department, setDepartment] = useState("");
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);

  // Editing state — stores the id of the row being edited + its draft values
  const [editId,   setEditId]   = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDept,  setEditDept]  = useState("");

  const load = async () => {
    try {
      const r = await API.get("/students");
      setStudents(r.data.content ?? []);
    } catch (e) {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim() || !email.trim() || !department) return alert("Please fill in all fields.");
    try {
      await API.post("/students", { name: name.trim(), email: email.trim(), department });
      setName(""); setEmail(""); setDepartment("");
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Error adding student");
    }
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setEditName(s.name);
    setEditEmail(s.email);
    setEditDept(s.department);
  };

  const cancelEdit = () => setEditId(null);

  const saveEdit = async (id) => {
    if (!editName.trim() || !editEmail.trim() || !editDept) return alert("Please fill in all fields.");
    try {
      await API.put(`/students/${id}`, {
        name:       editName.trim(),
        email:      editEmail.trim(),
        department: editDept,
      });
      setEditId(null);
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Error updating student");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this student? This will also remove their marks, attendance, and login account.")) return;
    try {
      await API.delete(`/students/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Error deleting student");
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">Students</div>
            <div className="sms-page-sub">{students.length} student{students.length !== 1 ? "s" : ""} registered</div>
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
                <div style={{ alignSelf: "flex-end" }}>
                  <button className="sms-btn sms-btn-primary" onClick={add}>Add Student</button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="sms-card">
            <div className="sms-card-header">
              <span className="sms-card-title">👥 All Students</span>
              <div className="sms-search" style={{ width: 260 }}>
                <span className="sms-search-icon">🔍</span>
                <input className="sms-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="sms-table-wrap">
              {loading
                ? <div className="sms-spinner" />
                : filtered.length === 0
                ? <div className="sms-empty"><div className="sms-empty-icon">👥</div><div className="sms-empty-text">No students found</div></div>
                : (
                  <table className="sms-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => {
                        const dc = DEPT_COLORS[s.department] || { bg: "#f1f5f9", color: "#334155" };
                        const isEditing = editId === s.id;

                        return (
                          <tr key={s.id} style={{ background: isEditing ? "#fafbff" : undefined }}>
                            <td style={{ color: "#94a3b8", fontWeight: 600 }}>{s.id}</td>

                            {isEditing ? (
                              // ── Edit mode ──
                              <>
                                <td>
                                  <input
                                    className="sms-input"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    style={{ minWidth: 140 }}
                                    autoFocus
                                  />
                                </td>
                                <td>
                                  <input
                                    className="sms-input"
                                    value={editEmail}
                                    onChange={e => setEditEmail(e.target.value)}
                                    style={{ minWidth: 180 }}
                                  />
                                </td>
                                <td>
                                  <select className="sms-select" value={editDept} onChange={e => setEditDept(e.target.value)} style={{ minWidth: 90 }}>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                  </select>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button className="sms-btn sms-btn-primary sms-btn-sm" onClick={() => saveEdit(s.id)}>✓ Save</button>
                                    <button className="sms-btn sms-btn-sm" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }} onClick={cancelEdit}>✕ Cancel</button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // ── View mode ──
                              <>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div className="sms-avatar" style={{ background: AV_COLORS[i % AV_COLORS.length], color: "#334155" }}>{initials(s.name)}</div>
                                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                                  </div>
                                </td>
                                <td style={{ color: "#64748b" }}>{s.email}</td>
                                <td>
                                  <span className="sms-badge" style={{ background: dc.bg, color: dc.color }}>{s.department}</span>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button className="sms-btn sms-btn-sm" style={{ background: "#ede9fe", color: "#4338ca", border: "1px solid #c4b5fd" }} onClick={() => startEdit(s)}>✏️ Edit</button>
                                    <button className="sms-btn sms-btn-danger sms-btn-sm" onClick={() => del(s.id)}>🗑 Delete</button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
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
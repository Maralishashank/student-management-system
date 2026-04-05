// Courses.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

const DEPT_COLORS = { CSE: { bg: "#ede9fe", color: "#4338ca" }, IT: { bg: "#cffafe", color: "#164e63" }, ECE: { bg: "#fef3c7", color: "#92400e" } };

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState(""); const [instructor, setInstructor] = useState("");
  const [credits, setCredits] = useState(""); const [dept, setDept] = useState("");
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const isStudent = pathname.includes("/student");

  const load = () => API.get("/courses").then(r => setCourses(r.data)).catch(console.log).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim() || !instructor.trim() || !credits || !dept) return alert("Fill all fields.");
    try { await API.post("/courses", { name, instructor, credits: Number(credits), department: dept }); setName(""); setInstructor(""); setCredits(""); setDept(""); load(); }
    catch (e) { alert(e.response?.data?.error || "Error adding course"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try { await API.delete(`/courses/${id}`); load(); }
    catch (e) { alert(e.response?.data?.error || "Error deleting"); }
  };

  const enroll = async (id) => {
    try { await API.post(`/enroll/${id}`); alert("Enrolled successfully!"); }
    catch (e) { alert(e.response?.data?.error || "Enrollment failed"); }
  };

  const SB = isStudent ? StudentSidebar : Sidebar;

  return (
    <div className="sms-layout">
      <SB />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">Courses</div>
            <div className="sms-page-sub">{isStudent ? "Browse and enroll in available courses" : `${courses.length} courses available`}</div>
          </div>

          {!isStudent && (
            <div className="sms-card" style={{ marginBottom: 20 }}>
              <div className="sms-card-header"><span className="sms-card-title">➕ Add Course</span></div>
              <div className="sms-card-body">
                <div className="sms-form-row">
                  <div className="sms-form-group"><label className="sms-label">Course Name</label><input className="sms-input" placeholder="e.g. Data Structures" value={name} onChange={e => setName(e.target.value)} /></div>
                  <div className="sms-form-group"><label className="sms-label">Instructor</label><input className="sms-input" placeholder="e.g. Dr. Sharma" value={instructor} onChange={e => setInstructor(e.target.value)} /></div>
                  <div className="sms-form-group" style={{ maxWidth: 100 }}><label className="sms-label">Credits</label><input className="sms-input" type="number" min="1" placeholder="4" value={credits} onChange={e => setCredits(e.target.value)} /></div>
                  <div className="sms-form-group" style={{ maxWidth: 140 }}>
                    <label className="sms-label">Department</label>
                    <select className="sms-select" value={dept} onChange={e => setDept(e.target.value)}>
                      <option value="">Select</option><option value="CSE">CSE</option><option value="IT">IT</option><option value="ECE">ECE</option>
                    </select>
                  </div>
                  <div style={{ alignSelf: "flex-end" }}><button className="sms-btn sms-btn-primary" onClick={add}>Add Course</button></div>
                </div>
              </div>
            </div>
          )}

          <div className="sms-card">
            <div className="sms-card-header"><span className="sms-card-title">📚 All Courses</span></div>
            <div className="sms-table-wrap">
              {loading ? <div className="sms-spinner" />
                : courses.length === 0
                ? <div className="sms-empty"><div className="sms-empty-icon">📚</div><div className="sms-empty-text">No courses yet</div></div>
                : (
                  <table className="sms-table">
                    <thead><tr><th>Course</th><th>Instructor</th><th>Credits</th><th>Department</th><th>{isStudent ? "Enroll" : "Action"}</th></tr></thead>
                    <tbody>
                      {courses.map(c => {
                        const dc = DEPT_COLORS[c.department] || { bg: "#f1f5f9", color: "#334155" };
                        return (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 700 }}>{c.name}</td>
                            <td style={{ color: "#64748b" }}>{c.instructor}</td>
                            <td><span className="sms-badge sms-badge-indigo">{c.credits} cr</span></td>
                            <td><span className="sms-badge" style={{ background: dc.bg, color: dc.color }}>{c.department}</span></td>
                            <td>
                              {isStudent
                                ? <button className="sms-btn sms-btn-success sms-btn-sm" onClick={() => enroll(c.id)}>+ Enroll</button>
                                : <button className="sms-btn sms-btn-danger sms-btn-sm" onClick={() => del(c.id)}>🗑 Delete</button>}
                            </td>
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

export default Courses;
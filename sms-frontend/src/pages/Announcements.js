import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

function Announcements() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const isStudent = pathname.includes("/student");

  const load = () => API.get("/announcements").then(r => setList(r.data)).catch(console.log).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!title.trim() || !message.trim()) return alert("Fill in both fields.");
    try { await API.post("/announcements", { title, message }); setTitle(""); setMessage(""); load(); }
    catch (e) { alert(e.response?.data?.error || "Error posting announcement"); }
  };

  const SidebarComp = isStudent ? StudentSidebar : Sidebar;

  return (
    <div className="sms-layout">
      <SidebarComp />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">📢 Announcements</div>
            <div className="sms-page-sub">{isStudent ? "Stay up to date with institution notices" : "Post and manage announcements"}</div>
          </div>

          {!isStudent && (
            <div className="sms-card" style={{ marginBottom: 24 }}>
              <div className="sms-card-header"><span className="sms-card-title">✏️ New Announcement</span></div>
              <div className="sms-card-body">
                <div className="sms-form-row">
                  <div className="sms-form-group">
                    <label className="sms-label">Title</label>
                    <input className="sms-input" placeholder="Announcement title" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="sms-form-group" style={{ flex: 2 }}>
                    <label className="sms-label">Message</label>
                    <input className="sms-input" placeholder="Write your announcement..." value={message} onChange={e => setMessage(e.target.value)} />
                  </div>
                  <div style={{ alignSelf: "flex-end" }}>
                    <button className="sms-btn sms-btn-primary" onClick={post}>📢 Post</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="sms-card">
            <div className="sms-card-header">
              <span className="sms-card-title">All Announcements</span>
              <span className="sms-badge sms-badge-indigo">{list.length}</span>
            </div>
            <div className="sms-card-body">
              {loading ? <div className="sms-spinner" />
                : list.length === 0
                ? <div className="sms-empty"><div className="sms-empty-icon">📢</div><div className="sms-empty-text">No announcements yet</div></div>
                : list.map((a, i) => (
                  <div key={i} className="sms-announce-card">
                    <div className="sms-announce-title">{a.title}</div>
                    <div className="sms-announce-msg">{a.message}</div>
                    {a.createdDate && <div className="sms-announce-date">📅 {a.createdDate}</div>}
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Announcements;
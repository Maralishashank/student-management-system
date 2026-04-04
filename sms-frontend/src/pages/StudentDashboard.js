import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function StudentDashboard() {

  const navigate = useNavigate();

  // FIX: Was a fully static placeholder — three empty cards with no data and no links.
  //      Now fetches real data for marks, attendance, and announcements in parallel.
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [marksRes, attRes, annRes] = await Promise.all([
          API.get("/marks/my"),
          API.get("/attendance/my"),
          API.get("/announcements")
        ]);
        setMarks(marksRes.data);
        setAttendance(attRes.data);
        setAnnouncements(annRes.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgScore = marks.length === 0 ? null :
    Math.round(marks.reduce((sum, m) => sum + (m.score / m.maxScore) * 100, 0) / marks.length);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <StudentSidebar />
        <div className="container mt-4">

          <h2 className="mb-4">Student Dashboard</h2>

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <>
              <div className="row mb-4">

                <div className="col-md-4">
                  <div
                    className="card text-center p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/my-marks")}
                  >
                    <h5>My Marks</h5>
                    <h3>{avgScore !== null ? `${avgScore}%` : "—"}</h3>
                    <small className="text-muted">
                      {marks.length > 0 ? `${marks.length} subject(s)` : "No marks yet"}
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="card text-center p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/my-attendance")}
                  >
                    <h5>Attendance</h5>
                    <h3>{attendance ? `${attendance.percentage.toFixed(1)}%` : "—"}</h3>
                    <small className="text-muted">
                      {attendance
                        ? `${attendance.present} present / ${attendance.absent} absent`
                        : "No records"}
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div
                    className="card text-center p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/student/announcements")}
                  >
                    <h5>Announcements</h5>
                    <h3>{announcements.length}</h3>
                    <small className="text-muted">
                      {announcements.length > 0 ? "Click to view" : "No announcements"}
                    </small>
                  </div>
                </div>

              </div>

              {/* Recent announcements preview */}
              {announcements.length > 0 && (
                <div className="card p-3">
                  <h5 className="mb-3">Recent Announcements</h5>
                  {announcements.slice(0, 3).map((a, i) => (
                    <div key={i} className="border-bottom pb-2 mb-2">
                      <strong>{a.title}</strong>
                      <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>{a.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
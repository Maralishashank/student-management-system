import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyAttendance() {

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      const res = await API.get("/attendance/my");
      setAttendance(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <StudentSidebar />
        <div className="container mt-4">

          <h2>My Attendance</h2>

          {loading && <p className="text-muted">Loading...</p>}

          {!loading && !attendance && (
            <p className="text-muted">No attendance records found.</p>
          )}

          {attendance && (
            <div className="row mt-4">

              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h5>Present</h5>
                  <h3>{attendance.present}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h5>Absent</h5>
                  <h3>{attendance.absent}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h5>Percentage</h5>
                  {/* FIX: Raw double from backend (e.g. 33.333333333333336) was
                           displayed with full precision. toFixed(1) gives "33.3%". */}
                  <h3>{attendance.percentage.toFixed(1)}%</h3>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyAttendance;
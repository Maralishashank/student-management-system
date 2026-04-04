import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Attendance() {

  const [report, setReport] = useState({});
  const [department, setDepartment] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await API.get(`/attendance/report?date=${today}`);
      setReport(res.data);
    } catch (err) {
      console.log("Report error:", err.response?.data || err.message);
    }
  };

  const loadDepartmentReport = async () => {
    try {
      // FIX: Removed the stale ?date= query param. The backend's
      //      GET /attendance/department-report accepts no parameters —
      //      it was being ignored silently, but sending it was misleading.
      const res = await API.get("/attendance/department-report");
      setDepartment(res.data);
    } catch (err) {
      console.log("Department error:", err.response?.data || err.message);
    }
  };

  const loadAllAttendance = async () => {
    try {
      // FIX: Removed the stale ?date= query param. The backend's
      //      GET /attendance/all returns ALL records with no date filter.
      //      Passing the param was doing nothing but cluttering the request URL.
      const res = await API.get("/attendance/all");
      setAttendance(res.data);
    } catch (err) {
      console.log("All attendance error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    Promise.allSettled([
      loadReport(),
      loadDepartmentReport(),
      loadAllAttendance()
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">

          <h2>Attendance Report</h2>

          {loading && <p className="text-muted">Loading...</p>}

          {!loading && (
            <>
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h5>Total Students</h5>
                    <h3>{report.totalStudents ?? "—"}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h5>Present Today</h5>
                    <h3>{report.presentToday ?? "—"}</h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center p-3">
                    <h5>Absent Today</h5>
                    <h3>{report.absentToday ?? "—"}</h3>
                  </div>
                </div>
              </div>

              <h4>Department Attendance</h4>
              <table className="table table-bordered mb-4">
                <thead className="table-dark">
                  <tr>
                    <th>Department</th>
                    <th>Present Students</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>CSE</td><td>{department.CSE ?? "—"}</td></tr>
                  <tr><td>IT</td><td>{department.IT ?? "—"}</td></tr>
                  <tr><td>ECE</td><td>{department.ECE ?? "—"}</td></tr>
                </tbody>
              </table>

              <h4>All Students Attendance</h4>
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Student ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map(a => (
                    <tr key={a.id}>
                      <td>{a.studentId}</td>
                      <td>{a.date}</td>
                      <td>
                        <span className={`badge ${a.status === "PRESENT" ? "bg-success" : "bg-danger"}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Attendance;
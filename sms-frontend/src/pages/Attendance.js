import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Attendance(){

  const [report,setReport] = useState({});
  const [department,setDepartment] = useState({});
  const [attendance,setAttendance] = useState([]);
  

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
    const today = new Date().toISOString().split("T")[0];

    const res = await API.get(`/attendance/department-report?date=${today}`);

    setDepartment(res.data);
  } catch (err) {
    console.log("Department error:", err.response?.data || err.message);
  }
};

const loadAllAttendance = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const res = await API.get(`/attendance/all?date=${today}`);

    setAttendance(res.data);
  } catch (err) {
    console.log("All attendance error:", err.response?.data || err.message);
  }
};

  useEffect(()=>{

    loadReport();
    loadDepartmentReport();
    loadAllAttendance();

  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <Sidebar/>

        <div className="container mt-4">

          <h2>Attendance Report</h2>

          {/* Summary Cards */}

          <div className="row mb-4">

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Total Students</h5>
                <h3>{report.totalStudents}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Present Today</h5>
                <h3>{report.presentToday}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Absent Today</h5>
                <h3>{report.absentToday}</h3>
              </div>
            </div>

          </div>

          {/* Department Attendance */}

          <h4>Department Attendance</h4>

          <table className="table table-bordered mb-4">

            <thead className="table-dark">

              <tr>
                <th>Department</th>
                <th>Present Students</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>CSE</td>
                <td>{department.CSE}</td>
              </tr>

              <tr>
                <td>IT</td>
                <td>{department.IT}</td>
              </tr>

              <tr>
                <td>ECE</td>
                <td>{department.ECE}</td>
              </tr>

            </tbody>

          </table>

          {/* Full Attendance Table */}

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
                  <td>{a.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default Attendance;
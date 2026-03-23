import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyAttendance(){

  const [attendance,setAttendance] = useState(null);

  const loadAttendance = async () => {

    try{

      const res = await API.get("/attendance/my");

      setAttendance(res.data);

    }catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{
    loadAttendance();
  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <StudentSidebar/>

        <div className="container mt-4">

          <h2>My Attendance</h2>

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
                  <h3>{attendance.percentage}%</h3>
                </div>
              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  )

}

export default MyAttendance;
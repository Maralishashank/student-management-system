import { useEffect,useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MarkAttendance(){

  const [department,setDepartment] = useState("");
  const [students,setStudents] = useState([]);
  const [attendance,setAttendance] = useState({});

  const loadStudents = async () => {

    if(!department) return;

    const res = await API.get(`/students/department/${department}`);

    setStudents(res.data);

  }

  useEffect(()=>{
    loadStudents();
  },[department])

  const toggleAttendance = (id,status) => {

    setAttendance({
      ...attendance,
      [id]:status
    })

  }

  const submitAttendance = async () => {

    const today = new Date().toISOString().split("T")[0];

    for(const studentId in attendance){

      await API.post("/attendance/mark",{
        studentId,
        date:today,
        status:attendance[studentId]
      })

    }

    alert("Attendance marked");

  }

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <Sidebar/>

        <div className="container mt-4">

          <h2>Mark Attendance</h2>

          {/* Department Selector */}

          <select
          className="form-control mb-4"
          onChange={(e)=>setDepartment(e.target.value)}
          >

          <option>Select Department</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>

          </select>

          <table className="table table-bordered">

            <thead>

              <tr>
                <th>Name</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>

            </thead>

            <tbody>

              {students.map(s => (

                <tr key={s.id}>

                  <td>{s.name}</td>

                  <td>

                    <input
                    type="radio"
                    name={s.id}
                    onChange={()=>toggleAttendance(s.id,"PRESENT")}
                    />

                  </td>

                  <td>

                    <input
                    type="radio"
                    name={s.id}
                    onChange={()=>toggleAttendance(s.id,"ABSENT")}
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <button
          className="btn btn-primary"
          onClick={submitAttendance}
          >

          Submit Attendance

          </button>

        </div>

      </div>

    </div>

  )

}

export default MarkAttendance;
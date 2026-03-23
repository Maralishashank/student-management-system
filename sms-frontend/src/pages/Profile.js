import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function Profile(){

  const [student,setStudent] = useState({});

  const loadProfile = async () => {

    try{

      const res = await API.get("/students/me");

      setStudent(res.data);

    }catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{
    loadProfile();
  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <StudentSidebar/>

        <div className="container mt-4">

          <h2>My Profile</h2>

          <div className="card p-3">

            <p><b>Name:</b> {student.name}</p>
            <p><b>Email:</b> {student.email}</p>
            <p><b>Department:</b> {student.department}</p>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Profile;
import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCharts from "../components/DashboardCharts";

function AdminDashboard(){

  const [stats,setStats] = useState({
    students:0,
    courses:0,
    marks:0
  });

  const loadStats = async () => {

    try{

      const res = await API.get("/dashboard/stats");

      setStats(res.data);

    }catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{
    loadStats();
  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <Sidebar/>

        <div className="container mt-4">

          <h2>Admin Dashboard</h2>

          {/* Stats Cards */}

          <div className="row">

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Students</h5>
                <h3>{stats.students}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Courses</h5>
                <h3>{stats.courses}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Marks</h5>
                <h3>{stats.marks}</h3>
              </div>
            </div>

          </div>

          {/* Charts Section */}

          <div className="mt-5">
            <DashboardCharts/>
          </div>

        </div>

      </div>

    </div>

  )
}

export default AdminDashboard;
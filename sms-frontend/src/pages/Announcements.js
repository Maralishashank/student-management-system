import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";

function Announcements(){

  const [announcements,setAnnouncements] = useState([]);
  const [title,setTitle] = useState("");
  const [message,setMessage] = useState("");
  const location = useLocation();
  const isStudent = location.pathname.includes("/student");

  const loadAnnouncements = async () => {

    try{

      const res = await API.get("/announcements");

      setAnnouncements(res.data);

    }catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{

    loadAnnouncements();

  },[])

  const addAnnouncement = async () => {

    try{

      await API.post("/announcements",{
        title,
        message
      });

      setTitle("");
      setMessage("");

      loadAnnouncements();

    }catch(error){

      alert("Error creating announcement");

    }

  }

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        {isStudent ? <StudentSidebar/> : <Sidebar/>}

        <div className="container mt-4">

          <h2>Announcements</h2>
          {!isStudent && (

          <div className="card p-3 mb-4">

            <h5>Create Announcement</h5>

            <div className="row">

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                />
              </div>

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Message"
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)}
                />
              </div>

              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={addAnnouncement}
                >
                  Post
                </button>
              </div>

            </div>

          </div>
          )}

          <table className="table table-bordered">

            <thead className="table-dark">

              <tr>

                <th>Title</th>
                <th>Message</th>

              </tr>

            </thead>

            <tbody>

              {announcements.map((a,i)=>(

                <tr key={i}>

                  <td>{a.title}</td>
                  <td>{a.message}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default Announcements;
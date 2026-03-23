import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyMarks(){

  const [marks,setMarks] = useState([]);

  const loadMarks = async () => {

    try{

      const res = await API.get("/marks/my");

      setMarks(res.data);

    }catch(error){

      console.log(error);

    }

  }

  useEffect(()=>{
    loadMarks();
  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <StudentSidebar/>

        <div className="container mt-4">

          <h2>My Marks</h2>

          <table className="table table-bordered">

            <thead className="table-dark">

              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Max Score</th>
              </tr>

            </thead>

            <tbody>

              {marks.map((m,i)=>(

                <tr key={i}>

                  <td>{m.subject}</td>
                  <td>{m.score}</td>
                  <td>{m.maxScore}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default MyMarks;
import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Marks(){

  const [marks,setMarks] = useState([]);

  const [studentId,setStudentId] = useState("");
  const [subject,setSubject] = useState("");
  const [score,setScore] = useState("");
  const [maxScore,setMaxScore] = useState("");
  const [students,setStudents] = useState([]);
  const [subjects,setSubjects] = useState([]);

  const loadMarks = async () => {

    try{

      const res = await API.get("/marks")

      setMarks(res.data);

    }catch(error){

      console.log(error);

    }
    

  }
  const loadStudents = async () => {

  try{

    const res = await API.get("/students");

    setStudents(res.data.content);

  }catch(error){

    console.log(error);

  }

}

  useEffect(()=>{

  loadMarks();
  loadStudents();

},[])

  const addMarks = async () => {

    try{

      await API.post("/marks",{
        studentId,
        subject,
        score,
        maxScore
      })
      loadMarks();

      alert("Marks added");

      setStudentId("")
      setSubject("")
      setScore("")
      setMaxScore("")

    }catch(error){

      alert("Error adding marks")

    }

  }


  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <Sidebar/>

        <div className="container mt-4">

          <h2>Marks</h2>

          <div className="card p-3 mb-4">

            <h5>Add Marks</h5>

            <div className="row">

              <div className="col">
                <select
  className="form-control"
  value={studentId}
 
onChange={async (e) => {

  const id = e.target.value;
  setStudentId(id);
  setSubject("");
  setSubjects([]);

  const student = students.find(s => s.id === id); // ✅ FIX (==)

  if(student){
    try{
      const res = await API.get(`/subjects/department/${student.department}`);
      setSubjects(res.data);
    }catch(err){
      console.log(err);
    }
  }

}}
>

<option value="">Select Student</option>

{students.map((s)=>(
  <option key={s.id} value={s.id}>
    {s.name} ({s.department})
  </option>
))}

</select>
              </div>

              <div className="col">
               <select
  className="form-control"
  value={subject}
  onChange={(e)=>setSubject(e.target.value)}
>

<option value="">Select Subject</option>

{subjects.map((sub,i)=>(
  <option key={i} value={sub}>
    {sub}
  </option>
))}

</select>
              </div>

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Score"
                  value={score}
                  onChange={(e)=>setScore(e.target.value)}
                />
              </div>

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Max Score"
                  value={maxScore}
                  onChange={(e)=>setMaxScore(e.target.value)}
                />
              </div>

              <div className="col">
                <button
                  className="btn btn-primary"
                  onClick={addMarks}
                >
                  Add
                </button>
              </div>

            </div>

          </div>

          <table className="table table-bordered">

            <thead className="table-dark">

              <tr>

                <th>Student ID</th>
<th>Subject</th>
<th>Score</th>
<th>Max Score</th>

              </tr>

            </thead>

            <tbody>

              {marks.map((m,i)=>(

                <tr key={i}>

                  <td>{m.studentId}</td>
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

export default Marks;
import { useEffect, useState } from "react";
import API from "../services/api";

import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function DashboardCharts() {

const [chartData,setChartData] = useState([]);

useEffect(() => {

  API.get("/students/department-count")
    .then(res => {
      console.log("chart data:", res.data);

      setChartData([
        res.data?.CSE || 0,
        res.data?.IT || 0,
        res.data?.ECE || 0
      ]);
    })
    .catch(err => {
      console.log("chart error:", err.response?.data || err.message);
      setChartData([0,0,0]);
    });

}, []);

const data = {

labels:["CSE","IT","ECE"],

datasets:[
{
label:"Students",
data:chartData,
backgroundColor:["#4e73df","#1cc88a","#36b9cc"]
}
]

};

return(

<div className="mt-4">

<h4>Students per Department</h4>

<Bar data={data}/>

</div>

)

}

export default DashboardCharts;
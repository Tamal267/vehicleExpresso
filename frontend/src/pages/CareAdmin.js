import '../styles/admin.css';
import '../styles/chart.css'
import { useState } from 'react';
import useFetchData from '../context/useFetchData';
import DoughnutChart from '../components/DhoughnutChart';
import LineChart from '../components/LineChart';
import Records from '../components/Records';

const CareAdmin = () => {
    const [url,seturl] = useState('');
    const {error,data}=useFetchData(url);

    return ( 
        <div className='admin'>
            <h2>Admin DashBoard (Care & Maintenance)</h2>
            <div className='chart-comps'>
              <LineChart/>
              <DoughnutChart/>
            </div>
            <div className="buttons">
                {/* <button onClick={HandleLongTerm}>{Features[0]}</button> */}
            </div>
            {/* <div className='print'>
                {!error && Array.isArray(data) && data.map((row,i)=>(
                    <div key={i}>
                    {row.length>0 && row.map((cell,j)=>(
                        <h4 key={j}>{cell}</h4>
                    ))}
                </div>))}
            </div> */}
            <br></br>
            <br></br>
            <br></br>
            <div>
              <h3>Shortterm Record (Pending....)</h3>
              <Records/>
            </div>
        </div>
     );
}
 
export default CareAdmin;
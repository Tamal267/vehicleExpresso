import React from 'react'
import DoughnutChart from '../components/DhoughnutChart'
import LineChart from '../components/LineChart'
import LongRecord from '../components/LongRecord'
import ShortRecord from '../components/ShortRecord'
import '../styles/admin.css'
import '../styles/chart.css'

const CareAdmin = () => {
  return (
    <div className="admin">
      <h2>Admin DashBoard (Care & Maintenance)</h2>
      <hr />
      <div className="chart-comps">
        <LineChart />
        <DoughnutChart />
      </div>
      <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h2>Shorterm Record </h2>
        <hr />
        <ShortRecord />
      </div>
      <h2>Longterm Record (MAINTENANCE INFO)</h2>
      <hr />
      <LongRecord />
    </div>
  )
}

export default CareAdmin

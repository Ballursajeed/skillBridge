import { useState, useEffect } from 'react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import api from '../api/axios'
import { useNavigate } from "react-router-dom"

export default function ProgrammeManagerDashboard({ user }) {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate() 

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = await getToken()
        const res = await api.get('/programme/summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSummary(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Programme Manager Dashboard</h2>
        <button onClick={() => signOut()}>Logout</button>
      </div>
      <div style={{ display: 'flex' }}>

             <div style={{ width: 250, borderRight: '1px solid #ddd', padding: 16 }}>
    <h4>Institutions</h4>

    {summary.map(inst => (
      <div key={inst.institution_id} style={{ padding: 8, cursor: "pointer", }} onClick={() => navigate(`/institution/${inst.institution_id}`)}>
        {inst.institution_name}
      </div>
    ))}
  </div>
  <div>
    <h3>Global Attendance Overview</h3>
      <p style={{ color: '#666' }}>Aggregated across all institutions</p>
      {summary.length === 0 && <p>No data available.</p>}
      {summary.map(item => (
        <div key={item.institution_id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h4>{item.institution_name}</h4>
          <p>Present: {item.present} | Absent: {item.absent} | Late: {item.late}</p>
        </div>
      ))}
  </div>
      </div>
     
      
    </div>
  )
}
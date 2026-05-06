import { useState, useEffect } from 'react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import api from '../api/axios'

export default function MonitoringOfficerDashboard({ user }) {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

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
        <h2>Monitoring Officer Dashboard</h2>
        <button onClick={() => signOut()}>Logout</button>
      </div>
      <h3>Programme-Wide Attendance</h3>
      {summary.length === 0 && <p>No data available.</p>}
      {summary.map(item => (
        <div key={item.institution_id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h4>{item.institution_name}</h4>
          <p>Present: {item.present} | Absent: {item.absent} | Late: {item.late}</p>
        </div>
      ))}
    </div>
  )
}
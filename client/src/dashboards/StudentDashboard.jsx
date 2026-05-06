import { useState, useEffect } from 'react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import axios from 'axios'

export default function StudentDashboard({ user }) {
  const { getToken } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [markedSessions, setMarkedSessions] = useState({})
   const { signOut } = useClerk()
  

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = await getToken()
        const res = await axios.get('http://localhost:5000/sessions/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSessions(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

 const markAttendance = async (session_id, status) => {
  try {
    const token = await getToken()

    const res = await axios.post(
      'http://localhost:5000/attendance/mark',
      { session_id, status },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if(!res.data.success){
      alert(res.data.message);
      return;
    }

    // update UI state
    setMarkedSessions(prev => ({
      ...prev,
      [session_id]: status
    }))
    alert("attendance Marked!")

  } catch (err) {
    alert('Error marking attendance')
  }
}

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>Welcome, {user.name}</h2>
      <button onClick={() => signOut()}>Logout</button>
      <h3>Your Sessions</h3>
      {sessions.length === 0 && <p>No sessions found.</p>}
      {sessions.map(session => {
  const marked = markedSessions[session.id]

  return (
    <div key={session.id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16, borderRadius: 8 }}>
      <h4>{session.title}</h4>
      <p>Date: {session.date}</p>
      <p>Time: {session.start_time} - {session.end_time}</p>

      {marked ? (
        <p><strong>Marked: {marked}</strong></p>
      ) : (
        <>
          <button
            onClick={() => markAttendance(session.id, 'present')}
            style={{ marginRight: 8 }}
          >
            Present
          </button>

          <button
            onClick={() => markAttendance(session.id, 'late')}
            style={{ marginRight: 8 }}
          >
            Late
          </button>

          <button
            onClick={() => markAttendance(session.id, 'absent')}
          >
            Absent
          </button>
        </>
      )}
    </div>
  )
})}
      
    </div>
  )
}
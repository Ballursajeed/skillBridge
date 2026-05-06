import { useState, useEffect } from 'react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import api from '../api/axios'
import { useSearchParams, useParams } from "react-router-dom"  


export default function StudentDashboard({ user }) {
  const { getToken } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [markedSessions, setMarkedSessions] = useState({})

  const { id: batchId } = useParams()
const [searchParams] = useSearchParams()
  
   const { signOut } = useClerk()
  

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = await getToken()
        const res = await api.get('/sessions/my', {
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

  useEffect(() => {
  const handleAutoJoin = async () => {
    try {
      const token = searchParams.get("token")

      if (!batchId || !token) return

      const authToken = await getToken()

      await api.post(
        `/batches/${batchId}/join`,
        { token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      console.log("Joined successfully")

      // clean URL so it doesn't repeat
      window.history.replaceState({}, "", "/")

    } catch (err) {
      console.log("Join failed or already joined")
    }
  }

  handleAutoJoin()
}, [])

 const markAttendance = async (session_id, status) => {
  try {
    const token = await getToken()

    const res = await api.post(
      '/attendance/mark',
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
      <h2>Welcome, {user?.name}</h2>
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
import { useState, useEffect } from 'react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import api from '../api/axios'

export default function TrainerDashboard({ user }) {
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const [sessions, setSessions] = useState([])
  const [batches, setBatches] = useState([])
  const [attendance, setAttendance] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '', date: '', start_time: '', end_time: '', batch_id: ''
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [sessionsRes, batchesRes] = await Promise.all([
        api.get('/sessions/my', { headers }),
        api.get('/batches/my', { headers }),
      ])
      setSessions(sessionsRes.data)
      setBatches(batchesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  console.log("use,: ",user)

  const createSession = async () => {
    try {
      const token = await getToken()
      await api.post('/sessions', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Session created!')
      setForm({ title: '', date: '', start_time: '', end_time: '', batch_id: '' })
      fetchAll()
    } catch (err) {
      alert('Error creating session')
    }
  }

  const viewAttendance = async (session) => {
    try {
      const token = await getToken()
      const res = await api.get(`/sessions/${session?.id}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAttendance(res.data?.result)
      setSelectedSession(session?.title)
    } catch (err) {
      alert('Error fetching attendance')
    }
  }

 const generateInvite = async (batchId) => {
  try {
    const token = await getToken()

    const res = await api.post(
      `/batches/${batchId}/invite`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    return `${window.location.origin}${res.data.link}`

  } catch (err) {
    alert('Error generating invite')
  }
}

  if (loading) return <div>Loading...</div>

  function BatchCard({ batch, generateInvite }) {
  const [link, setLink] = useState("")

  const handleInvite = async () => {
    const res = await generateInvite(batch.id)
    setLink(res)
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{batch.name}</strong>

      <div>
        <button onClick={handleInvite}>Generate Invite</button>
      </div>

      {link && (
        <p style={{ fontSize: 12, wordBreak: "break-all" }}>
          {link}
        </p>
      )}
    </div>
  )
}


  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>

    {/* HEADER */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
      <h2>Trainer Dashboard: {user.name}</h2>
      <button onClick={signOut}>Logout</button>
    </div>

    {/* CREATE SESSION */}
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 20 }}>
      <h3>Create Session</h3>

      {batches.length === 0 ? (
        <p>No batches assigned yet.</p>
      ) : (
        <>
          <input placeholder="Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8 }} />

          <select value={form.batch_id}
            onChange={e => setForm({ ...form, batch_id: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}>
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <input type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ width: '100%', padding: 8, marginBottom: 8 }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <input type="time" value={form.start_time}
              onChange={e => setForm({ ...form, start_time: e.target.value })}
              style={{ flex: 1, padding: 8 }} />

            <input type="time" value={form.end_time}
              onChange={e => setForm({ ...form, end_time: e.target.value })}
              style={{ flex: 1, padding: 8 }} />
          </div>

          <button onClick={createSession}
            disabled={!form.title || !form.batch_id || !form.date}
            style={{ marginTop: 10 }}>
            Create Session
          </button>
        </>
      )}
    </div>

    {/* BATCHES + SESSIONS */}
    <div style={{ display: 'flex', gap: 20 }}>

      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>

        {/* BATCHES */}
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <h3>Your Batches</h3>

          {batches.map(batch => (
            <BatchCard key={batch.id} batch={batch} generateInvite={generateInvite} />
          ))}
        </div>

        {/* SESSIONS */}
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
          <h3>Your Sessions</h3>

          {sessions.map(session => (
            <div key={session.id}
              style={{ borderBottom: '1px solid #eee', padding: 10 }}>
              
              <strong>{session.title}</strong>
              <p style={{ fontSize: 12 }}>
                {session.date} | {session.start_time} - {session.end_time}
              </p>

              <button onClick={() => viewAttendance(session)}>
                View Attendance
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT SIDE (Attendance Panel) */}
      <div style={{ width: 300 }}>
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
          <h3>Attendance</h3>

          {!selectedSession && <p>Select a session</p>}

          {
            selectedSession &&  <div>
            session: <strong>{selectedSession}</strong> <br></br>

         </div>
          }

        
          {attendance.map(a => (
            <>
            
            <div key={a.id} style={{ borderBottom: '1px solid #eee', padding: 6 }}>
             
              {a.student_name} — {a.status}
            </div>
            </>
             
          ))}
        </div>
      </div>

    </div>
  </div>
  )
}
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { Routes, Route, Navigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useAuth,useUser } from '@clerk/clerk-react'
import api from './api/axios'

import StudentDashboard from './dashboards/StudentDashboard'
import TrainerDashboard from './dashboards/TrainerDashboard'
import InstitutionDashboard from './dashboards/InstitutionDashboard'
import ProgrammeManagerDashboard from './dashboards/ProgrammeManagerDashboard'
import MonitoringOfficerDashboard from './dashboards/MonitoringOfficerDashboard'
import CreateBatch from './pages/CreateBatch'
import BatchDetails from './components/BatchDetails'
import InstitutionDetails from './components/InstitutionDetails'

 function RoleSetup() {
  const { getToken } = useAuth()
  const { user } = useUser()

  console.log(user);

  const [role, setRole] = useState("")

  const saveRole = async () => {
    const token = await getToken()

    console.log("here"); //yes can see
    

   const res =  await api.post(
      "/auth/register",
      {
        role,
        name: user.username   // 👈 from Clerk
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Response: ",res); // no logs in browser

    window.location.href = "/"
  }

  return (
    <div>
      <h2>Welcome {user?.fullName}</h2>

      <h3>Select Role</h3>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select</option>
        <option value="student">Student</option>
        <option value="trainer">Trainer</option>
        <option value="institution">Institution</option>
        <option value="programme_manager">Program Manager</option>
        <option value="monitoring_officer">Monitoring Officer</option>
      </select>

      <button onClick={saveRole} disabled={!role}>
        Continue
      </button>
    </div>
  )
}

function DashboardRouter() {
  const { getToken } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
  try {
    const token = await getToken()

    const res = await api.get(`/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    setUser(res.data)
  } catch (err) {
    // user not registered in DB yet
    setUser(null)
  } finally {
    setLoading(false)
  }
}

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/setup-role" />

  switch (user.role) {
    case 'student': return <StudentDashboard user={user} />
    case 'trainer': return <TrainerDashboard user={user} />
    case 'institution': return <InstitutionDashboard user={user} />
    case 'programme_manager': return <ProgrammeManagerDashboard user={user} />
    case 'monitoring_officer': return <MonitoringOfficerDashboard user={user} />
  }
}
export default function App() {
  return (
    <>
      <SignedIn>
        <Routes>
         <Route path="/setup-role" element={<RoleSetup />} />
         <Route path="/*" element={<DashboardRouter />} />
         <Route path="/batches/:id" element={<BatchDetails />} />
         <Route path="/batches/:id/join" element={<StudentDashboard />} />
         <Route path="/institution/:id" element={<InstitutionDetails />} />
         <Route path="/create-batch" element={<CreateBatch />} />
        </Routes>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
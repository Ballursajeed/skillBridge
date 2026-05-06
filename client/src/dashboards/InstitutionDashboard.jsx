import { useState, useEffect } from "react"
import { useAuth, useClerk } from "@clerk/clerk-react"
import api from "../api/axios"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import TrainersView from "../components/TrainersView"
import SummaryView from "../components/SummaryView"

export default function InstitutionDashboard({ user }) {
  const { getToken } = useAuth()
  const { signOut } = useClerk()

  const [summary, setSummary] = useState([])
  const [trainers, setTrainers] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("trainers")

  const [assignForm, setAssignForm] = useState({
    batch_id: "",
    trainer_id: ""
  })

  useEffect(() => {
    fetchAll()
  }, [])

  console.log(user)

  const fetchAll = async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }

      const summaryRes = await api.get(
        `/institutions/${user.institution_id}/summary`,
        { headers }
      )

      setSummary(summaryRes.data)

      setBatches(
        summaryRes.data.map(b => ({
          id: b.batch_id,
          name: b.batch_name
        }))
      )

      const trainersRes = await api.get(
        `/institutions/${user.institution_id}/trainers`,
        { headers }
      )

      setTrainers(trainersRes.data.trainers)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const assignTrainer = async () => {
    const token = await getToken()

    await api.post(
      `/batches/${assignForm.batch_id}/assign-trainer`,
      { trainer_id: assignForm.trainer_id },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert("Trainer assigned")

    setAssignForm({ batch_id: "", trainer_id: "" })
    fetchAll()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAVBAR */}
      <Navbar signOut={signOut} user={user} />

      <div style={{ display: "flex", flex: 1 }}>

        {/* SIDEBAR */}
        <Sidebar batches={batches} />

        {/* MAIN AREA */}
        <div style={{ flex: 1, padding: "20px" }}>

          {/* TAB SWITCH */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setActiveTab("trainers")}>
              My Trainers
            </button>
            <button onClick={() => setActiveTab("summary")}>
              Attendance Summary
            </button>
          </div>

          {/* CONTENT */}
          {activeTab === "trainers" && (
            <TrainersView trainers={trainers} />
          )}

          {activeTab === "summary" && (
            <SummaryView summary={summary} />
          )}

          {trainers.length > 0 && batches.length > 0 && <>
             <div style={{
            marginTop: 30,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 10
          }}>
            <h3>Assign Trainer to Batch</h3>

            {/* batch select */}
            <select
              value={assignForm.batch_id}
              onChange={(e) =>
                setAssignForm({ ...assignForm, batch_id: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* trainer select */}
            <select
              value={assignForm.trainer_id}
              onChange={(e) =>
                setAssignForm({ ...assignForm, trainer_id: e.target.value })
              }
              style={{ display: "block", marginBottom: 10, padding: 8, width: "100%" }}
            >
              <option value="">Select Trainer</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={assignTrainer}
              disabled={!assignForm.batch_id || !assignForm.trainer_id}
            >
              Assign Trainer
            </button>
          </div>
          </>}
         

        </div>
      </div>
    </div>
  )
}
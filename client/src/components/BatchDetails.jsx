import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "@clerk/clerk-react"

export default function BatchDetails() {
  const { id } = useParams()
  const { getToken } = useAuth()

  const [data, setData] = useState(null);
  const [students,setStudents] = useState([])
  const [trainer,setTrainers] = useState([]);

  useEffect(() => {
    fetchBatch()
    fetchTrainers()
    fetchStudents()
  }, [])

  const fetchTrainers = async () => {
    const token = await getToken()

    const res = await api.get(
      `/batches/${id}/trainers`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setTrainers(res.data?.trainers)
  }

  const fetchStudents = async () => {
    const token = await getToken()

    const res = await api.get(
      `/batches/${id}/students`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setStudents(res.data?.students)
  }

   const fetchBatch = async () => {
    const token = await getToken()

    const res = await api.get(
      `/batches/${id}/summary`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    setData(res.data)
  }

  if (!data) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>{data.batch_name}</h2>

      <p>Trainers: {trainer.length || "no trainers yet"}</p>
      <p>Students: {students.length || "No Students yet"}</p>

      <h3>Attendance</h3>
      <p>
        Present: {data.present} | Absent: {data.absent} | Late: {data.late}
      </p>
    </div>
  )
}
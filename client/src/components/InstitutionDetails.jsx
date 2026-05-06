import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

const InstitutionDetails = () => {

    const { id } = useParams()
    const { getToken } = useAuth()

    const [summary, setSummary] = useState([])
    const [loading, setLoading] = useState(true);

     useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = await getToken()
        const res = await axios.get('http://localhost:5000/programme/summary', {
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

  console.log(summary)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {summary.map(item => (
        <div key={item.institution_id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h4>{item.institution_name}</h4>
          <p>Present: {item.present} | Absent: {item.absent} | Late: {item.late}</p>
        </div>
      ))}
    </div>
  )
}

export default InstitutionDetails
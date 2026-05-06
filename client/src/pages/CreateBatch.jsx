import { useState } from "react"
import { useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function CreateBatch() {
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const createBatch = async () => {
    if (!name.trim()) return

    try {
      setLoading(true)

      const token = await getToken()

      await axios.post(
        "http://localhost:5000/batches",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      navigate("/") // go back to dashboard

    } catch (err) {
      console.error(err)
      alert("Error creating batch")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "400px",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}>
        <h2>Create Batch</h2>

        <input
          placeholder="Enter batch name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            marginBottom: "15px"
          }}
        />

        <button
          onClick={createBatch}
          disabled={!name || loading}
          style={{ width: "100%", padding: "10px" }}
        >
          {loading ? "Creating..." : "Create Batch"}
        </button>
      </div>
    </div>
  )
}
import { useNavigate } from "react-router-dom"

export default function Navbar({ signOut,user }) {
  const navigate = useNavigate()

  return (
    <div style={{
      height: "60px",
      background: "#111",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px"
    }}>
      <h3>Dashboard of {user.name} Institution</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/create-batch")}>
          Create Batch
        </button>
        <button onClick={signOut}>Logout</button>
      </div>
    </div>
  )
}
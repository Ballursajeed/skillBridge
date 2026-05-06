import { useNavigate } from "react-router-dom"


export default function Sidebar({ batches }) {

  const navigate = useNavigate()


  return (
    <div style={{
      width: "250px",
      borderRight: "1px solid #ddd",
      padding: "10px",
      background: "#f9f9f9"
    }}>
      <h4>Batches</h4>

      {batches.map(batch => (
        <div
          key={batch.id}
          style={{
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "5px"
          }}
          onClick={() => navigate(`/batches/${batch.id}`)}

        >
           {batch.name}
        </div>
      ))}
    </div>
  )
}
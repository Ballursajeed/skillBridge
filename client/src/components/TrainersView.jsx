export default function TrainersView({ trainers }) {
  if (trainers.length === 0) return <p>No trainers yet.</p>

  return (
    <div>
      {trainers.map(trainer => (
        <div key={trainer.id} style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}>
          <strong>{trainer.name}</strong>
          <p style={{ fontSize: "12px" }}>ID: {trainer.id}</p>
        </div>
      ))}
    </div>
  )
}
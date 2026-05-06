export default function SummaryView({ summary }) {
  if (summary.length === 0) return <p>No data available.</p>

  return (
    <div>
      {summary.map(item => (
        <div key={item.batch_id} style={{
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "15px"
        }}>
          <h4>{item.batch_name}</h4>
          <p>
            Present: {item.present} | 
            Absent: {item.absent} | 
            Late: {item.late}
          </p>
        </div>
      ))}
    </div>
  )
}
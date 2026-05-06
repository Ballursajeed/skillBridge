import { sql } from "../db.js";

export const getProgrammeSummary = async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        i.id AS institution_id, i.name AS institution_name,
        COUNT(a.id) FILTER (WHERE a.status = 'present') AS present,
        COUNT(a.id) FILTER (WHERE a.status = 'absent') AS absent,
        COUNT(a.id) FILTER (WHERE a.status = 'late') AS late
      FROM institutions i
      LEFT JOIN batches b ON b.institution_id = i.id
      LEFT JOIN sessions s ON s.batch_id = b.id
      LEFT JOIN attendance a ON a.session_id = s.id
      GROUP BY i.id, i.name
    `;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
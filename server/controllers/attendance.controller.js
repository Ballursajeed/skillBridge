import { sql } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const markAttendance = async (req, res) => {
  try {
    const { session_id, status } = req.body
    const student_id = req.user.id

    // check if already marked
    const existing = await sql`
      SELECT id FROM attendance
      WHERE session_id = ${session_id}
      AND student_id = ${student_id}
    `

    if (existing.length > 0) {
      return res.json({
        message: "Attendance already marked",
        success: false
      })
    }

    // insert
    await sql`
      INSERT INTO attendance 
      (id, session_id, student_id, status, marked_at)
      VALUES (${uuidv4()}, ${session_id}, ${student_id}, ${status}, NOW())
    `

    res.json({ success: true })

  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      success: false
    })
  }
}
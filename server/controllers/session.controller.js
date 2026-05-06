import { sql } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const createSession = async (req, res) => {
  try {
    const { batch_id, title, date, start_time, end_time } = req.body;

    if(!batch_id || !title || !date || !start_time || !end_time){
     return  res.status(400).json({
        message:"All fields are required!",
        success:false
      })
    }

    const batch =  await sql`
      SELECT * FROM batches where id = ${batch_id}
    `;

    if(!batch){
     return res.json({
        message:"Batch not Found!",
        success:false
      })
    }

    const id = uuidv4();

    await sql`
      INSERT INTO sessions 
      (id, batch_id, trainer_id, title, date, start_time, end_time)
      VALUES (${id}, ${batch_id}, ${req.user.id}, ${title}, ${date}, ${start_time}, ${end_time})
    `;

    res.json({ id });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
};

export const getMyBatchSessions = async (req, res) => {
  try {
    if (req.user.role === 'trainer') {
      const result = await sql`
        SELECT * FROM sessions WHERE trainer_id = ${req.user.id}
      `;
      return res.json(result);
    }

    // student
    const result = await sql`
      SELECT s.* FROM sessions s
      JOIN batch_students bs ON bs.batch_id = s.batch_id
      WHERE bs.student_id = ${req.user.id}
    `;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSessionAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
      SELECT 
        a.id,
        a.status,
        a.marked_at,
        u.id AS student_id,
        u.name AS student_name
      FROM attendance a
      JOIN users u ON u.id = a.student_id
      WHERE a.session_id = ${id}
    `;

   console.log(result)

    return res.status(200).json({
      message: "Attendance fetched successfully!",
      success: true,
      result
    });

  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
};

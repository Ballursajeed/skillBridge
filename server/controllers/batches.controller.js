import { sql } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const createBatche = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "batch name is required!", success: false });
    }

    const id = uuidv4();

    await sql`
      INSERT INTO batches (id, name, institution_id) 
      VALUES (${id}, ${name}, ${req.user.institution_id})
    `;

    res.json({ id, name });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const generateInvite = async (req, res) => {
  const token = uuidv4();

  await sql`
    INSERT INTO invites (id, batch_id, token) 
    VALUES (${uuidv4()}, ${req.params.id}, ${token})
  `;

  res.json({
    link: `/batches/${req.params.id}/join?token=${token}`,
  });
};

export const joinBatch = async (req, res) => {
  const { token } = req.body;

  const invite = await sql`SELECT * FROM invites WHERE token = ${token}`;

  if (!invite.length) {
    return res.status(400).json({ error: "Invalid token" });
  }

  if (invite[0].batch_id !== req.params.id) {
    return res.status(400).json({ error: "Invalid batch" });
  }

  await sql`
    INSERT INTO batch_students (batch_id, student_id) 
    VALUES (${req.params.id}, ${req.user.id})
  `;

  res.json({ success: true });
};

export const assignTrainer = async (req, res) => {
  try {
    const { trainer_id } = req.body;
    const { id } = req.params;

    await sql`
      INSERT INTO batch_trainers (batch_id, trainer_id)
      VALUES (${id}, ${trainer_id})
    `;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBatchSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'present') AS present,
        COUNT(*) FILTER (WHERE status = 'absent') AS absent,
        COUNT(*) FILTER (WHERE status = 'late') AS late
      FROM attendance a
      JOIN sessions s ON a.session_id = s.id
      WHERE s.batch_id = ${id}
    `;

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyBatches = async (req, res) => {
  try {
    const result = await sql`
      SELECT b.* FROM batches b
      JOIN batch_trainers bt ON bt.batch_id = b.id
      WHERE bt.trainer_id = ${req.user.id}
    `;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBatchTrainers = async(req,res) => {
  try {
    
    const { id } = req.params;

    const trainers = await sql `
     SELECT * FROM batch_trainers WHERE batch_id=${id}
    `;


    return res.status(200).json({
      message:"trainers fetched successfully!",
      success:true,
      trainers
    })

  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}

export const getBatchStudents = async(req,res) => {
  try {
    
    const { id } = req.params;

    const students = await sql `
     SELECT * FROM batch_students WHERE batch_id=${id}
    `;

    console.log("students: ",students)

    return res.status(200).json({
      message:"students fetched successfully!",
      success:true,
      students
    })

  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}
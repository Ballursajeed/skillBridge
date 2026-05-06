import { sql } from "../db.js";

export const getInstitutionSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
      SELECT 
        b.id AS batch_id, b.name AS batch_name,
        COUNT(*) FILTER (WHERE a.status = 'present') AS present,
        COUNT(*) FILTER (WHERE a.status = 'absent') AS absent,
        COUNT(*) FILTER (WHERE a.status = 'late') AS late
      FROM batches b
      LEFT JOIN sessions s ON s.batch_id = b.id
      LEFT JOIN attendance a ON a.session_id = s.id
      WHERE b.institution_id = ${id}
      GROUP BY b.id, b.name
    `;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrainers = async (req, res) => {
  try {
    const { id } = req.params;


    const institution = await sql`SELECT * FROM institutions WHERE id = ${id}`;

    console.log("institute: ",institution)

    if (institution.length === 0 || !institution.length) {
      return res.status(404).json({ message: "Institution not found!", success: false });
    }

    const trainers = await sql`
     SELECT id, name, role
FROM users
WHERE role = 'trainer'
AND institution_id = ${id};
    `;

    console.log("trainers: ",trainers);

    if(trainers.length === 0 || !trainers.length){
    console.log("insided baby: ");

        return res.status(404).json({ message: "trainers not found!", success: false });
    }

    return res.status(200).json({
      message: "Trainers fetched successfully",
      success: true,
      trainers
    });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", success: false });
  }
};
import { sql } from "../db.js";
import { getAuth } from "@clerk/express";

export const registerUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const { userId } = getAuth(req);

    const existing = await sql`
      SELECT * FROM users WHERE clerk_user_id = ${userId}
    `;

    if (existing.length) {
      return res.json(existing[0]);
    }

    let institution_id = null;
    let id = userId;

    if (role === 'institution') {
      const institution = await sql`
        INSERT INTO institutions (name)
        VALUES (${name})
        RETURNING *
      `;
      institution_id = institution[0].id;
    }

    const result = await sql`
      INSERT INTO users (clerk_user_id, name, role, institution_id)
      VALUES (${userId}, ${name}, ${role}, ${institution_id})
      RETURNING *
    `;

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
    const newStudent_lesson = await pool.query(
      `
        INSERT INTO "student_lesson" (
        lesson_id,
        student_id,
        is_there,
        reason,
        be_paid)
        values ($1, $2, $3, $4, $5) RETURNING *
        `,
      [lesson_id, student_id, is_there, reason, be_paid]
    );

    res.status(201).send(newStudent_lesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(
      `SELECT * FROM "student_lesson" LIMIT $1 OFFSET $2`,
      [limit, (offset - 1) * limit]
    );

    res.status(200).send(data.rows);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await pool.query(
      `SELECT * FROM "student_lesson" WHERE id=$1`,
      [id]
    );

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Student_lesson not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
  try {
    const data = await pool.query(
      `UPDATE "student_lesson" SET lesson_id=$1, student_id=$2, is_there=$3, reason=$4, be_paid=$5 WHERE id=$6 RETURNING *`,
      [lesson_id, student_id, is_there, reason, be_paid, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Student_lesson not found" });
    }
    res
      .status(200)
      .send({ message: "Updated successfully", data: data.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await pool.query(
      `DELETE FROM "student_lesson" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Student_lesson not found" });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully", data: data.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};

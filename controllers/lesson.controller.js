const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { lesson_theme, lesson_number, group_id, lesson_date } = req.body;
    const newLesson = await pool.query(
      `
        INSERT INTO "lesson" (
        lesson_theme,
        lesson_number,
        group_id,
        lesson_date)
        values ($1, $2, $3, $4) RETURNING *
        `,
      [lesson_theme, lesson_number, group_id, lesson_date]
    );

    res.status(201).send(newLesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM "lesson" LIMIT $1 OFFSET $2`, [
      limit,
      (offset - 1) * limit,
    ]);

    res.status(200).send(data.rows);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await pool.query(`SELECT * FROM "lesson" WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Lesson not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { lesson_theme, lesson_number, group_id, lesson_date } = req.body;
  try {
    const data = await pool.query(
      `UPDATE "lesson" SET lesson_theme=$1, lesson_number=$2, group_id=$3, lesson_date=$4 WHERE id=$5 RETURNING *`,
      [lesson_theme, lesson_number, group_id, lesson_date, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Lesson not found" });
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
      `DELETE FROM "lesson" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Lesson not found" });
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

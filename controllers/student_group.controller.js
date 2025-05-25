const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { student_id, group_id } = req.body;
    const newstudent_group = await pool.query(
      `
        INSERT INTO "student_group" ( student_id, group_id )
        values ($1, $2) RETURNING *
        `,
      [student_id, group_id]
    );

    res.status(201).send(newstudent_group.rows[0]);
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
      `SELECT * FROM "student_group" LIMIT $1 OFFSET $2`,
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
    const data = await pool.query(`SELECT * FROM "student_group" WHERE id=$1`, [
      id,
    ]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "student_group not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { lid_id, first_name, last_name, phone_number, birthday, gender } =
    req.body;
  try {
    const data = await pool.query(
      `UPDATE "student_group" SET student_id=$1, group_id=$2 WHERE id=$3 RETURNING *`,
      [student_id, group_id, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "student_group not found" });
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
      `DELETE FROM "student_group" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "student_group not found" });
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

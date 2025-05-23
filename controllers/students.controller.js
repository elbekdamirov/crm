const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { lid_id, first_name, last_name, phone_number, birthday, gender } =
      req.body;
    const newstudents = await pool.query(
      `
        INSERT INTO "students" (
        lid_id,
        first_name,
        last_name,
        phone_number,
        birthday,
        gender)
        values ($1, $2, $3, $4, $5, $6) RETURNING *
        `,
      [lid_id, first_name, last_name, phone_number, birthday, gender]
    );

    res.status(201).send(newstudents.rows[0]);
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
      `SELECT * FROM "students" LIMIT $1 OFFSET $2`,
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
    const data = await pool.query(`SELECT * FROM "students" WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "students not found" });
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
      `UPDATE "students" SET lid_id=$1, first_name=$2, last_name=$3, phone_number=$4, birthday=$5, gender=$6 WHERE id=$7 RETURNING *`,
      [lid_id, first_name, last_name, phone_number, birthday, gender, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "students not found" });
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
      `DELETE FROM "students" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "students not found" });
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

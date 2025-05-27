const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, login, password, is_active } =
      req.body;
    const newstuff = await pool.query(
      `
        INSERT INTO "stuff" (
        first_name,
        last_name,
        phone_number,
        login,
        password, 
        is_active)
        values ($1, $2, $3, $4, $5, $6) RETURNING *
        `,
      [first_name, last_name, phone_number, login, password, is_active]
    );

    res.status(201).send(newstuff.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM "stuff" LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM "stuff" WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "stuff not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, login, password, is_active } =
    req.body;
  try {
    const data = await pool.query(
      `UPDATE "stuff" SET first_name=$1, last_name=$2, phone_number=$3, login=$4, password=$5, is_active=$6 WHERE id=$7 RETURNING *`,
      [first_name, last_name, phone_number, login, password, is_active, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "stuff not found" });
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
      `DELETE FROM "stuff" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "stuff not found" });
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

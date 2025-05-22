const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { reasonValidation } = require("../validations/reason.validation");

const create = async (req, res) => {
  try {
    let { error, value } = reasonValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res);
    }

    const { reason_lid } = value;
    const newReason = await pool.query(
      `
        INSERT INTO reason (reason_lid)
        values ($1) RETURNING *
        `,
      [reason_lid]
    );

    res.status(201).send(newReason.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM reason LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM reason WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Reason not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  let { error, value } = reasonValidation(req.body);

  if (error) {
    return sendErrorResponse(error, res);
  }

  const { id } = req.params;
  const { reason_lid } = value;
  try {
    const data = await pool.query(
      `UPDATE reason SET reason_lid=$1 WHERE id=$2 RETURNING *`,
      [reason_lid, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Reason not found" });
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
      `DELETE FROM reason WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Reason not found" });
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

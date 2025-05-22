const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { branchValidation } = require("../validations/branch.validation");

const create = async (req, res) => {
  try {
    let { error, value } = branchValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res);
    }

    const { name, address, call_number } = value;
    const newBranch = await pool.query(
      `
        INSERT INTO branch (name, address, call_number)
        values ($1, $2, $3) RETURNING *
        `,
      [name, address, call_number]
    );

    res.status(201).send(newBranch.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM branch LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM branch WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Branch not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  let { error, value } = branchValidation(req.body);

  if (error) {
    return sendErrorResponse(error, res);
  }

  const { id } = req.params;
  const { name, address, call_number } = value;
  try {
    const data = await pool.query(
      `UPDATE branch SET name=$1, address=$2, call_number=$3 WHERE id=$4 RETURNING *`,
      [name, address, call_number, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Branch not found" });
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
      `DELETE FROM branch WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Branch not found" });
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

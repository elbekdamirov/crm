const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { roleValidation } = require("../validations/role.validation");

const create = async (req, res) => {
  try {
    let { error, value } = roleValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res);
    }

    const { name } = value;
    const newRole = await pool.query(
      `
        INSERT INTO role (name)
        values ($1) RETURNING *
        `,
      [name]
    );

    res.status(201).send(newRole.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM role LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM role WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Role not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  let { error, value } = roleValidation(req.body);

  if (error) {
    return sendErrorResponse(error, res);
  }

  const { id } = req.params;
  const { name } = value;
  try {
    const data = await pool.query(
      `UPDATE role SET name=$1 WHERE id=$2 RETURNING *`,
      [name, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Role not found" });
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
    const data = await pool.query(`DELETE FROM role WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Role not found" });
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

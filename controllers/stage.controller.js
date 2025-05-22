const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
const { stageValidation } = require("../validations/stage.validation");

const create = async (req, res) => {
  try {
    let { error, value } = stageValidation(req.body);

    if (error) {
      return sendErrorResponse(error, res);
    }

    const { name, description } = value;
    const newStage = await pool.query(
      `
        INSERT INTO stage (name, description)
        values ($1, $2) RETURNING *
        `,
      [name, description]
    );

    res.status(201).send(newStage.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM stage LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM stage WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Stage not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  let { error, value } = stageValidation(req.body);

  if (error) {
    return sendErrorResponse(error, res);
  }

  const { id } = req.params;
  const { name, description } = value;
  try {
    const data = await pool.query(
      `UPDATE stage SET name=$1, description=$2 WHERE id=$3 RETURNING *`,
      [name, description, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Stage not found" });
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
    const data = await pool.query(`DELETE FROM stage WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Stage not found" });
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

const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      stage_id,
      test_date,
      trial_lesson_date,
      trial_lesson_time,
      trial_lesson_group_id,
      status_id,
      cancel_reason_id,
    } = req.body;
    const newGroup = await pool.query(
      `
        INSERT INTO lid (
        first_name,
        last_name,
        phone_number,
        stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        status_id,
        cancel_reason_id)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `,
      [
        first_name,
        last_name,
        phone_number,
        stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        status_id,
        cancel_reason_id,
      ]
    );

    res.status(201).send(newGroup.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  let { limit, offset } = req.query;

  limit = limit ? parseInt(limit) : 10;
  offset = offset ? parseInt(offset) : 1;

  try {
    const data = await pool.query(`SELECT * FROM lid LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM lid WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Lid not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    phone_number,
    stage_id,
    test_date,
    trial_lesson_date,
    trial_lesson_time,
    trial_lesson_group_id,
    status_id,
    cancel_reason_id,
  } = req.body;
  try {
    const data = await pool.query(
      `UPDATE lid SET first_name=$1, last_name=$2, phone_number=$3, stage_id=$4, test_date=$5, trial_lesson_date=$6, trial_lesson_time=$7, trial_lesson_group_id=$8, status_id=$9, cancel_reason_id=$10 WHERE id=$11 RETURNING *`,
      [
        first_name,
        last_name,
        phone_number,
        stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        status_id,
        cancel_reason_id,
        id,
      ]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Lid not found" });
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
    const data = await pool.query(`DELETE FROM lid WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Lid not found" });
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

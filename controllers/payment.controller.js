const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const {
      student_id,
      last_date,
      payment_date,
      price,
      is_paid,
      total_attent,
    } = req.body;
    const newPayment = await pool.query(
      `
        INSERT INTO "payment" (
        student_id,
        last_date,
        payment_date,
        price,
        is_paid,
        total_attent)
        values ($1, $2, $3, $4, $5, $6) RETURNING *
        `,
      [student_id, last_date, payment_date, price, is_paid, total_attent]
    );

    res.status(201).send(newPayment.rows[0]);
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
      `SELECT * FROM "payment" LIMIT $1 OFFSET $2`,
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
    const data = await pool.query(`SELECT * FROM "payment" WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Payment not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { student_id, last_date, payment_date, price, is_paid, total_attent } =
    req.body;
  try {
    const data = await pool.query(
      `UPDATE "payment" SET student_id=$1, last_date=$2, payment_date=$3, price=$4, is_paid=$5, total_attent=$6 WHERE id=$7 RETURNING *`,
      [student_id, last_date, payment_date, price, is_paid, total_attent, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Payment not found" });
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
      `DELETE FROM "payment" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Payment not found" });
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

const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");

const create = async (req, res) => {
  try {
    const { group_id, stuff_id } = req.body;
    const newgroup_stuff = await pool.query(
      `
        INSERT INTO "group_stuff" (
        group_id,
        stuff_id)
        values ($1, $2) RETURNING *
        `,
      [group_id, stuff_id]
    );

    res.status(201).send(newgroup_stuff.rows[0]);
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
      `SELECT * FROM "group_stuff" LIMIT $1 OFFSET $2`,
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
    const data = await pool.query(`SELECT * FROM "group_stuff" WHERE id=$1`, [
      id,
    ]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "group_stuff not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { group_id, stuff_id } = req.body;
  try {
    const data = await pool.query(
      `UPDATE "group_stuff" SET group_id=$1, stuff_id=$2 WHERE id=$3 RETURNING *`,
      [group_id, stuff_id, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "group_stuff not found" });
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
      `DELETE FROM "group_stuff" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "group_stuff not found" });
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

const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
// const { groupValidation } = require("../validations/group.validation");

const create = async (req, res) => {
  try {
    // let { error, value } = groupValidation(req.body);

    // if (error) {
    //   return sendErrorResponse(error, res);
    // }

    const {
      name,
      lesson_start_time,
      lesson_end_time,
      lesson_week_day,
      stage_id,
      branch_id,
      room_floor,
      room,
      lessons_quantity,
    } = req.body;
    const newGroup = await pool.query(
      `
        INSERT INTO "group" (
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_day,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_day,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
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
    const data = await pool.query(`SELECT * FROM "group" LIMIT $1 OFFSET $2`, [
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
    const data = await pool.query(`SELECT * FROM "group" WHERE id=$1`, [id]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  //   let { error, value } = groupValidation(req.body);

  //   if (error) {
  //     return sendErrorResponse(error, res);
  //   }

  const { id } = req.params;
  const {
    name,
    lesson_start_time,
    lesson_end_time,
    lesson_week_day,
    stage_id,
    branch_id,
    room_floor,
    room,
    lessons_quantity,
  } = req.body;
  try {
    const data = await pool.query(
      `UPDATE "group" SET name=$1, lesson_start_time=$2, lesson_end_time=$3, lesson_week_day=$4, stage_id=$5, branch_id=$6, room_floor=$7, room=$8, lessons_quantity=$9 WHERE id=$10 RETURNING *`,
      [
        name,
        lesson_start_time,
        lesson_end_time,
        lesson_week_day,
        stage_id,
        branch_id,
        room_floor,
        room,
        lessons_quantity,
        id,
      ]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Group not found" });
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
    const data = await pool.query(`DELETE FROM "group" WHERE id=$1 RETURNING *`, [
      id,
    ]);

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Group not found" });
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

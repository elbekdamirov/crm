const pool = require("../config/db");
const { sendErrorResponse } = require("../helpers/send_error_response");
// const { device_tokensValidation } = require("../validations/device_tokens.validation");
const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const create = async (req, res) => {
  try {
    // let { error, value } = device_tokensValidation(req.body);

    // if (error) {
    //   return sendErrorResponse(error, res);
    // }    

    const { user_id, token } = req.body;
    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);

    const { device, os, client } = result;

    const newDevice = await pool.query(
      `
        INSERT INTO "device_tokens" (
        user_id,
        device,
        os,
        client,
        token)
        values ($1, $2, $3, $4, $5) RETURNING *
        `,
      [user_id, device, os, client, token]
    );

    res.status(201).send(newDevice.rows[0]);
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
      `SELECT * FROM "device_tokens" LIMIT $1 OFFSET $2`,
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
    const data = await pool.query(`SELECT * FROM "device_tokens" WHERE id=$1`, [
      id,
    ]);

    if (data.rows.length === 0) {
      return res.status(404).send({ message: "Device not found" });
    }

    res.status(200).send(data.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  //   let { error, value } = device_tokensValidation(req.body);

  //   if (error) {
  //     return sendErrorResponse(error, res);
  //   }

  const { id } = req.params;
  const { user_id, device, os, client, token } = req.body;
  try {
    const data = await pool.query(
      `UPDATE "device_tokens" SET user_id=$1, device=$2, os=$3, client=$4, token=$5 WHERE id=$6 RETURNING *`,
      [user_id, device, os, client, token, id]
    );
    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Device not found" });
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
      `DELETE FROM "device_tokens" WHERE id=$1 RETURNING *`,
      [id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ message: "Device not found" });
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

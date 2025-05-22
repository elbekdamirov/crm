const stageRouter = require("./stage.routes");
const roleRouter = require("./role.routes");
const statusRouter = require("./status.routes");

const router = require("express").Router();

router.use("/stage", stageRouter);
router.use("/role", roleRouter);
router.use("/status", statusRouter);

module.exports = router;

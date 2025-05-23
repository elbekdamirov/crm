const stageRouter = require("./stage.routes");
const roleRouter = require("./role.routes");
const statusRouter = require("./status.routes");
const reasonRouter = require("./reason.routes");
const branchRouter = require("./branch.routes");
const groupRouter = require("./group.routes");
const deviceRouter = require("./device.routes");
const lidRouter = require("./lid.routes");
const studentsRouter = require("./students.routes");
const paymentRouter = require("./payment.routes");

const router = require("express").Router();

router.use("/stage", stageRouter);
router.use("/role", roleRouter);
router.use("/status", statusRouter);
router.use("/reason", reasonRouter);
router.use("/branch", branchRouter);
router.use("/group", groupRouter);
router.use("/device", deviceRouter);
router.use("/lid", lidRouter);
router.use("/students", studentsRouter);
router.use("/payment", paymentRouter);

module.exports = router;

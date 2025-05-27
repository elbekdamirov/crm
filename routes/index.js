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
const studentGroupRouter = require("./student_group.routes");
const lessonRouter = require("./lesson.routes");
const studentLessonRouter = require("./student_lesson.routes");
const otpRouter = require("./otp.routes");
const stuffRouter = require("./stuff.routes");
const groupStuffRouter = require("./group_staff.routes");
const stuffRoleRouter = require("./stuff_role.routes");

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
router.use("/student-group", studentGroupRouter);
router.use("/lesson", lessonRouter);
router.use("/student-lesson", studentLessonRouter);
router.use("/otp", otpRouter);
router.use("/stuff", stuffRouter);
router.use("/group-stuff", groupStuffRouter);
router.use("/stuff-role", stuffRoleRouter);

module.exports = router;

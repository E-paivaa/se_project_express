const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const { SERVER_ERROR } = require("../utils/errors").default;

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(SERVER_ERROR).send({ message: "Router not found" });
});

module.exports = router;

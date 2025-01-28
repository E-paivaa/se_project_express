const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const { ERROR_CODES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");


router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);
router.use("/users", auth,  userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;

const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const { ERROR_CODES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateAuthenticatingUser, validateCreatingUser,} = require("../middlewares/validation");

router.post("/signin", validateAuthenticatingUser, login);
router.post("/signup", validateCreatingUser, createUser);
router.use("/items", clothingItem);
router.use("/users", auth,  userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;

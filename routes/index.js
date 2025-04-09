const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const NotFoundError = require('../utils/errors/not-found-error');
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateAuthenticatingUser, validateCreatingUser,} = require("../middlewares/validation");

router.post("/signin", validateAuthenticatingUser, login);
router.post("/signup", validateCreatingUser, createUser);
router.use("/items", clothingItem);
router.use("/users", auth,  userRouter);

router.use((req, res, next) => {
  next(new NotFoundError);
});

module.exports = router;

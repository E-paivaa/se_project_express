const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/user");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;

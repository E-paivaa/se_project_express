const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getItems, createItem, deleteItem, likeItem, unlikeItem } = require("../controllers/clothingItems");
const { validateId, validateClothingItem } = require("../middlewares/validation");

router.get("/", getItems);
router.use(auth);
router.post("/", validateClothingItem, createItem);
router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, unlikeItem);

module.exports = router;

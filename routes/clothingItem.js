const router = require('express').Router();
const { getItems, createItem, updateItem, deleteItem, likeItem, unlikeItem } = require('../controllers/clothingItems');

router.get('/', getItems);
router.post('/', createItem);
router.get('/:itemId', updateItem);
router.delete('/:itemId', deleteItem);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;
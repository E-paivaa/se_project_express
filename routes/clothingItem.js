const router = require('express').Router();
const { getItems, createItem, deleteItem, likeItem, unlikeItem, updateItem } = require('../controllers/clothingItems');

router.get('/', getItems);
router.post('/', createItem);
router.put('/:itemId', updateItem);
router.delete('/:itemId', deleteItem);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;
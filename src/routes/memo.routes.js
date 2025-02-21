const express = require('express');
const router = express.Router();
const { MemoController } = require('../controllers/memo.controller');

router.post('/', MemoController.createMemo);
router.get('/user/:userid', MemoController.getMemosByUserId);
router.get('/:id', MemoController.getMemoById);
router.put('/:id', MemoController.updateMemo);
router.delete('/:id', MemoController.deleteMemo);

module.exports = router;
const { MemoService } = require('../services/memo.service');

class MemoController {
  static async createMemo(req, res, next) {
    try {
      const { userid, text } = req.body;


      if (!userid || !text) {
        return res.status(400).json({
          message: 'User ID and text are required'
        });s
      }

      const memo = await MemoService.createMemo({
        userid,
        text
      });

      res.status(201).json(memo);
    } catch (error) {
      next(error);
    }
  }

  static async getMemosByUserId(req, res, next) {
    try {
      const { userid } = req.params;

      if (!userid) {
        return res.status(400).json({
          message: 'User ID is required'
        });
      }

      const memos = await MemoService.getMemosByUserId(userid);
      res.json(memos);
    } catch (error) {
      next(error);
    }
  }

  static async getMemoById(req, res, next) {
    try {
      const memo = await MemoService.getMemoById(req.params.id);

      if (!memo) {
        return res.status(404).json({ message: 'Memo not found' });
      }

      res.json(memo);
    } catch (error) {
      next(error);
    }
  }

  static async updateMemo(req, res, next) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          message: 'Text is required'
        });
      }

      const memo = await MemoService.updateMemo(req.params.id, text);

      if (!memo) {
        return res.status(404).json({ message: 'Memo not found' });
      }

      res.json(memo);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMemo(req, res, next) {
    try {
      const success = await MemoService.deleteMemo(req.params.id);

      if (!success) {
        return res.status(404).json({ message: 'Memo not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { MemoController };
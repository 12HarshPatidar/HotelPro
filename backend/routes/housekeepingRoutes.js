const express = require('express');
const {
  getTasks,
  createTask,
  updateTaskStatus,
} = require('../controllers/housekeepingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('staff', 'admin'));

router.route('/')
  .get(getTasks)
  .post(createTask);

router.put('/:id', updateTaskStatus);

module.exports = router;

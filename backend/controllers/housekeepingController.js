const HousekeepingTask = require('../models/HousekeepingTask');
const Room = require('../models/Room');
const { logAudit } = require('../services/auditService');

// @desc    Get housekeeping tasks
// @route   GET /api/housekeeping
// @access  Private (Staff / Admin)
exports.getTasks = async (req, res, next) => {
  try {
    const { status, hotelId } = req.query;
    const query = {};

    if (hotelId) query.hotelId = hotelId;
    if (status) query.status = status;

    const tasks = await HousekeepingTask.find(query)
      .populate('hotelId', 'name city')
      .populate('roomId', 'roomNumber floor status')
      .populate('assignedStaffId', 'name email')
      .sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a housekeeping task manually
// @route   POST /api/housekeeping
// @access  Private (Staff / Admin)
exports.createTask = async (req, res, next) => {
  try {
    const { hotelId, roomId, assignedStaffId, priority, taskType, notes } = req.body;

    const task = await HousekeepingTask.create({
      hotelId,
      roomId,
      assignedStaffId: assignedStaffId || req.user._id,
      priority: priority || 'medium',
      taskType: taskType || 'daily_refresh',
      notes: notes || '',
      status: 'pending',
    });

    // Mark room as cleaning if not occupied
    const room = await Room.findById(roomId);
    if (room && room.status === 'available') {
      room.status = 'cleaning';
      await room.save();
    }

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/housekeeping/:id
// @access  Private (Staff / Admin)
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const update = { status };

    if (notes) update.notes = notes;
    if (status === 'completed') {
      update.completedAt = new Date();
    }
    if (status === 'in_progress' && !req.body.assignedStaffId) {
      update.assignedStaffId = req.user._id;
    }

    const task = await HousekeepingTask.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('roomId');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Housekeeping task not found' });
    }

    // If cleaning completed and room was 'cleaning', transition back to 'available'
    if (status === 'completed' && task.roomId) {
      await Room.findByIdAndUpdate(task.roomId._id, { status: 'available' });
    }

    await logAudit({
      actorId: req.user._id,
      action: 'HOUSEKEEPING_TASK_UPDATE',
      entityType: 'HousekeepingTask',
      entityId: task._id,
      details: { status, roomId: task.roomId?._id },
      req,
    });

    res.status(200).json({
      success: true,
      message: `Housekeeping task status updated to ${status}`,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

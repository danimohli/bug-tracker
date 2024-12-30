const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create Task
router.post('/', async (req, res) => {
  const { userId, title, description, deadline, priority } = req.body;

  try {
    const newTask = new Task({
      userId,
      title,
      description,
      deadline,
      priority,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Tasks
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Project = require('../models/Project');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Create a project
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({ name, description, createdBy: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all projects
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

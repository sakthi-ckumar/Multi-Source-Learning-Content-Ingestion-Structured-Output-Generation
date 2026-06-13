const express = require('express');
const multer = require('multer');
const path = require('path');
const Content = require('../models/Content');
const { extractTextFromFile } = require('../services/extractor');
const { generateLearningArtifacts } = require('../services/generator');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/ingest', upload.single('file'), async (req, res) => {
  try {
    const { title, topic } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const rawText = await extractTextFromFile(req.file);
    const artifacts = generateLearningArtifacts(rawText, topic || title);

    const content = await Content.create({
      title: title || req.file.originalname,
      originalFileName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      topic: topic || title || 'General',
      rawText,
      ...artifacts
    });

    res.status(201).json({
      message: 'Content ingested successfully',
      content
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to ingest content',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? {
      $or: [
        { topic: { $regex: topic, $options: 'i' } },
        { title: { $regex: topic, $options: 'i' } },
        { summary: { $regex: topic, $options: 'i' } }
      ]
    } : {};

    const contents = await Content.find(filter)
      .select('-rawText')
      .sort({ createdAt: -1 });

    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contents', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch content', error: error.message });
  }
});

router.get('/:id/export/flashcards', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    const csvRows = ['Question,Answer'];
    content.flashcards.forEach(card => {
      const q = `"${card.question.replace(/"/g, '""')}"`;
      const a = `"${card.answer.replace(/"/g, '""')}"`;
      csvRows.push(`${q},${a}`);
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${content.title}-flashcards.csv"`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

router.get('/:id/export/json', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).select('-rawText');
    if (!content) return res.status(404).json({ message: 'Content not found' });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${content.title}-learning-artifacts.json"`);
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

module.exports = router;

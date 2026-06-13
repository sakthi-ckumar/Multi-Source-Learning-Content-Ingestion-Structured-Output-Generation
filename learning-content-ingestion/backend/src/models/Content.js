const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String
}, { _id: false });

const conceptNodeSchema = new mongoose.Schema({
  id: String,
  label: String,
  level: Number
}, { _id: false });

const conceptEdgeSchema = new mongoose.Schema({
  from: String,
  to: String
}, { _id: false });

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalFileName: String,
  fileType: String,
  topic: { type: String, index: true },
  rawText: String,
  summary: String,
  keyConcepts: [String],
  hierarchy: [String],
  flashcards: [flashcardSchema],
  conceptGraph: {
    nodes: [conceptNodeSchema],
    edges: [conceptEdgeSchema]
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);

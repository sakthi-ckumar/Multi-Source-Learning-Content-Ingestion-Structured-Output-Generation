const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Content = require('./models/Content');
const { generateLearningArtifacts } = require('./services/generator');

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleText = `React is a JavaScript library for building user interfaces. Components are reusable UI blocks. State is used to manage dynamic data. Props are used to pass data between components. Hooks such as useState and useEffect help manage state and lifecycle behavior. API integration connects the frontend with backend services. Performance optimization includes memoization, lazy loading, code splitting, and virtualization.`;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Content.deleteMany();
    const artifacts = generateLearningArtifacts(sampleText, 'React Fundamentals');
    await Content.create({
      title: 'React Fundamentals Sample',
      originalFileName: 'sample.txt',
      fileType: '.txt',
      topic: 'React Fundamentals',
      rawText: sampleText,
      ...artifacts
    });
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

seed();

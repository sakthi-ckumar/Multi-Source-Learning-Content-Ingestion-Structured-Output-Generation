function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-Z0-9.,:;!?()\- ]/g, '')
    .trim();
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.length > 40);
}

function getWordFrequency(text) {
  const stopWords = new Set([
    'the','and','for','with','this','that','from','are','was','were','you','your','have','has','had','will','can','could','would','should','into','about','which','when','where','their','there','then','than','also','using','used','use','each','more','such','these','those','they','them','its','our','out','all','one','two','how','what','why','who','while','over','under','within','between','through','during','before','after','based'
  ]);

  const words = cleanText(text).toLowerCase().match(/[a-zA-Z]{4,}/g) || [];
  const frequency = {};

  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);
}

function generateSummary(text) {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return cleanText(text).slice(0, 500);
  return sentences.slice(0, 5).join(' ');
}

function generateKeyConcepts(text) {
  return getWordFrequency(text).map(word => word.charAt(0).toUpperCase() + word.slice(1));
}

function generateHierarchy(text, topic) {
  const concepts = generateKeyConcepts(text).slice(0, 6);
  return [topic || 'Learning Content', ...concepts];
}

function generateFlashcards(text) {
  const concepts = generateKeyConcepts(text).slice(0, 8);
  const sentences = splitSentences(text);

  return concepts.map((concept, index) => {
    const relatedSentence = sentences.find(sentence => sentence.toLowerCase().includes(concept.toLowerCase())) || sentences[index] || 'Review this concept from the uploaded content.';
    return {
      question: `What is the importance of ${concept}?`,
      answer: relatedSentence.slice(0, 250)
    };
  });
}

function generateConceptGraph(text, topic) {
  const mainTopic = topic || 'Learning Content';
  const concepts = generateKeyConcepts(text).slice(0, 8);

  const nodes = [
    { id: 'root', label: mainTopic, level: 0 },
    ...concepts.map((concept, index) => ({
      id: `concept_${index + 1}`,
      label: concept,
      level: 1
    }))
  ];

  const edges = concepts.map((_, index) => ({
    from: 'root',
    to: `concept_${index + 1}`
  }));

  return { nodes, edges };
}

function generateLearningArtifacts(text, topic) {
  const normalizedText = cleanText(text);
  return {
    summary: generateSummary(normalizedText),
    keyConcepts: generateKeyConcepts(normalizedText),
    hierarchy: generateHierarchy(normalizedText, topic),
    flashcards: generateFlashcards(normalizedText),
    conceptGraph: generateConceptGraph(normalizedText, topic)
  };
}

module.exports = { generateLearningArtifacts };

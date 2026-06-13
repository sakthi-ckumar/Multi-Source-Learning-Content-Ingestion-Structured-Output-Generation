function ArtifactViewer({ content }) {
  if (!content) {
    return (
      <div className="card artifact-placeholder">
        <div className="ph-icon"></div>
        <p>Select uploaded content to view generated artifacts</p>
      </div>
    );
  }

  const apiBase = 'http://localhost:5002/api';

  return (
    <div className="artifact-viewer">
      {/* Title card */}
      <div className="card title-card">
        <h2>{content.title}</h2>
        <p className="meta">Topic: <span>{content.topic}</span></p>
        <p className="meta">File: <span>{content.originalFileName}</span></p>
        <div className="actions">
          <a className="btn-export csv" href={`${apiBase}/content/${content._id}/export/flashcards`} target="_blank">
            Export Flashcards CSV
          </a>
          <a className="btn-export json" href={`${apiBase}/content/${content._id}/export/json`} target="_blank">
            Export JSON
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="card section-summary">
        <h3>Summary</h3>
        <p>{content.summary}</p>
      </div>

      {/* Key Concepts */}
      <div className="card section-concepts">
        <h3>Key Concepts</h3>
        <div className="tags">
          {content.keyConcepts?.map((concept) => (
            <span key={concept} className="concept-tag">{concept}</span>
          ))}
        </div>
      </div>

      {/* Topic Hierarchy */}
      <div className="card section-hierarchy">
        <h3>Topic Hierarchy</h3>
        <ol className="hierarchy-list">
          {content.hierarchy?.map((item, i) => (
            <li key={item}>
              <span className="step-num">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>

      {/* Flashcards */}
      <div className="card section-flashcards">
        <h3>Flashcards <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.82rem' }}>({content.flashcards?.length || 0})</span></h3>
        <div className="flashcards-grid">
          {content.flashcards?.map((card, index) => (
            <div className="flashcard" key={`${card.question}-${index}`}>
              <div className="flashcard-q">Q: {card.question}</div>
              <div className="flashcard-a">A: {card.answer}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Graph */}
      <div className="card section-graph">
        <h3>Concept Graph</h3>
        <div className="graph-box">
          <div className="root-node">
            {content.conceptGraph?.nodes?.[0]?.label}
          </div>
          <div className="graph-connector">
            <div className="graph-line" />
          </div>
          <div className="child-nodes">
            {content.conceptGraph?.nodes?.slice(1).map((node) => (
              <span key={node.id} className="child-node">{node.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtifactViewer;

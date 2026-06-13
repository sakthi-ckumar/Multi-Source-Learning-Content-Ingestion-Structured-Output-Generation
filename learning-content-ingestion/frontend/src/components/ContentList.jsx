function ContentList({ contents, selectedId, onSelect }) {
  if (contents.length === 0) {
    return (
      <div className="card" style={{ background: '#fefce8', borderColor: '#fde68a' }}>
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No content yet. Upload a file to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card content-list-card">
      <h2>Uploaded Content <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.85rem' }}>({contents.length})</span></h2>
      <div className="content-list">
        {contents.map((item) => (
          <button
            key={item._id}
            className={`content-item ${selectedId === item._id ? 'active' : ''}`}
            onClick={() => onSelect(item._id)}
          >
            <strong>{item.title}</strong>
            <span className="topic-badge">{item.topic}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContentList;

import { useEffect, useState } from 'react';
import api from './api';
import UploadForm from './components/UploadForm';
import ContentList from './components/ContentList';
import ArtifactViewer from './components/ArtifactViewer';

function App() {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContents = async (searchTerm = topic) => {
    setLoading(true);
    try {
      const response = await api.get('/content', { params: searchTerm ? { topic: searchTerm } : {} });
      setContents(response.data);
      if (response.data.length > 0 && !selectedContent) {
        fetchContentDetails(response.data[0]._id);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const fetchContentDetails = async (id) => {
    try {
      const response = await api.get(`/content/${id}`);
      setSelectedContent(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to fetch details');
    }
  };

  useEffect(() => { fetchContents(); }, []);

  return (
    <div className="app">
      <header className="hero">
        <h1>Multi-Source Learning Content Ingestion</h1>
        <p>Upload documents & transcripts — get summaries, flashcards, concept graphs and more.</p>
        <div className="hero-badges">
          {['PDF', 'DOCX', 'TXT', 'MD', 'CSV', 'JSON', 'SRT', 'VTT'].map(f => (
            <span key={f} className="hero-badge">{f}</span>
          ))}
        </div>
      </header>

      <main className="layout">
        <section className="left-panel">
          <UploadForm onUploaded={fetchContents} />

          <div className="card" style={{ marginBottom: '18px', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="search-box">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Search by topic..."
                onKeyDown={(e) => e.key === 'Enter' && fetchContents(topic)}
              />
              <button className="btn-search" onClick={() => fetchContents(topic)}>Search</button>
            </div>
          </div>

          {loading ? (
            <div className="card">
              <div className="loading-wrap"><div className="spinner" /> Fetching content...</div>
            </div>
          ) : (
            <ContentList contents={contents} selectedId={selectedContent?._id} onSelect={fetchContentDetails} />
          )}
        </section>

        <section className="right-panel">
          <ArtifactViewer content={selectedContent} />
        </section>
      </main>
    </div>
  );
}

export default App;

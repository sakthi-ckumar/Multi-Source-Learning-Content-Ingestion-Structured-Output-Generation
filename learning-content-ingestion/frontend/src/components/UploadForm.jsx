import { useState } from 'react';
import api from '../api';

function UploadForm({ onUploaded }) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) { setStatus('Please choose a file'); setStatusType('error'); return; }

    const formData = new FormData();
    formData.append('title', title || file.name);
    formData.append('topic', topic || title || 'General');
    formData.append('file', file);

    try {
      setStatus('Uploading and generating artifacts...'); setStatusType('loading');
      await api.post('/content/ingest', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('Content ingested successfully!'); setStatusType('success');
      setTitle(''); setTopic(''); setFile(null);
      event.target.reset();
      onUploaded();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Upload failed'); setStatusType('error');
    }
  };

  return (
    <form className="upload-form card" onSubmit={handleSubmit}>

      <div className="upload-form-header">
        <div className="upload-form-icon"></div>
        <div>
          <h2 style={{ margin: 0 }}>Upload Content</h2>
          <p className="upload-form-sub">Supports PDF, DOCX, TXT, MD, CSV, JSON, SRT, VTT</p>
        </div>
      </div>

      <div className="form-divider" />

      <div className="form-field">
        <label className="form-label">Title <span className="form-optional">optional</span></label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction to React"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Topic <span className="form-optional">optional</span></label>
        <input
          className="form-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. JavaScript, Machine Learning"
        />
      </div>

      <div className="form-field">
        <label className="form-label">File</label>
        <label className={`file-dropzone ${file ? 'has-file' : ''}`}>
          <div className="file-dropzone-icon"></div>
          <div className="file-dropzone-text">
            {file ? file.name : 'Click to browse or drop your file here'}
          </div>
          <div className="file-dropzone-hint">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF · DOCX · TXT · MD · CSV · JSON · SRT · VTT'}
          </div>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.csv,.json,.srt,.vtt"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </label>
      </div>

      <button type="submit" className="btn-primary">Generate Learning Artifacts</button>

      {status && <p className={`status ${statusType}`}>{status}</p>}
    </form>
  );
}

export default UploadForm;

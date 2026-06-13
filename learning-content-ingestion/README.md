# Challenge 3: Multi-Source Learning Content Ingestion and Structured Output Generation

## Objective
This project ingests learning content from PDFs, DOCX files, text files, transcripts, and other supported text formats. It extracts text, identifies key concepts, generates a summary, creates flashcards, builds a topic hierarchy, and creates a simple concept graph.

## Tech Stack
- Frontend: React, Vite, Axios
- Backend: Node.js, Express.js, MongoDB, Multer
- Parsing: pdf-parse, mammoth
- Storage: MongoDB

## Supported File Types
- PDF
- DOCX
- TXT
- MD
- CSV
- JSON
- SRT
- VTT

For videos, upload the transcript file in SRT, VTT, TXT, or MD format.

## Features
- Upload learning content
- Extract text from documents
- Generate summary
- Generate key concepts
- Generate flashcards
- Generate topic hierarchy
- Generate concept graph
- Retrieve content by topic
- Export flashcards as CSV
- Export artifacts as JSON

## Folder Structure

```bash
learning-content-ingestion
├── backend
│   ├── src
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── seed.js
│   │   └── server.js
│   ├── uploads
│   ├── .env
│   └── package.json
└── frontend
    ├── src
    │   ├── components
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── style.css
    ├── index.html
    └── package.json
```

## Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running locally.

Default MongoDB URL:

```bash
mongodb://127.0.0.1:27017
```

### 2. Start Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs on:

```bash
http://localhost:5002
```

### 3. Start Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

## API Endpoints

### Upload and ingest content

```http
POST /api/content/ingest
```

Form data:
- title
- topic
- file

### Get all content

```http
GET /api/content
```

### Search by topic

```http
GET /api/content?topic=React
```

### Get content details

```http
GET /api/content/:id
```

### Export flashcards CSV

```http
GET /api/content/:id/export/flashcards
```

### Export JSON artifacts

```http
GET /api/content/:id/export/json
```

## Interview Explanation Speech Script

Sir, for this challenge, I built a Multi-Source Learning Content Ingestion tool.

The main purpose of this application is to upload learning materials such as PDFs, documents, text files, and transcripts, extract the content, and generate structured learning outputs.

On the backend, I used Node.js, Express.js, MongoDB, Multer, pdf-parse, and mammoth. Multer handles file upload, pdf-parse extracts text from PDF files, and mammoth extracts text from DOCX files. After extracting the text, I used a rule-based processing service to generate summaries, key concepts, flashcards, topic hierarchy, and a concept graph.

On the frontend, I used React.js and Axios. The user can upload a file with a title and topic, view all uploaded content, search by topic, and view the generated artifacts. I also added export functionality for flashcards in CSV format and complete learning artifacts in JSON format.

This project demonstrates full-stack development, file upload handling, document parsing, structured data generation, MongoDB storage, topic-based retrieval, and clean UI presentation.
